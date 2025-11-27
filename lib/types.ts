export interface ApiErrorResponse {
  error: string; // The error message
  code?: string; // Optional: A specific error code (e.g., 'VALIDATION_FAILED', 'NOT_AUTHORIZED')
}

// Type definitions
export interface IconItem {
  id: string;
  name: string;
  unicode?: string; // For emojis
  svg?: string; // For inline SVG
  path?: string; // For SVG files
  keywords?: string[]; // For search
}

export interface IconGroup {
  name: string;
  items: IconItem[];
}
