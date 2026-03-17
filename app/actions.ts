"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";
import { createRecord } from "@/lib/records";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";

function asString(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v : "";
}

async function saveUploads(files: File[]) {
  const urls: string[] = [];
  if (files.length === 0) return urls;

  const blobToken =
    process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (!file.type.startsWith("image/")) continue;

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${randomUUID()}-${safeName}`;

    // 배포(Vercel)에서는 로컬 디스크 저장이 유지되지 않아서 Blob을 우선 사용
    if (blobToken) {
      const blob = await put(`bibong/${filename}`, file, {
        access: "public",
        token: blobToken,
      });
      urls.push(blob.url);
      continue;
    }

    // 로컬 개발용: public/uploads에 저장
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fullPath = path.join(uploadDir, filename);
    await writeFile(fullPath, buffer);
    urls.push(`/uploads/${filename}`);
  }

  return urls;
}

export async function createRecordAction(formData: FormData) {
  const meetingDate = asString(formData.get("meetingDate")).trim();
  const title = asString(formData.get("title")).trim();
  const attendees = asString(formData.get("attendees")).trim();
  const content = asString(formData.get("content")).trim();

  const photos = formData.getAll("photos").filter((v) => v instanceof File) as File[];
  const photoUrls = await saveUploads(photos);

  if (!meetingDate || !title || !attendees || !content) {
    throw new Error("필수 항목(날짜/제목/참석자/활동 내용)을 모두 입력해주세요.");
  }

  await createRecord({ meetingDate, title, attendees, content, photoUrls });
  redirect("/");
}

