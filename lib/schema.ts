import { getPool } from "./db";

let initialized = false;

export async function ensureSchema() {
  if (initialized) return;
  const pool = getPool();
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      meeting_date DATE NOT NULL,
      title TEXT NOT NULL,
      attendees TEXT NOT NULL,
      content TEXT NOT NULL,
      photo_urls TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS records_created_at_idx ON records (created_at DESC);
    CREATE INDEX IF NOT EXISTS records_title_idx ON records (title);
  `);
  initialized = true;
}

