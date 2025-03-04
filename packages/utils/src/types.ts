// Common types used across the application

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  [key: string]: any;
}

export type ErrorResponse = {
  error: string;
  message?: string;
};

export type SuccessResponse<T> = {
  data: T;
  message?: string;
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function isErrorResponse(response: any): response is ErrorResponse {
  return 'error' in response;
}

export function isSuccessResponse<T>(response: any): response is SuccessResponse<T> {
  return 'data' in response;
} 