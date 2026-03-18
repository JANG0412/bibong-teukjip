"use client";

import { useState, useTransition } from "react";
import type { RecordItem } from "../../../lib/localStore";

export function EditForm({
  record,
  updateAction,
}: {
  record: RecordItem;
  updateAction: (formData: FormData) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  return (
    <form
      className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur"
      action={(formData) => {
        setError("");
        startTransition(async () => {
          try {
            await updateAction(formData);
          } catch (e) {
            setError(
              e instanceof Error ? e.message : "수정 중 오류가 발생했어요.",
            );
          }
        });
      }}
    >
      <input type="hidden" name="id" value={record.id} />
      
      <div className="grid grid-cols-1 gap-4">
        <label className="space-y-2">
          <div className="text-sm font-semibold text-zinc-800">모임 날짜</div>
          <input
            name="meetingDate"
            type="date"
            required
            defaultValue={record.meeting_date}
            className="w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm outline-none ring-rose-200/60 focus:ring"
          />
        </label>

        <label className="space-y-2">
          <div className="text-sm font-semibold text-zinc-800">제목</div>
          <input
            name="title"
            type="text"
            required
            defaultValue={record.title}
            placeholder="예: 봄맞이 비봉 모임"
            className="w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm outline-none ring-rose-200/60 placeholder:text-zinc-400 focus:ring"
          />
        </label>

        <label className="space-y-2">
          <div className="text-sm font-semibold text-zinc-800">참석자</div>
          <input
            name="attendees"
            type="text"
            required
            defaultValue={record.attendees}
            placeholder="예: 민수, 지영, 현우"
            className="w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm outline-none ring-rose-200/60 placeholder:text-zinc-400 focus:ring"
          />
        </label>

        <label className="space-y-2">
          <div className="text-sm font-semibold text-zinc-800">활동 내용</div>
          <textarea
            name="content"
            required
            rows={7}
            defaultValue={record.content}
            placeholder="기록을 수정해보세요."
            className="w-full resize-none rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm leading-7 outline-none ring-rose-200/60 placeholder:text-zinc-400 focus:ring"
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "수정 중..." : "수정 완료"}
          </button>
          <a
            href="/"
            className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-center text-sm font-semibold text-zinc-800 transition hover:bg-white"
          >
            취소
          </a>
        </div>
      </div>
    </form>
  );
}
