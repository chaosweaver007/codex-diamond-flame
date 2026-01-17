import { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "../db";
import { users, purchases, unlockedScrolls } from "../../drizzle/schema";
import { and, eq } from "drizzle-orm";
import { SCROLL_BY_ID } from "@shared/scrolls";
import { ARTIFACTS, MEMBERSHIP_TIERS } from "./products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

function deriveScrollId(productId: string) {
  return productId.startsWith("scroll_") ? productId.replace("scroll_", "") : productId;
}

function normalizePurchaseStatus(
  status: Stripe.Checkout.Session.PaymentStatus | Stripe.PaymentIntent.Status | null | undefined
): "completed" | "pending" | "refunded" {
  if (!status) return "pending";
  if (status === "paid" || status === "no_payment_required" || status === "succeeded") return "completed";
  if (status === "canceled") return "refunded";
  return "pending";
}

async function recordPurchaseAndUnlock({
  userId,
  productId,
  productType,
  paymentIntentId,
  amountCents,
  currency,
  status,
  tier,
  shouldUnlock = true,
}: {
  userId: number;
  productId: string;
  productType: "scroll" | "artifact" | "membership" | "ritual";
  paymentIntentId: string;
  amountCents?: number | null;
  currency?: string | null;
  status?: "pending" | "completed" | "refunded";
  tier?: string | null;
  shouldUnlock?: boolean;
}) {
  const db = await getDb();
  if (!db) return;

  const existingPurchase = await db
    .select({ id: purchases.id })
    .from(purchases)
    .where(eq(purchases.stripePaymentIntentId, paymentIntentId))
    .limit(1);
  if (existingPurchase.length > 0) {
    return;
  }

  const computedStatus = status ?? "completed";
  const normalizedCurrency = currency ?? "usd";

  let computedAmount = amountCents ?? 0;

  if (!computedAmount) {
    if (productType === "scroll") {
      const scrollId = deriveScrollId(productId);
      computedAmount = SCROLL_BY_ID[scrollId]?.priceCents ?? 0;
    } else if (productType === "artifact" || productType === "ritual") {
      computedAmount = ARTIFACTS[productId as keyof typeof ARTIFACTS]?.price ?? 0;
    } else if (productType === "membership" && tier) {
      computedAmount = MEMBERSHIP_TIERS[tier as keyof typeof MEMBERSHIP_TIERS]?.priceMonthly ?? 0;
    }
  }

  await db.insert(purchases).values({
    userId,
    stripePaymentIntentId: paymentIntentId,
    productType,
    productId,
    amountCents: computedAmount,
    currency: normalizedCurrency,
    status: computedStatus,
  });

  if (productType === "scroll" && shouldUnlock) {
    const scrollId = deriveScrollId(productId);
    const unlocked = await db
      .select({ id: unlockedScrolls.id })
      .from(unlockedScrolls)
      .where(and(eq(unlockedScrolls.userId, userId), eq(unlockedScrolls.scrollId, scrollId)))
      .limit(1);

    if (unlocked.length === 0) {
      await db.insert(unlockedScrolls).values({
        userId,
        scrollId,
        unlockedAt: new Date(),
      });
      console.log(`[Webhook] Scroll ${scrollId} unlocked for user ${userId}`);
    }
  }
}

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[Webhook] Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events for verification
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        console.log(`[Webhook] Async payment succeeded for session: ${session.id}`);
        break;
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Webhook] Invoice paid: ${invoice.id}`);
        break;
      }
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error(`[Webhook] Error processing event: ${error}`);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const db = await getDb();
  if (!db) return;

  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error("[Webhook] No user_id in session metadata");
    return;
  }

  const userIdNum = parseInt(userId, 10);

  // Update user's Stripe customer ID if not set
  if (session.customer) {
    await db
      .update(users)
      .set({ stripeCustomerId: session.customer as string })
      .where(eq(users.id, userIdNum));
  }

  const productId = session.metadata?.product_id;
  const productType = session.metadata?.product_type as any;
  const tier = session.metadata?.tier || null;

  // Avoid unlocking until payment is confirmed
  const paymentStatus = normalizePurchaseStatus(session.payment_status);
  const shouldUnlock = paymentStatus === "completed";

  if (productId && productType) {
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || session.id;

    await recordPurchaseAndUnlock({
      userId: userIdNum,
      productId,
      productType,
      paymentIntentId,
      amountCents: session.amount_total,
      currency: session.currency || "usd",
      status: paymentStatus,
      tier,
      shouldUnlock,
    });

    console.log(`[Webhook] Purchase recorded: ${productType} - ${productId} for user ${userId}`);
  }

  // Handle subscription tier upgrade if applicable
  if (session.mode === "subscription" && session.subscription) {
    await db
      .update(users)
      .set({ stripeSubscriptionId: session.subscription as string })
      .where(eq(users.id, userIdNum));

    if (tier) {
      await db.update(users).set({ tier }).where(eq(users.id, userIdNum));
      console.log(`[Webhook] User ${userId} upgraded to tier: ${tier}`);
    }
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const metadata = paymentIntent.metadata || {};
  const userId = metadata.user_id;
  const productId = metadata.product_id;
  const productType = metadata.product_type as any;

  if (!userId || !productId || !productType) {
    console.warn("[Webhook] PaymentIntent missing metadata, skipping purchase record");
    return;
  }

  const status = normalizePurchaseStatus(paymentIntent.status);

  await recordPurchaseAndUnlock({
    userId: parseInt(userId, 10),
    productId,
    productType,
    paymentIntentId: paymentIntent.id,
    amountCents: paymentIntent.amount_received ?? paymentIntent.amount ?? undefined,
    currency: paymentIntent.currency ?? "usd",
    status,
    tier: metadata.tier || null,
    shouldUnlock: status === "completed",
  });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) return;

  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (result.length === 0) {
    console.error(`[Webhook] No user found for customer: ${customerId}`);
    return;
  }

  const user = result[0];

  // Update subscription ID
  await db
    .update(users)
    .set({ stripeSubscriptionId: subscription.id })
    .where(eq(users.id, user.id));

  console.log(`[Webhook] Subscription updated for user ${user.id}: ${subscription.status}`);
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) return;

  const customerId = subscription.customer as string;

  // Find user and downgrade to ember
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (result.length === 0) return;

  await db
    .update(users)
    .set({
      tier: "ember",
      stripeSubscriptionId: null,
    })
    .where(eq(users.id, result[0].id));

  console.log(`[Webhook] Subscription canceled for user ${result[0].id}, downgraded to ember`);
}
