import { UTApi } from "uploadthing/server";
import { generateReactHelpers } from "@uploadthing/react";
import type { AnyFileRouter } from "uploadthing/server";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type SafeFileRouter = OurFileRouter extends AnyFileRouter ? OurFileRouter : AnyFileRouter;

const utapi = process.env.UPLOADTHING_SECRET ? new UTApi() : null;

export const { useUploadThing } = generateReactHelpers<SafeFileRouter>();

export async function uploadFile(file: File) {
  if (!utapi) {
    throw new Error("Upload service not configured");
  }

  try {
    const response = await utapi.uploadFiles(file);
    return response;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

export async function deleteFile(fileKey: string) {
  if (!utapi) return;
  await utapi.deleteFiles(fileKey);
}
