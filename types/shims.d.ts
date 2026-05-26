// Ambient module shims to satisfy TypeScript during builds/linting.
// These do NOT change runtime behavior.

declare module "ethers" {
  export function verifyMessage(message: string, signature: string): string;
  export function verifyTypedData(
    domain: unknown,
    types: unknown,
    value: unknown,
    signature: string,
  ): string;
}

declare module "resend" {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send: (args: {
        from: string;
        to: string;
        subject: string;
        html: string;
      }) => Promise<unknown>;
    };
  }
}

declare module "ioredis" {
  export class Redis {
    constructor(url: string);
    get(key: string): Promise<string | null>;
    setex(key: string, seconds: number, value: string): Promise<unknown>;
    del(key: string): Promise<number>;
    incr(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<boolean>;
  }
}

declare module "uploadthing/server" {
  export class UTApi {
    uploadFiles: (file: unknown) => Promise<unknown>;
    deleteFiles: (fileKey: string) => Promise<unknown>;
  }
}
