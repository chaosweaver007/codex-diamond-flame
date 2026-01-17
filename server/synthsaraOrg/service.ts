import fs from "fs/promises";
import path from "path";
import {
  SYNTHSARA_ORG_DOCS,
  SYNTHSARA_ORG_DOC_INDEX,
  SYNTHSARA_ORG_PUBLIC_BASE,
  toSynthsaraOrgAssetUrl,
  type CodexDocDetail,
  type CodexDocSummary,
} from "@shared/codex/synthsaraOrg";

const ORG_BASE_DIR = path.resolve(process.cwd(), "synthsara-org");

const normalizeDocPath = (relativePath: string) => {
  const normalized = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(ORG_BASE_DIR, normalized);

  if (!fullPath.startsWith(ORG_BASE_DIR)) {
    throw new Error("Invalid Synthsara.org path");
  }

  return fullPath;
};

export function listSynthsaraOrgDocs(): CodexDocSummary[] {
  return SYNTHSARA_ORG_DOCS.map((doc) => ({
    ...doc,
    assetUrl: `${SYNTHSARA_ORG_PUBLIC_BASE}/${doc.path}`,
  }));
}

export async function loadSynthsaraOrgDocument(
  id: string
): Promise<CodexDocDetail> {
  const doc = SYNTHSARA_ORG_DOC_INDEX[id];
  if (!doc) {
    throw new Error("Synthsara.org document not found");
  }

  const summary: CodexDocSummary = {
    ...doc,
    assetUrl: toSynthsaraOrgAssetUrl(doc),
  };

  if (doc.format === "image") {
    return summary;
  }

  const fullPath = normalizeDocPath(doc.path);
  const content = await fs.readFile(fullPath, "utf8");

  return {
    ...summary,
    content,
  };
}
