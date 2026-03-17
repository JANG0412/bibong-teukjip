import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { RecordItem } from "./records";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "records.json");

async function readAll(): Promise<RecordItem[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as RecordItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

async function writeAll(records: RecordItem[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf8");
}

export async function localCreateRecord(record: RecordItem) {
  const all = await readAll();
  all.unshift(record);
  await writeAll(all);
  return record;
}

export async function localListRecords(q?: string) {
  const all = await readAll();
  const keyword = q?.trim();
  if (!keyword) return all;
  const k = keyword.toLowerCase();
  return all.filter(
    (r) =>
      r.title.toLowerCase().includes(k) || r.attendees.toLowerCase().includes(k),
  );
}

