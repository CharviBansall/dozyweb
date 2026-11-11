import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type JunctionUserMapRecord = {
  clientUserId: string;
  junctionUserId: string;
  updatedAt: string;
};

type Store = {
  byClientUserId: Record<string, JunctionUserMapRecord>;
};

const STORE_PATH = path.join(process.cwd(), ".data", "junction-users.json");

declare global {
  var __dozyJunctionUserCache: Store | undefined;
}

function emptyStore(): Store {
  return { byClientUserId: {} };
}

async function readStore(): Promise<Store> {
  if (globalThis.__dozyJunctionUserCache) {
    return globalThis.__dozyJunctionUserCache;
  }
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Store;
    globalThis.__dozyJunctionUserCache = {
      byClientUserId: parsed.byClientUserId ?? {},
    };
    return globalThis.__dozyJunctionUserCache;
  } catch {
    const store = emptyStore();
    globalThis.__dozyJunctionUserCache = store;
    return store;
  }
}

async function writeStore(store: Store): Promise<void> {
  globalThis.__dozyJunctionUserCache = store;
  try {
    await mkdir(path.dirname(STORE_PATH), { recursive: true });
    await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Serverless FS may be read-only; in-memory still helps same instance.
  }
}

export async function getMappedJunctionUserId(
  clientUserId: string,
): Promise<string | null> {
  const store = await readStore();
  return store.byClientUserId[clientUserId]?.junctionUserId ?? null;
}

export async function saveJunctionUserMapping(
  clientUserId: string,
  junctionUserId: string,
): Promise<JunctionUserMapRecord> {
  const store = await readStore();
  const record: JunctionUserMapRecord = {
    clientUserId,
    junctionUserId,
    updatedAt: new Date().toISOString(),
  };
  store.byClientUserId[clientUserId] = record;
  await writeStore(store);
  return record;
}
