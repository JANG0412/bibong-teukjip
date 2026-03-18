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
  // Vercel 환경에서는 파일 시스템 쓰기가 불가능하므로 미리 에러를 던짐
  if (process.env.VERCEL) {
    throw new Error(
      "Vercel 환경에서는 로컬 파일 저장이 불가능합니다. .env 에 DATABASE_URL을 설정하거나 PostgreSQL을 연결해주세요."
    );
  }
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf8");
}

export async function localCreateRecord(record: RecordItem) {
  const all = await readAll();
  all.unshift(record);
  await writeAll(all);
  return record;
}

export async function localDeleteRecord(id: string) {
  const all = await readAll();
  const filtered = all.filter((r) => r.id !== id);
  if (all.length !== filtered.length) {
    await writeAll(filtered);
  }
}

export async function localListRecords(q?: string) {
  const all = await readAll();
  
  // Sort by meeting_date DESC
  all.sort((a, b) => b.meeting_date.localeCompare(a.meeting_date));

  const keyword = q?.trim();
  if (!keyword) return all;
  const k = keyword.toLowerCase();
  return all.filter(
    (r) =>
      r.title.toLowerCase().includes(k) || r.attendees.toLowerCase().includes(k),
  );
}

export async function localGetRecord(id: string): Promise<RecordItem | null> {
  const all = await readAll();
  return all.find((r) => r.id === id) || null;
}

export async function localUpdateRecord(
  id: string,
  input: {
    meeting_date?: string;
    meetingDate?: string;
    title: string;
    attendees: string;
    content: string;
  },
) {
  const all = await readAll();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return;

  all[idx] = {
    ...all[idx],
    meeting_date: input.meetingDate || input.meeting_date || all[idx].meeting_date,
    title: input.title,
    attendees: input.attendees,
    content: input.content,
  };
  await writeAll(all);
}

