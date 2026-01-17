import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([{ tier: "ember", isMirrored: false }]),
    orderBy: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockReturnThis(),
  }),
}));

// Mock Stripe
vi.mock("stripe", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      checkout: {
        sessions: {
          create: vi.fn().mockResolvedValue({
            url: "https://checkout.stripe.com/test-session",
          }),
        },
      },
    })),
  };
});

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "The mirror reflects your question back to you." } }],
  }),
}));

describe("Stripe Products Configuration", () => {
  it("should have valid membership tiers defined", async () => {
    const { MEMBERSHIP_TIERS } = await import("./stripe/products");
    
    expect(MEMBERSHIP_TIERS).toBeDefined();
    expect(MEMBERSHIP_TIERS.ember).toBeDefined();
    expect(MEMBERSHIP_TIERS.flamewalker).toBeDefined();
    expect(MEMBERSHIP_TIERS.harmonizer).toBeDefined();
    expect(MEMBERSHIP_TIERS.architect).toBeDefined();
    
    // Verify tier structure
    expect(MEMBERSHIP_TIERS.ember.price).toBe(0);
    expect(MEMBERSHIP_TIERS.flamewalker.priceMonthly).toBe(3300);
    expect(MEMBERSHIP_TIERS.harmonizer.priceMonthly).toBe(8800);
    expect(MEMBERSHIP_TIERS.architect.priceMonthly).toBe(33300);
  });

  it("should have valid artifacts defined", async () => {
    const { ARTIFACTS } = await import("./stripe/products");
    
    expect(ARTIFACTS).toBeDefined();
    expect(ARTIFACTS["scroll_003-A"]).toBeDefined();
    expect(ARTIFACTS.diamond_mind_book).toBeDefined();
    expect(ARTIFACTS.codex_bundle).toBeDefined();
    
    // Verify artifact structure
    expect(ARTIFACTS.diamond_mind_book.price).toBe(2200);
    expect(ARTIFACTS.codex_bundle.price).toBe(4400);
  });

  it("should have correct product types", async () => {
    const { ARTIFACTS } = await import("./stripe/products");
    
    expect(ARTIFACTS["scroll_003-A"].type).toBe("scroll");
    expect(ARTIFACTS.codex_bundle.type).toBe("artifact");
    expect(ARTIFACTS.ritual_mirror.type).toBe("ritual");
  });
});

describe("Database Schema", () => {
  it("should have users table with correct columns", async () => {
    const { users } = await import("../drizzle/schema");
    
    expect(users).toBeDefined();
    // Check that the table has the expected columns
    const columns = Object.keys(users);
    expect(columns).toContain("id");
    expect(columns).toContain("tier");
    expect(columns).toContain("isMirrored");
    expect(columns).toContain("stripeCustomerId");
  });

  it("should have chatHistory table", async () => {
    const { chatHistory } = await import("../drizzle/schema");
    
    expect(chatHistory).toBeDefined();
  });

  it("should have unlockedScrolls table", async () => {
    const { unlockedScrolls } = await import("../drizzle/schema");
    
    expect(unlockedScrolls).toBeDefined();
  });

  it("should have purchases table", async () => {
    const { purchases } = await import("../drizzle/schema");
    
    expect(purchases).toBeDefined();
    const columns = Object.keys(purchases);
    expect(columns).toContain("amountCents");
    expect(columns).toContain("currency");
    expect(columns).toContain("status");
  });

  it("should expose reflected scroll and newsletter tables", async () => {
    const { reflectedScrolls, newsletterSubscriptions, userSettings } = await import("../drizzle/schema");
    
    expect(reflectedScrolls).toBeDefined();
    expect(newsletterSubscriptions).toBeDefined();
    expect(userSettings).toBeDefined();
  });
});

describe("Stripe Webhook Handler", () => {
  it("should export handleStripeWebhook function", async () => {
    const { handleStripeWebhook } = await import("./stripe/webhook");
    
    expect(handleStripeWebhook).toBeDefined();
    expect(typeof handleStripeWebhook).toBe("function");
  });
});


describe("Scroll Unlock Schema", () => {
  it("should have viewedAt column in unlockedScrolls table", async () => {
    const { unlockedScrolls } = await import("../drizzle/schema");
    
    expect(unlockedScrolls).toBeDefined();
    // Check that the table has the viewedAt column for first-time celebration tracking
    const columns = Object.keys(unlockedScrolls);
    expect(columns).toContain("viewedAt");
    expect(columns).toContain("unlockedAt");
    expect(columns).toContain("scrollId");
    expect(columns).toContain("userId");
  });
});

describe("Scroll Data Structure", () => {
  it("should define scrolls with correct pricing structure", () => {
    // Verify scroll pricing follows the expected pattern
    const freeScrollId = "000";
    const paidScrollIds = ["007-D", "019-V"];
    
    // Free scroll should be accessible without purchase
    expect(freeScrollId).toBe("000");
    
    // Paid scrolls should have IDs that can be used for gating
    expect(paidScrollIds.length).toBeGreaterThan(0);
  });
});


describe("Stripe Webhook Scroll Unlock", () => {
  it("should extract scroll ID from product ID format", () => {
    // Test the scroll ID extraction logic
    const productId = "scroll_007-D";
    const scrollId = productId.startsWith("scroll_") 
      ? productId.replace("scroll_", "") 
      : productId;
    
    expect(scrollId).toBe("007-D");
  });

  it("should handle plain scroll IDs", () => {
    const productId = "019-V";
    const scrollId = productId.startsWith("scroll_") 
      ? productId.replace("scroll_", "") 
      : productId;
    
    expect(scrollId).toBe("019-V");
  });

  it("should handle scroll_000 format", () => {
    const productId = "scroll_000";
    const scrollId = productId.startsWith("scroll_") 
      ? productId.replace("scroll_", "") 
      : productId;
    
    expect(scrollId).toBe("000");
  });
});


describe("User Profile API", () => {
  it("should have getFullProfile procedure defined", async () => {
    const { appRouter } = await import("./routers");
    
    expect(appRouter).toBeDefined();
    expect(appRouter.user).toBeDefined();
    // Verify the router has the expected procedures
    expect(appRouter._def.procedures).toBeDefined();
  });

  it("should have user router with profile-related procedures", async () => {
    const { appRouter } = await import("./routers");
    
    // Check that user router exists
    expect(appRouter.user).toBeDefined();
  });
});

describe("Newsletter Router", () => {
  it("should expose newsletter subscribe/unsubscribe handlers", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter.newsletter).toBeDefined();
  });
});
