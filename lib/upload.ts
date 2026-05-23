import { UTApi } from "uploadthing/server";

const utapi = process.env.UPLOADTHING_SECRET ? new UTApi() : null;

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