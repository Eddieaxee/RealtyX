declare module "uploadthing/next" {
  // Minimal types to satisfy TS during development.
  // Runtime is provided by the real `uploadthing` package.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type FileRouter = any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function createUploadthing(): any;

  export function createRouteHandler(args: { router: FileRouter }): {
    GET: (req: Request) => Promise<Response>;
    POST: (req: Request) => Promise<Response>;
  };
}

declare module "uploadthing/server" {
  export class UploadThingError extends Error {
    constructor(message?: string);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type AnyFileRouter = any;
  export class UTApi {
    uploadFiles(file: File): Promise<unknown>;
    deleteFiles(fileKey: string): Promise<unknown>;
  }
}
