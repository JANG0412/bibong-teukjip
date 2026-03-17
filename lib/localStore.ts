import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

type StoredRecord = {
  id: string;
  meeting_date: string;
  title: string;
  attendees: string;
  content: string;
  photo_urls: string[];
  created_at: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "records.json");

async function readAll(): Promise<StoredRecord[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoredRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

async function writeAll(records: StoredRecord[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf8");
}

export async function localCreateRecord(record: StoredRecord) {
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

