import { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "../db";
import { users, purchases, unlockedScrolls } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

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
        // Handle delayed payment methods (bank transfer, etc.)
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        console.log(`[Webhook] Async payment succeeded for session: ${session.id}`);
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

  // Handle one-time purchases
  if (session.mode === "payment") {
    const productId = session.metadata?.product_id;
    const productType = session.metadata?.product_type as any;

    if (productId && productType) {
      // Record the purchase
      await db.insert(purchases).values({
        userId: userIdNum,
        stripePaymentIntentId: session.payment_intent as string,
        productType,
        productId,
      });

      // If it's a scroll, unlock it
      if (productType === "scroll") {
        // Extract the actual scroll ID from the product ID (e.g., "scroll_007-D" -> "007-D")
        const scrollId = productId.startsWith("scroll_") 
          ? productId.replace("scroll_", "") 
          : productId;
        
        // Check if already unlocked to avoid duplicates
        const existing = await db
          .select()
          .from(unlockedScrolls)
          .where(eq(unlockedScrolls.userId, userIdNum))
          .limit(100);
        
        const alreadyUnlocked = existing.some(s => s.scrollId === scrollId);
        
        if (!alreadyUnlocked) {
          await db.insert(unlockedScrolls).values({
            userId: userIdNum,
            scrollId: scrollId,
            unlockedAt: new Date(),
          });
          console.log(`[Webhook] Scroll ${scrollId} unlocked for user ${userId}`);
        } else {
          console.log(`[Webhook] Scroll ${scrollId} already unlocked for user ${userId}`);
        }
      }

      console.log(`[Webhook] Purchase recorded: ${productType} - ${productId} for user ${userId}`);
    }
  }

  // Handle subscription
  if (session.mode === "subscription" && session.subscription) {
    await db
      .update(users)
      .set({ stripeSubscriptionId: session.subscription as string })
      .where(eq(users.id, userIdNum));

    // Update tier based on subscription
    const tier = session.metadata?.tier as any;
    if (tier) {
      await db.update(users).set({ tier }).where(eq(users.id, userIdNum));
      console.log(`[Webhook] User ${userId} upgraded to tier: ${tier}`);
    }
  }
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
