declare module 'better-sqlite3' {
  export class Database {
    constructor(filename: string);
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
  }

  export class Statement {
    run(...params: unknown[]): { changes: number };
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
  }
}