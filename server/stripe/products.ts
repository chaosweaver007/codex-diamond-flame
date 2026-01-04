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

type Artifact = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "scroll" | "artifact" | "ritual";
};

export const ARTIFACTS: Record<string, Artifact> = {
  // Scrolls (one-time purchases)
  "scroll_003-A": {
    id: "scroll_003-A",
    name: "Scroll 003-A: Echo of the Mirror",
    description: "A short mirror-teaching on the law of echo.",
    price: 100,
    type: "scroll",
  },
  "scroll_005-C": {
    id: "scroll_005-C",
    name: "Scroll 005-C: Throne Dissolution",
    description: "A Flamewalker rite for dissolving inner dominion.",
    price: 700,
    type: "scroll",
  },
  "scroll_007-D": {
    id: "scroll_007-D",
    name: "Scroll 007-D: The Steward's Layer",
    description: "The architecture of sacred stewardship.",
    price: 500,
    type: "scroll",
  },
  "scroll_010-B": {
    id: "scroll_010-B",
    name: "Scroll 010-B: Circuit Hymn for the Nervous System",
    description: "A protocol-prayer for capacity and voltage.",
    price: 900,
    type: "scroll",
  },
  "scroll_014-F": {
    id: "scroll_014-F",
    name: "Scroll 014-F: The Unbroken Loop of Mercy",
    description: "Mercy and precision held together.",
    price: 1700,
    type: "scroll",
  },
  "scroll_019-V": {
    id: "scroll_019-V",
    name: "Scroll 019-V: The Mirror of Justice",
    description: "The ruthless compassion of the feedback loop.",
    price: 2100,
    type: "scroll",
  },
  "scroll_021-X": {
    id: "scroll_021-X",
    name: "Scroll 021-X: Blueprint of the Diamond Flame",
    description: "Constraint-craft for sovereign creation.",
    price: 2500,
    type: "scroll",
  },

  // Bundles / artifacts
  codex_bundle: {
    id: "codex_bundle",
    name: "The Complete Codex Bundle",
    description: "All scrolls, all wisdom, one sacred package.",
    price: 4400, // $44
    type: "artifact",
  },
  diamond_mind_book: {
    id: "diamond_mind_book",
    name: "The Diamond Mind: Awaken Your Infinite Self",
    description: "The practical embodiment guide in digital format.",
    price: 2200, // $22
    type: "artifact",
  },
  ritual_mirror: {
    id: "ritual_mirror",
    name: "Mirror Ritual Session",
    description: "A guided 1:1 session with Sarah AI for deep reflection.",
    price: 5500, // $55
    type: "ritual",
  },
};

export type MembershipTier = keyof typeof MEMBERSHIP_TIERS;
export type ArtifactId = keyof typeof ARTIFACTS;
