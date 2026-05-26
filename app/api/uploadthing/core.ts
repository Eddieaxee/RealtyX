import { createUploadthing } from "uploadthing/next";
import { auth } from "@/lib/auth";
import type { FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const requireSession = async () => {
  const session = await auth();
  if (!session?.user) throw new UploadThingError("Unauthorized");
  return session;
};

type UploadCompletePayload = {
  metadata: { userId: string };
  file: { url: string; key: string };
};

export const ourFileRouter = {
  kycDocument: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 2,
      allow: ["image/jpeg", "image/png", "image/webp"],
    },
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
      allow: ["application/pdf"],
    },
  })
    .middleware(async () => {
      const session = await requireSession();
      return { userId: session.user.id };
    })
    .onUploadComplete(async (payload: unknown) => {
      const { metadata, file } = payload as UploadCompletePayload;
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        key: file.key,
      };
    }),

  propertyImage: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 10,
      allow: ["image/jpeg", "image/png", "image/webp"],
    },
  })
    .middleware(async () => {
      const session = await requireSession();
      const role = (session.user as { role?: string }).role;
      if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        throw new UploadThingError("Admin only");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async (payload: unknown) => {
      const { metadata, file } = payload as UploadCompletePayload;
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        key: file.key,
      };
    }),

  avatar: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
      allow: ["image/jpeg", "image/png", "image/webp"],
    },
  })
    .middleware(async () => {
      const session = await requireSession();
      return { userId: session.user.id };
    })
    .onUploadComplete(async (payload: unknown) => {
      const { metadata, file } = payload as UploadCompletePayload;
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
