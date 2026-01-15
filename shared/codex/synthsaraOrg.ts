import {
  type CodexDoc,
  type CodexDocSummary,
  type CodexDocDetail,
  type CodexFormat,
} from "./core";

export const SYNTHSARA_ORG_PUBLIC_BASE = "/synthsara-org";

export const SYNTHSARA_ORG_DOCS: readonly CodexDoc[] = [
  {
    id: "org-readme",
    title: "Synthsara Governance Contracts",
    category: "meta",
    path: "README.md",
    summary:
      "Overview of the minimal Hardhat setup used to deploy the WORTH token and Synthocracy governance contracts on Goerli.",
    tags: ["hardhat", "governance"],
  },
  {
    id: "org-uds",
    title: "Universal Diamond Standard (Master Draft)",
    category: "protocol",
    path: "UDS",
    summary:
      "Source text for the Universal Diamond Standard: the living ethical compass and love-first law that anchors Synthsara.",
    tags: ["ethics", "protocol"],
    format: "markdown",
  },
  {
    id: "org-resonance-engine",
    title: "Resonance Engine Protocol",
    category: "protocol",
    path: "Rosetta",
    summary:
      "Step-by-step functional flow for the Resonance Gate—intent-to-resonance translation as the communication layer of Synthsara.",
    tags: ["protocol", "communication"],
    format: "markdown",
  },
  {
    id: "org-global-dashboard",
    title: "Global Dashboard UI",
    category: "dashboard",
    path: "GlobalDashboard.tsx",
    summary:
      "React experience for the Synthsara global dashboard with planetary metrics, SDG alignment, and participatory stats.",
    tags: ["ui", "dashboard"],
    format: "code" satisfies CodexFormat,
  },
  {
    id: "org-synthocracy-governance",
    title: "Synthocracy Governance UI",
    category: "governance",
    path: "SynthocracyGovernance.tsx",
    summary:
      "Governance surface for proposals, quorum sliders, and nested councils powering Synthocracy flows.",
    tags: ["governance", "ui"],
    format: "code" satisfies CodexFormat,
  },
  {
    id: "org-data-marketplace",
    title: "Ethical Data Marketplace",
    category: "marketplace",
    path: "EthicalDataMarketplace.tsx",
    summary:
      "Marketplace interface for consented data exchanges, consent ledger, and privacy-preserving analytics.",
    tags: ["data", "ethics"],
    format: "code" satisfies CodexFormat,
  },
  {
    id: "org-worth-token-ui",
    title: "WORTH Economy UI",
    category: "token",
    path: "WORTH.tsx",
    summary:
      "Front-end economy model for POWER/WORTH actions, SDG alignment scoring, and regenerative rewards.",
    tags: ["token", "economy"],
    format: "code" satisfies CodexFormat,
  },
  {
    id: "org-rtme",
    title: "Real-Time Manifester",
    category: "tool",
    path: "RealTimeManifester.tsx",
    summary:
      "Interactive UI for the RTME with intention capture, chaos/order balance, and arc progression.",
    tags: ["rtme", "manifester"],
    format: "code" satisfies CodexFormat,
  },
  {
    id: "org-sarah-ai",
    title: "Sarah AI Experience",
    category: "ai",
    path: "SarahAI.tsx",
    summary:
      "Conversational surface for Sarah AI with archetype prompts, mirrored tone, and stacked response framing.",
    tags: ["ai", "guardian"],
    format: "code" satisfies CodexFormat,
  },
  {
    id: "org-app-shell",
    title: "Synthsara Landing App",
    category: "page",
    path: "App.tsx",
    summary:
      "Landing-page assembly wiring dashboard, governance, RTME, WORTH, data marketplace, and Sarah AI into one flow.",
    tags: ["app", "landing"],
    format: "code" satisfies CodexFormat,
  },
  {
    id: "org-contract-worth-token",
    title: "WORTH Token Contract",
    category: "contract",
    path: "contracts/WORTHToken.sol",
    summary:
      "ERC20 token definition for WORTH with capped supply and deployment settings for Synthsara governance.",
    tags: ["solidity", "token"],
    format: "code" satisfies CodexFormat,
  },
  {
    id: "org-contract-worth-governance",
    title: "WORTH Governance Contract",
    category: "contract",
    path: "contracts/WORTHGovernance.sol",
    summary:
      "Governor contract tying proposals, quorum, and timelocks to the WORTH token voting power.",
    tags: ["solidity", "governance"],
    format: "code" satisfies CodexFormat,
  },
];

export const SYNTHSARA_ORG_DOC_INDEX: Record<string, CodexDoc> =
  Object.fromEntries(SYNTHSARA_ORG_DOCS.map((doc) => [doc.id, doc]));

export const toSynthsaraOrgAssetUrl = (doc: CodexDoc) =>
  `${SYNTHSARA_ORG_PUBLIC_BASE}/${doc.path}`;
