// Type declarations for Zod
declare module 'zod' {
  export class ZodError extends Error {
    errors: Array<{
      code: string;
      message: string;
      path: string[];
    }>;
  }

  export interface ZodType<T> {
    parse(data: unknown): T;
    safeParse(data: unknown): { 
      success: boolean; 
      data?: T; 
      error?: ZodError 
    };
  }

  export const z: {
    object: <T extends Record<string, any>>(schema: T) => ZodType<T>;
    string: () => ZodType<string>;
    number: () => ZodType<number>;
    boolean: () => ZodType<boolean>;
    array: <T>(type: ZodType<T>) => ZodType<T[]>;
    enum: <T extends string[]>(values: T) => ZodType<T[number]>;
    nativeEnum: <T extends Record<string, string>>(enumObj: T) => ZodType<T[keyof T]>;
  }
} 