import fs from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.js";

const collectionDefaults = {
  jobs: [],
  applications: [],
  contacts: [],
  interviews: [],
};

const resolveCollectionPath = (collectionName) =>
  path.join(env.dataDir, `${collectionName}.json`);

const ensureCollectionFile = async (collectionName) => {
  const filePath = resolveCollectionPath(collectionName);

  await fs.mkdir(env.dataDir, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    const fallback = collectionDefaults[collectionName] || [];
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2));
  }

  return filePath;
};

export const readCollection = async (collectionName) => {
  const filePath = await ensureCollectionFile(collectionName);
  const contents = await fs.readFile(filePath, "utf8");
  return JSON.parse(contents);
};

export const writeCollection = async (collectionName, records) => {
  const filePath = await ensureCollectionFile(collectionName);
  await fs.writeFile(filePath, JSON.stringify(records, null, 2));
  return records;
};
