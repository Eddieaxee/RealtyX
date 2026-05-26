declare module "uploadthing/next" {
  // Minimal types to satisfy TS during development.
  // Runtime is provided by the real `uploadthing` package.
  export type FileRouter = unknown;

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
}
