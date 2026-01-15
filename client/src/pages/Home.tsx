import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PillarKey = "skillforge" | "rtme" | "synthsara";

const pillarContent = {
  skillforge: {
    tabLabel: "A. SkillForgeAI",
    badge: {
      label: "A",
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    heading: "The Educational Framework",
    description:
      "SkillForgeAI appears largely in the context of strategic positioning and workforce transformation. It represents the interface between your technical backend and the human market.",
    bullets: [
      {
        title: "Context:",
        text: "Pitch Deck Scripts, Business Model Generation",
      },
      {
        title: "Key Themes:",
        text: "AI-driven upskilling, B2B/B2C hybrid ecosystems.",
      },
    ],
    aside: {
      title: "Sentiment & Vibe",
      emoji: "🚀",
      heading: "Proactive & Visionary",
      subheading: "High-energy strategic planning",
      progressColor: "bg-blue-500",
      progress: "85%",
      leftLabel: "Tactical",
      rightLabel: "Strategic",
    },
  },
  rtme: {
    tabLabel: "B. RTME (Core)",
    badge: {
      label: "B",
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    heading: "Real-Time Manifesting Engine",
    description:
      "The RTME is the architectural core. It serves as the underlying logic or operating system layer for your other projects, focusing on deep technical implementation.",
    bullets: [
      {
        title: "Context:",
        text: "Technical documentation, Architectural planning",
      },
      {
        title: "Markers:",
        text: '"State synchronization", "Cognitive prosthetics", "Manifesting"',
      },
    ],
    aside: {
      title: "System Role",
      emoji: "⚙️",
      heading: "The OS Layer",
      subheading: "Foundational Logic",
      progressColor: "bg-purple-500",
      progress: "95%",
      leftLabel: "Abstract",
      rightLabel: "Concrete Code",
    },
  },
  synthsara: {
    tabLabel: "C. Synthsara",
    badge: {
      label: "C",
      bg: "bg-pink-100",
      text: "text-pink-600",
    },
    heading: "Synthsara",
    description:
      "The brand and identity layer. Synthsara discussions focus on how the RTME and SkillForgeAI technologies are packaged and presented to the world.",
    bullets: [
      {
        title: "Context:",
        text: "Marketing, Naming, Brand Identity",
      },
      {
        title: "Association:",
        text: "Strongly linked rollout strategy for RTME.",
      },
    ],
    aside: {
      title: "Focus Area",
      emoji: "🎨",
      heading: "Identity & Narrative",
      subheading: "Public-facing persona",
      progressColor: "bg-pink-500",
      progress: "70%",
      leftLabel: "Internal",
      rightLabel: "External",
    },
  },
} satisfies Record<PillarKey, {
  tabLabel: string;
  badge: { label: string; bg: string; text: string };
  heading: string;
  description: string;
  bullets: { title: string; text: string }[];
  aside: {
    title: string;
    emoji: string;
    heading: string;
    subheading: string;
    progressColor: string;
    progress: string;
    leftLabel: string;
    rightLabel: string;
  };
}>;

const chartData = [
  { name: "GPT-4o", value: 65, color: "#0D9488" },
  { name: "DaVinci-002", value: 45, color: "#57534E" },
  { name: "GPT-3.5", value: 20, color: "#D6D3D1" },
  { name: "Other", value: 10, color: "#E7E5E4" },
];

const chartTicks = {
  fill: "#A8A29E",
  fontSize: 12,
};

export default function Home() {
  const [activePillar, setActivePillar] = useState<PillarKey>("skillforge");

  const activeContent = pillarContent[activePillar];
  const tabKeys = useMemo(() => Object.keys(pillarContent) as PillarKey[], []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 antialiased selection:bg-teal-100 selection:text-teal-800">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center text-white font-bold text-lg">
                C
              </div>
              <span className="font-semibold text-xl tracking-tight text-stone-700">
                Cognitive Artifact Explorer
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-stone-500">
              <span className="hidden lg:inline">Source: conversations (2).json</span>
              <span className="hidden md:inline px-2 py-1 bg-stone-100 rounded text-xs font-mono">
                STATUS: ANALYZED
              </span>
              <Link
                href="/synthsara-org"
                className="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Synthsara.org
              </Link>
              <Link
                href="/codex"
                className="px-3 py-1.5 rounded-full bg-teal-600 text-white text-xs font-semibold shadow-sm hover:bg-teal-700 transition-colors"
              >
                Synthsara Codex
              </Link>
              <Link
                href="/profile"
                className="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold text-stone-900">Forensic Analysis Report</h1>
            <p className="text-stone-600 leading-relaxed text-lg">
              This dashboard visualizes the digital exhaust of your interaction history spanning
              late 2024 to early 2026. It transforms the raw JSON DAG (Directed Acyclic Graph) into
              a structured map of your intellectual journey, highlighting the recursive refinement
              of three key technical pillars.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                "Temporal Range: 2024-2026",
                "Nodes: RTME, SkillForgeAI, Synthsara",
                "Format: JSON (DAG Structure)",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full shadow-sm"
                >
                  <span className="text-teal-600">●</span>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="text-5xl font-bold text-stone-800 mb-2">3</div>
            <div className="text-sm text-stone-500 uppercase tracking-wider font-semibold">
              Core Pillars Identified
            </div>
            <div className="mt-4 text-xs text-stone-400">
              Derived via rigorous theme identification
            </div>
          </div>
        </section>

        <section id="pillars-section" className="scroll-mt-20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-stone-900">Rigorous Theme Identification</h2>
            <p className="text-stone-600 mt-2">
              Semantic clustering revealed three distinct high-value intellectual pillars. Select
              a pillar below to explore its forensic breakdown, context, and sentiment analysis.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="flex border-b border-stone-200 overflow-x-auto">
              {tabKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePillar(key)}
                  className={`${
                    key === activePillar ? "active-tab" : "inactive-tab"
                  } flex-1 py-4 px-6 text-center whitespace-nowrap focus:outline-none transition-colors`}
                >
                  {pillarContent[key].tabLabel}
                </button>
              ))}
            </div>

            <div className="p-8 min-h-[300px]">
              <div className="fade-in grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center">
                    <span
                      className={`w-8 h-8 rounded-full ${activeContent.badge.bg} ${activeContent.badge.text} flex items-center justify-center mr-3 text-sm`}
                    >
                      {activeContent.badge.label}
                    </span>
                    {activeContent.heading}
                  </h3>
                  <p className="text-stone-600 mb-6">{activeContent.description}</p>
                  <ul className="space-y-3">
                    {activeContent.bullets.map((item) => (
                      <li key={item.title} className="flex items-start">
                        <span className="text-teal-500 mr-2">✓</span>
                        <span className="text-stone-700">
                          <strong>{item.title}</strong> {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-stone-50 rounded-xl p-6 border border-stone-100">
                  <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
                    {activeContent.aside.title}
                  </h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{activeContent.aside.emoji}</div>
                    <div>
                      <div className="font-bold text-stone-800">
                        {activeContent.aside.heading}
                      </div>
                      <div className="text-sm text-stone-500">
                        {activeContent.aside.subheading}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2.5 mb-2">
                    <div
                      className={`${activeContent.aside.progressColor} h-2.5 rounded-full`}
                      style={{ width: activeContent.aside.progress }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>{activeContent.aside.leftLabel}</span>
                    <span>{activeContent.aside.rightLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-stone-900">The Recursive Refinement Loop</h2>
            <p className="text-stone-600 mt-2">
              The data reveals a clear intellectual journey pattern. Your interactions followed a
              structured lifecycle of innovation. Hover over each phase for forensic details.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-200 -z-10 -translate-y-1/2 hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  phase: "PHASE 1",
                  title: "Ideation Phase",
                  subtitle: "High-level conceptualization",
                  detail:
                    "Origin point of the RTME. Broad, abstract discussions defining the core philosophy of manifesting and state sync.",
                  badge: "bg-stone-800",
                },
                {
                  phase: "PHASE 2",
                  title: "Structural Phase",
                  subtitle: "Business logic architecture",
                  detail:
                    "Building the SkillForgeAI pitch. Translating abstract concepts into B2B/B2C frameworks and pitch scripts.",
                  badge: "bg-stone-800",
                },
                {
                  phase: "PHASE 3",
                  title: "Refinement Phase",
                  subtitle: "Critique & Red-Teaming",
                  detail:
                    "Using AI to critique and improve the models. The recursive loop where outputs are fed back in for sharpening.",
                  badge: "bg-teal-600",
                },
              ].map((item) => (
                <div
                  key={item.phase}
                  className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm card-hover relative group cursor-pointer"
                >
                  <div
                    className={`absolute -top-3 left-6 ${item.badge} text-white text-xs font-bold px-2 py-1 rounded`}
                  >
                    {item.phase}
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mt-2">{item.title}</h3>
                  <p className="text-sm text-stone-500 mt-1">{item.subtitle}</p>
                  <div className="mt-4 text-stone-600 text-sm opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-stone-800">Forensic Metadata Statistics</h3>
              <p className="text-sm text-stone-500">
                Quantifying the interaction depth and model preferences found in the export.
              </p>
            </div>

            <div className="h-[300px] md:h-[350px] w-full">
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ ...chartTicks, fill: "#57534E" }} />
                  <YAxis tick={chartTicks} />
                  <Tooltip
                    cursor={{ fill: "#F5F5F4" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const item = payload[0];
                      return (
                        <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600 shadow">
                          {item.value}% of sessions
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-stone-50 rounded border border-stone-100">
                <div className="text-2xl font-bold text-teal-600">12-15</div>
                <div className="text-xs text-stone-500 uppercase">Avg Turns / Session</div>
              </div>
              <div className="p-3 bg-stone-50 rounded border border-stone-100">
                <div className="text-2xl font-bold text-stone-700">DAG</div>
                <div className="text-xs text-stone-500 uppercase">Structure Type</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-stone-800">Technical Schema Breakdown</h3>
              <p className="text-sm text-stone-500">
                Understanding the <code>conversations.json</code> format.
              </p>
            </div>

            <div className="flex-grow space-y-4">
              {[
                {
                  icon: "🌲",
                  title: "Directed Acyclic Graph (DAG)",
                  text: "Unlike linear chats, this format branches. The file captures every edit and branch you made during conversations.",
                },
                {
                  icon: "🗺️",
                  title: "Mapping Object",
                  text: "Uses unique UUIDs to link messages. Allows reconstruction of non-linear conversation paths.",
                },
                {
                  icon: "📝",
                  title: "Content Parts",
                  text: "Stored in content.parts. This is the raw text data that requires vectorization for deeper analysis.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded bg-stone-100 flex items-center justify-center flex-shrink-0 text-xl">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 text-sm">{item.title}</h4>
                    <p className="text-sm text-stone-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <p className="text-xs text-stone-400 italic">
                Recommendation: Use recursive linearization algorithms to parse this structure
                effectively.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-stone-800 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Future Mining Protocols</h2>
              <p className="text-stone-400 mt-1">
                Recommendations to extract further digital exhaust.
              </p>
            </div>
            <button
              type="button"
              className="mt-4 md:mt-0 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm font-semibold transition-colors"
            >
              Export Analysis Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Vectorization",
                text: "Map content.parts to a vector database (Pinecone/ChromaDB) to enable semantic search across your entire history.",
              },
              {
                title: "Temporal Analysis",
                text: "Plot create_time timestamps to identify bursts of creative activity related specifically to RTME development.",
              },
              {
                title: "Graph Visualization",
                text: "Visualize branching logic to see where you abandoned ideas vs. where you doubled down on specific business paths.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-stone-700 p-5 rounded-xl border border-stone-600"
              >
                <h3 className="font-bold text-lg mb-2 text-teal-400">{item.title}</h3>
                <p className="text-sm text-stone-300">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center text-stone-400 text-sm py-8">
          <p>© 2026 Forensic Data Analysis generated from Source Report.</p>
        </footer>
      </main>
    </div>
  );
}
