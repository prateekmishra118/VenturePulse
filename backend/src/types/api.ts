/**
 * Every VenturePulse API response follows this shape, success or failure.
 * Controllers should return ApiResponse<T> via the helpers in
 * utils/apiResponse.ts rather than building response objects by hand.
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  /** Present when the error came from input validation (added in Phase 6). */
  errors?: Array<{ field: string; message: string }>;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
