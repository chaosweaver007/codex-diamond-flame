import fs from "fs/promises";
import path from "path";
import {
  CODEX_DOCS,
  CODEX_DOC_INDEX,
  CODEX_PUBLIC_BASE,
  toCodexAssetUrl,
  type CodexDocDetail,
  type CodexDocSummary,
} from "@shared/codex/core";

const CODEX_BASE_DIR = path.resolve(process.cwd(), "synthsara-codex-core");

const normalizeDocPath = (relativePath: string) => {
  const normalized = path
    .normalize(relativePath)
    .replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(CODEX_BASE_DIR, normalized);

  if (!fullPath.startsWith(CODEX_BASE_DIR)) {
    throw new Error("Invalid codex path");
  }

  return fullPath;
};

export function listCodexDocs(): CodexDocSummary[] {
  return CODEX_DOCS.map((doc) => ({
    ...doc,
    assetUrl: `${CODEX_PUBLIC_BASE}/${doc.path}`,
  }));
}

export async function loadCodexDocument(id: string): Promise<CodexDocDetail> {
  const doc = CODEX_DOC_INDEX[id];
  if (!doc) {
    throw new Error("Codex document not found");
  }

  const summary: CodexDocSummary = {
    ...doc,
    assetUrl: toCodexAssetUrl(doc),
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
