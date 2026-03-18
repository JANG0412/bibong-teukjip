import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __bibongPool: Pool | undefined;
}

export function getDatabaseUrl(): string | undefined {
  const url = (process.env.DATABASE_URL || process.env.POSTGRES_URL)?.trim();
  if (!url) return undefined;

  // 사용자가 예시(.env.local.example)를 그대로 복사한 경우 로컬 저장 모드로 처리
  if (
    url.includes("postgres://USER:PASSWORD@HOST") ||
    url.includes("@HOST:") ||
    url.includes("/DBNAME")
  ) {
    return undefined;
  }

  return url;
}

export function getPool(): Pool | null {
  const url = getDatabaseUrl();
  if (!url) return null;

  const existing = globalThis.__bibongPool;
  if (existing) return existing;

  const pool = new Pool({
    connectionString: url,
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined,
  });

  // 캐시를 위해 전역 변수에 저장 (Vercel 등 서버리스 환경 포함)
  globalThis.__bibongPool = pool;

  return pool;
}

