/// <reference types="node" />

import { and, eq, inArray } from "drizzle-orm";
import { favorites, unlockedScrolls } from "../../drizzle/schema";
import { getDb, getUserByOpenId, upsertUser } from "../db";
import { SCROLLS } from "../../shared/scrolls";

type Args = {
  openId: string;
  name?: string;
  email?: string;
  unlock?: string; // "all" | "003-A,005-C"
  favorite?: string; // "003-A,019-V"
};

function parseArgs(argv: string[]): Args {
  const args: Record<string, string> = {};
  for (const raw of argv) {
    if (!raw.startsWith("--")) continue;
    const [key, ...rest] = raw.slice(2).split("=");
    const value = rest.join("=");
    if (!key) continue;
    args[key] = value;
  }

  const openId = args.openId;
  if (!openId) {
    throw new Error(
      "Missing --openId. Example: pnpm seed:dev --openId=YOUR_OPENID --unlock=all --favorite=003-A,019-V"
    );
  }

  return {
    openId,
    name: args.name,
    email: args.email,
    unlock: args.unlock,
    favorite: args.favorite,
  };
}

function splitCsv(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const db = await getDb();
  if (!db) {
    throw new Error(
      "Database unavailable. Set DATABASE_URL before running seed:dev."
    );
  }

  await upsertUser({
    openId: args.openId,
    name: args.name ?? null,
    email: args.email ?? null,
    lastSignedIn: new Date(),
  });

  const user = await getUserByOpenId(args.openId);
  if (!user) {
    throw new Error("Failed to resolve user after upsert.");
  }

  const allScrollIds = SCROLLS.map((s) => s.id);

  const unlockIds =
    args.unlock === "all" ? allScrollIds : splitCsv(args.unlock);
  const favoriteIds = splitCsv(args.favorite);

  const now = new Date();

  if (unlockIds.length > 0) {
    const existingUnlocks: Array<{ scrollId: string }> = await db
      .select({ scrollId: unlockedScrolls.scrollId })
      .from(unlockedScrolls)
      .where(
        and(eq(unlockedScrolls.userId, user.id), inArray(unlockedScrolls.scrollId, unlockIds))
      );

    const existingSet = new Set(existingUnlocks.map((r) => r.scrollId));
    const toInsert = unlockIds.filter((id) => !existingSet.has(id));

    if (toInsert.length > 0) {
      await db.insert(unlockedScrolls).values(
        toInsert.map((scrollId) => ({
          userId: user.id,
          scrollId,
          unlockedAt: now,
          viewedAt: null,
        }))
      );
    }

    console.log(
      `[seed:dev] Unlocked ${toInsert.length}/${unlockIds.length} scroll(s) for userId=${user.id}`
    );
  }

  if (favoriteIds.length > 0) {
    const existingFavs: Array<{ scrollId: string }> = await db
      .select({ scrollId: favorites.scrollId })
      .from(favorites)
      .where(and(eq(favorites.userId, user.id), inArray(favorites.scrollId, favoriteIds)));

    const existingSet = new Set(existingFavs.map((r) => r.scrollId));
    const toInsert = favoriteIds.filter((id) => !existingSet.has(id));

    if (toInsert.length > 0) {
      await db.insert(favorites).values(
        toInsert.map((scrollId) => ({
          userId: user.id,
          scrollId,
          createdAt: now,
        }))
      );
    }

    console.log(
      `[seed:dev] Favorited ${toInsert.length}/${favoriteIds.length} scroll(s) for userId=${user.id}`
    );
  }

  console.log("[seed:dev] Done.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
