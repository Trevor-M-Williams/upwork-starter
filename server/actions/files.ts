"use server";
import { db } from "@/server/db";
import { files } from "@/server/db/schema";
import { FileData } from "@/types";

export async function getFiles() {
  return await db.select().from(files);
}

export async function uploadFile(file: FileData) {
  try {
    await db.insert(files).values(file);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to upload file" };
  }
}
