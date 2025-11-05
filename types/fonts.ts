export interface FontOption {
  name: string;
  value: string;
  variable: string; // CSS variable name
  category: "serif" | "sans-serif" | "display" | "handwriting";
  preview: string;
}
