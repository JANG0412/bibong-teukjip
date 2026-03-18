import Link from "next/link";
import { listRecords } from "@/lib/records.server";
import type { RecordItem } from "@/lib/records.server";
import { DeleteButton } from "@/components/DeleteButton";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export default async function Home(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const q = (searchParams.q ?? "").trim();
  let records: RecordItem[] = [];
  let dbError: string | null = null;
  try {
    records = await listRecords({ q });
  } catch (e) {
    dbError = e instanceof Error ? e.message : "DB 연결 오류";
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              메인 피드
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              최신 모임 기록부터 시간순으로 보여드려요.
            </p>
          </div>
          <Link
            href="/new"
            className="inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 active:translate-y-px"
          >
            + 새 기록
          </Link>
        </div>

        <form className="mt-4 flex gap-2" action="/" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="제목 또는 참석자로 검색"
            className="w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm outline-none ring-rose-200/60 placeholder:text-zinc-400 focus:ring"
          />
          <button
            type="submit"
            className="shrink-0 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 active:translate-y-px"
          >
            검색
          </button>
        </form>
      </section>

      {dbError ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5 text-sm text-amber-900 shadow-sm">
          <div className="font-semibold">저장 모드 안내</div>
          <div className="mt-2 text-amber-900/80">
            지금은 DB 연결이 안 되어{" "}
            <span className="font-semibold">내 PC에 파일로 저장</span>해요.
            (그래도 브라우저를 닫아도 유지됩니다)
          </div>
          <div className="mt-2 text-amber-900/80">
            PostgreSQL에 저장하고 싶다면 `.env.local`에{" "}
            <span className="font-semibold">DATABASE_URL</span>을 설정하면 돼요.
          </div>
          <div className="mt-2 text-xs text-amber-900/70">
            참고 오류: {dbError}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        {records.length === 0 ? (
          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 text-sm text-zinc-700 shadow-sm">
            {q ? (
              <div className="space-y-2">
                <div className="font-semibold">검색 결과가 없어요.</div>
                <div className="text-zinc-600">
                  다른 키워드로 검색해보거나, 새 기록을 추가해보세요.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-semibold">아직 기록이 없어요.</div>
                <div className="text-zinc-600">
                  오른쪽 위의 <span className="font-semibold">기록하기</span>로 첫 모임을 남겨보세요.
                </div>
              </div>
            )}
          </div>
        ) : (
          records.map((r) => (
            <article
              key={r.id}
              className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur"
            >
              <div className="flex flex-col gap-1">
                <div className="text-xs font-medium text-zinc-500">
                  {formatDate(r.meeting_date)}
                </div>
                <h2 className="text-lg font-semibold tracking-tight">
                  {r.title}
                </h2>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-700">
                    <span className="font-semibold">참석자</span>{" "}
                    <span className="text-zinc-600">{r.attendees}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/edit/${r.id}`}
                      className="inline-flex h-8 items-center justify-center rounded-lg bg-white/80 px-3 text-xs font-semibold text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition hover:bg-white active:translate-y-px"
                    >
                      수정
                    </Link>
                    <DeleteButton id={r.id} />
                  </div>
                </div>
              </div>

              <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-800">
                {r.content}
              </div>

              {r.photo_urls.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {r.photo_urls.map((url) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={url}
                      src={url}
                      alt="업로드 사진"
                      className="aspect-square w-full rounded-2xl border border-white/60 object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
      </section>
    </div>
  );
}
