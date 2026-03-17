import { randomUUID } from "crypto";
import { getPool } from "./db";
import { ensureSchema } from "./schema";
import { localCreateRecord, localListRecords } from "./localStore";

export type RecordItem = {
  id: string;
  meeting_date: string;
  title: string;
  attendees: string;
  content: string;
  photo_urls: string[];
  created_at: string;
};

export async function createRecord(input: {
  meetingDate: string;
  title: string;
  attendees: string;
  content: string;
  photoUrls: string[];
}): Promise<RecordItem> {
  const id = randomUUID();
  const created_at = new Date().toISOString();

  const pool = getPool();
  if (!pool) {
    return await localCreateRecord({
      id,
      meeting_date: input.meetingDate,
      title: input.title,
      attendees: input.attendees,
      content: input.content,
      photo_urls: input.photoUrls,
      created_at,
    });
  }

  await ensureSchema();
  const { rows } = await pool.query<RecordItem>(
    `
      INSERT INTO records (id, meeting_date, title, attendees, content, photo_urls)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [
      id,
      input.meetingDate,
      input.title,
      input.attendees,
      input.content,
      input.photoUrls,
    ],
  );
  return rows[0]!;
}

export async function listRecords(params: { q?: string }): Promise<RecordItem[]> {
  const q = params.q?.trim();
  const pool = getPool();
  if (!pool) return await localListRecords(q);

  await ensureSchema();
  if (!q) {
    const { rows } = await pool.query<RecordItem>(
      `SELECT * FROM records ORDER BY created_at DESC LIMIT 200`,
    );
    return rows;
  }

  const like = `%${q}%`;
  const { rows } = await pool.query<RecordItem>(
    `
      SELECT * FROM records
      WHERE title ILIKE $1 OR attendees ILIKE $1
      ORDER BY created_at DESC
      LIMIT 200
    `,
    [like],
  );
  return rows;
}

