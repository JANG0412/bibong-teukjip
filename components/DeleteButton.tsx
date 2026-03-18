"use client";

import { useTransition } from "react";
import { deleteRecordAction } from "@/app/actions";

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      className="rounded-xl px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 active:translate-y-px disabled:opacity-50"
      onClick={() => {
        if (confirm("정말 이 기록을 삭제하시겠습니까?")) {
          startTransition(async () => {
            const formData = new FormData();
            formData.append("id", id);
            try {
              await deleteRecordAction(formData);
            } catch (error) {
              alert(error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다.");
            }
          });
        }
      }}
    >
      {isPending ? "삭제 중..." : "삭제"}
    </button>
  );
}
