import { getRecord } from "../../../lib/records.server";
import { updateRecordAction } from "../../actions";
import { EditForm } from "./EditForm";
import { notFound } from "next/navigation";

export default async function EditRecordPage({
  params,
}: {
  params: { id: string };
}) {
  const record = await getRecord(params.id);

  if (!record) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur">
        <h1 className="text-xl font-semibold tracking-tight">기록 수정하기</h1>
        <p className="mt-1 text-sm text-zinc-600">
          모임의 내용을 수정해보세요.
        </p>
      </section>

      <EditForm record={record} updateAction={updateRecordAction} />
    </div>
  );
}
