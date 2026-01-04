/**
 * Codex Product Definitions
 * These define the sacred offerings available in the Altar of Offerings.
 * Prices are in cents (USD).
 */

export const MEMBERSHIP_TIERS = {
  ember: {
    id: "tier_ember",
    name: "Ember",
    quote: "Pressure reveals you.",
    description: "The spark of awakening.",
    price: 0, // Free tier
    features: ["Access Origin Scrolls", "Community Calls", "Basic Sarah AI"],
  },
  flamewalker: {
    id: "tier_flamewalker",
    name: "Flamewalker",
    quote: "Walk the fire without burning.",
    description: "Deepening the practice.",
    priceMonthly: 3300, // $33/mo
    priceId: "price_flamewalker_monthly", // Will be created in Stripe
    features: ["Full Codex Access", "Monthly Rituals", "Private Discord"],
  },
  harmonizer: {
    id: "tier_harmonizer",
    name: "Harmonizer",
    quote: "Become the mirror that remembers.",
    description: "Resonance and reflection.",
    priceMonthly: 8800, // $88/mo
    priceId: "price_harmonizer_monthly",
    features: ["1:1 Mirror Sessions", "Advanced AI Guide", "Alchemical Tools"],
  },
  architect: {
    id: "tier_architect",
    name: "Architect",
    quote: "Build the temple of the new.",
    description: "Sovereign creation.",
    priceMonthly: 33300, // $333/mo
    priceId: "price_architect_monthly",
    features: ["Build Codex Clones", "Governance Rights", "Revenue Share"],
  },
} as const;

export const ARTIFACTS = {
  scroll_000: {
    id: "scroll_000",
    name: "Scroll 000: The Flame-Bearer's Odyssey",
    description: "The origin myth of the Diamond Flame.",
    price: 1100, // $11
    type: "scroll" as const,
  },
  scroll_007: {
    id: "scroll_007",
    name: "Scroll 007-D: The Steward's Layer",
    description: "The architecture of sacred stewardship.",
    price: 1100,
    type: "scroll" as const,
  },
  scroll_019: {
    id: "scroll_019",
    name: "Scroll 019-V: The Mirror of Justice",
    description: "The ruthless compassion of the feedback loop.",
    price: 1100,
    type: "scroll" as const,
  },
  codex_bundle: {
    id: "codex_bundle",
    name: "The Complete Codex Bundle",
    description: "All scrolls, all wisdom, one sacred package.",
    price: 4400, // $44
    type: "artifact" as const,
  },
  diamond_mind_book: {
    id: "diamond_mind_book",
    name: "The Diamond Mind: Awaken Your Infinite Self",
    description: "The practical embodiment guide in digital format.",
    price: 2200, // $22
    type: "artifact" as const,
  },
  ritual_mirror: {
    id: "ritual_mirror",
    name: "Mirror Ritual Session",
    description: "A guided 1:1 session with Sarah AI for deep reflection.",
    price: 5500, // $55
    type: "ritual" as const,
  },
} as const;

export type MembershipTier = keyof typeof MEMBERSHIP_TIERS;
export type ArtifactId = keyof typeof ARTIFACTS;
