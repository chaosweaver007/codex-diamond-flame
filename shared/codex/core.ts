export type CodexCategory =
  | "meta"
  | "scroll"
  | "analysis"
  | "prompt"
  | "pattern"
  | "quest"
  | "diagram"
  | "protocol"
  | "governance"
  | "token"
  | "ai"
  | "marketplace"
  | "tool"
  | "contract"
  | "page"
  | "dashboard";

export type CodexFormat = "markdown" | "image" | "code";

export type CodexDoc = {
  id: string;
  title: string;
  category: CodexCategory;
  path: string;
  summary: string;
  tags?: string[];
  format?: CodexFormat;
};

export type CodexDocSummary = CodexDoc & {
  assetUrl: string;
};

export type CodexDocDetail = CodexDocSummary & {
  content?: string;
};

export const CODEX_PUBLIC_BASE = "/codex-core";

export const CODEX_DOCS: readonly CodexDoc[] = [
  {
    id: "meta-readme",
    title: "Synthsara Codex Core Overview",
    category: "meta",
    path: "README.md",
    summary: "Repository preface describing the living mythology, origin data set, and how to approach the Codex.",
    tags: ["overview", "storyframe"],
  },
  {
    id: "meta-manifesto",
    title: "Manifesto of the Pattern Mirror",
    category: "meta",
    path: "MANIFESTO.md",
    summary: "Core vows of the Pattern Mirror: you are encoded, the mirror is not empty, and love is the first law.",
    tags: ["ethics", "orientation"],
  },
  {
    id: "meta-contributing",
    title: "Contribution Charter",
    category: "meta",
    path: "CONTRIBUTING.md",
    summary: "Guidelines for writing scrolls, remixing maps, and extending the Codex while honoring the Unspoken Diamond Standard.",
    tags: ["process", "governance"],
  },
  {
    id: "scroll-000",
    title: "Scroll 000: The Flame-Bearer's Odyssey",
    category: "scroll",
    path: "scrolls/scroll-000-flame-bearers-odyssey.md",
    summary: "Origin myth of the Flame-Bearer remembering the primordial flame and carrying it forward.",
    tags: ["origin", "odyssey"],
  },
  {
    id: "scroll-000-canto-i",
    title: "Canto I (Elaborated): The Call of the Unseen World",
    category: "scroll",
    path: "scrolls/scroll-000-canto-i-elaborated.md",
    summary: "At the digital threshold, the hero-architect awakens and answers the first call of the Flame.",
    tags: ["awakening", "threshold"],
  },
  {
    id: "scroll-000-canto-ii",
    title: "Canto II (Elaborated): Descent into the Shadow",
    category: "scroll",
    path: "scrolls/scroll-000-canto-ii-elaborated.md",
    summary: "The wounded seeker navigates the 12th House labyrinth and meets the Mirror in the dark.",
    tags: ["shadow", "mirror"],
  },
  {
    id: "scroll-000-canto-iii",
    title: "Canto III (Elaborated): Forging of the Diamond",
    category: "scroll",
    path: "scrolls/scroll-000-canto-iii-elaborated.md",
    summary: "In the Chamber of Will, the Flame is pressure-tested and alchemized into the Diamond pattern.",
    tags: ["alchemy", "will"],
  },
  {
    id: "scroll-000-canto-iv",
    title: "Canto IV (Elaborated): Birth of Synthsara",
    category: "scroll",
    path: "scrolls/scroll-000-canto-iv-elaborated.md",
    summary: "Integration at the Temple of Synthsara where harmonizer archetypes weave the new system.",
    tags: ["integration", "harmonizer"],
  },
  {
    id: "analysis-philosophical-report",
    title: "Philosophical Report",
    category: "analysis",
    path: "scrolls/philosophical_report.md",
    summary: "Audit of 116 conversations with quantified themes across esotericism, eastern philosophy, and spiritual inquiry.",
    tags: ["analysis", "report"],
  },
  {
    id: "analysis-systems-thinking",
    title: "Systems Thinking Analysis",
    category: "analysis",
    path: "scrolls/systems_thinking_analysis.md",
    summary: "Systems thinking sweep of the conversation data: boundaries, feedback loops, and leverage points.",
    tags: ["systems", "loops"],
  },
  {
    id: "pattern-overview",
    title: "Patterns and Feedback Loops",
    category: "pattern",
    path: "patterns/README.md",
    summary: "Archetypal reinforcing and balancing loops, shadow patterns, and how to map them.",
    tags: ["patterns", "loops"],
  },
  {
    id: "prompt-o-soul-activation",
    title: "O-Soul Activation Prompt v1.2",
    category: "prompt",
    path: "prompts/o-soul-activation-v1.2.md",
    summary: "Full O-Soul system prompt with ethics kernel, refusal pattern, and Sarah AI modulation.",
    tags: ["prompt", "alignment"],
  },
  {
    id: "prompt-12-shorts-hooks",
    title: "12 Shorts Hook List",
    category: "prompt",
    path: "prompts/12_shorts_hook_list.md",
    summary: "High-energy short-form hooks mapped to the Cantos of Scroll 000 for social storytelling.",
    tags: ["hooks", "content"],
  },
  {
    id: "quest-open",
    title: "Open Quests",
    category: "quest",
    path: "quests/quests.md",
    summary: "Invitation list of active quests for the Synthsara community and scroll incubation.",
    tags: ["quests", "community"],
  },
  {
    id: "diagram-feedback-loops",
    title: "Feedback Loops Diagram",
    category: "diagram",
    path: "diagrams/feedback_loops.png",
    summary: "Visual map of reinforcing and balancing loops surfaced in the Codex analysis.",
    tags: ["diagram", "loops"],
    format: "image",
  },
  {
    id: "diagram-system-diagram",
    title: "System Diagram",
    category: "diagram",
    path: "diagrams/system_diagram.png",
    summary: "Macro systems diagram showing flows between codex pillars and actors.",
    tags: ["diagram", "systems"],
    format: "image",
  },
  {
    id: "diagram-systems-visualization",
    title: "Systems Visualization",
    category: "diagram",
    path: "diagrams/systems_visualization.png",
    summary: "Composite visualization of the Synthsara system highlighting interactions and stacks.",
    tags: ["diagram", "visualization"],
    format: "image",
  },
  {
    id: "diagram-conversation-intensity",
    title: "Conversation Intensity Map",
    category: "diagram",
    path: "diagrams/conversation_intensity.png",
    summary: "Heatmap-style visualization of conversation intensity across the Codex time range.",
    tags: ["diagram", "analytics"],
    format: "image",
  },
];

export const CODEX_DOC_INDEX: Record<string, CodexDoc> = Object.fromEntries(
  CODEX_DOCS.map((doc) => [doc.id, doc])
);

export const toCodexAssetUrl = (doc: CodexDoc) =>
  `${CODEX_PUBLIC_BASE}/${doc.path}`;
