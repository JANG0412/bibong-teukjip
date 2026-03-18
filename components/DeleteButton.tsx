"use client";

import { deleteRecordAction } from "@/app/actions";

export function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteRecordAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-xl px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 active:translate-y-px"
        onClick={(e) => {
          if (!confirm("정말 이 기록을 삭제하시겠습니까?")) {
            e.preventDefault();
          }
        }}
      >
        삭제
      </button>
    </form>
  );
}
