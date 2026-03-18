"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createRecord, deleteRecord } from "../lib/records.server";

function asString(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v : "";
}


export async function createRecordAction(formData: FormData) {
  const meetingDate = asString(formData.get("meetingDate")).trim();
  const title = asString(formData.get("title")).trim();
  const attendees = asString(formData.get("attendees")).trim();
  const content = asString(formData.get("content")).trim();

  const photoUrls: string[] = [];

  if (!meetingDate || !title || !attendees || !content) {
    throw new Error("필수 항목(날짜/제목/참석자/활동 내용)을 모두 입력해주세요.");
  }

  try {
    await createRecord({ meetingDate, title, attendees, content, photoUrls });
  } catch (error) {
    console.error("Record creation failed:", error);
    if (error instanceof Error) {
      throw new Error(`저장 실패: ${error.message}`);
    }
    throw new Error("알 수 없는 오류로 저장에 실패했습니다.");
  }
  revalidatePath("/");
  redirect("/");
}

export async function deleteRecordAction(formData: FormData) {
  const id = asString(formData.get("id"));
  if (!id) return;

  try {
    await deleteRecord(id);
  } catch (error) {
    console.error("Delete failed:", error);
    if (error instanceof Error) {
      throw new Error(`삭제 실패: ${error.message}`);
    }
    throw new Error("알 수 없는 오류로 삭제에 실패했습니다.");
  }
  revalidatePath("/");
  redirect("/");
}

