declare module 'express-validator' {
  import { Request, Response, NextFunction } from 'express';

  export interface ValidationError {
    type: string;
    msg: string;
    path: string;
    location: string;
    param: string;
  }

  export function validationResult(req: Request): {
    isEmpty(): boolean;
    array(): ValidationError[];
  };

  export function body(field: string): any;
  export function param(field: string): any;
  export function query(field: string): any;
} 