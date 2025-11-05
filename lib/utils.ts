import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hexToRGBA = (hex: string, alpha = 0.5) => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = Number.parseInt(hex[1] + hex[1], 16);
    g = Number.parseInt(hex[2] + hex[2], 16);
    b = Number.parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = Number.parseInt(hex.substr(1, 2), 16);
    g = Number.parseInt(hex.substr(3, 2), 16);
    b = Number.parseInt(hex.substr(5, 2), 16);
  }
  return `rgba(${r},${g},${b},${alpha})`;
};
