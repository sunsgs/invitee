export interface ApiErrorResponse {
  error: string; // The error message
  code?: string; // Optional: A specific error code (e.g., 'VALIDATION_FAILED', 'NOT_AUTHORIZED')
}
