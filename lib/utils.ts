import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EMOJI_GROUPS, EmojiData } from "./emojis";

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
    r = Number.parseInt(hex.substring(1, 3), 16);
    g = Number.parseInt(hex.substring(3, 5), 16);
    b = Number.parseInt(hex.substring(5, 7), 16);
  }
  return `rgba(${r},${g},${b},${alpha})`;
};

export const getBackgroundStyle = (bgOpacity: number, bgColor: string) => {
  // Center should be softer but not too soft; outer darker
  const alphaCenter = Math.max(0.5, (bgOpacity - 30) / 100); // Softer center
  const alphaOuter = bgOpacity; // Darker outer
  return {
    background: `radial-gradient(circle, ${hexToRGBA(
      bgColor,
      alphaCenter
    )} 0%, ${hexToRGBA(bgColor, alphaOuter)} 100%)`,
    transition: "background 0.5s ease-in-out",
  };
};

// Memoize the flattened emoji array - no need to rebuild on every function call
const allEmojis: EmojiData[] = EMOJI_GROUPS.flatMap((group) => group.emojis);

// Create a Map for O(1) lookup instead of O(n) array searching
const emojiShortcodeMap = new Map<string, EmojiData>(
  allEmojis.map((emoji) => [emoji.shortcode.toLowerCase(), emoji])
);

/**
 * Get emoji unicode from shortcode
 * @param shortcode - The emoji shortcode (e.g., ":grinning:")
 * @returns The unicode emoji character or empty string if not found
 */
export const getEmojiUnicode = (shortcode: string): string => {
  if (!shortcode) return "";

  const normalizedShortcode = shortcode.toLowerCase().trim();
  const emoji = emojiShortcodeMap.get(normalizedShortcode);

  return emoji?.unicode || "";
};

// utils/time.ts
export function generateTimeSlots() {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const HH = h.toString().padStart(2, "0");
      const MM = m.toString().padStart(2, "0");
      slots.push(`${HH}:${MM}`);
    }
  }
  return slots;
}
export const isEventExpired = (
  date: Date,
  startTime?: string | null
): boolean => {
  const now = new Date();
  const eventDate = new Date(date);

  if (startTime) {
    const [hours, minutes] = startTime.split(":").map(Number);
    eventDate.setHours(hours, minutes, 0, 0);
  } else {
    // If no start time, consider the event expired at end of day
    eventDate.setHours(23, 59, 59, 999);
  }

  return eventDate < now;
};

export function getInitials(fullName: string): string {
  if (!fullName || fullName.trim() === "") {
    return "";
  }

  const names = fullName.trim().split(/\s+/);
  return names.map((name) => name.charAt(0).toUpperCase()).join("");
}

export function isColorDark(color: string): boolean {
  // Default to "light" if color is missing or invalid
  if (!color) return false;

  let r, g, b;

  // Handle Hex (e.g., #ffffff or #fff)
  if (color.startsWith("#")) {
    const hex = color.substring(1);
    // Expansion of shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const expandedHex =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;

    const int = parseInt(expandedHex, 16);
    r = (int >> 16) & 255;
    g = (int >> 8) & 255;
    b = int & 255;
  }
  // Handle standard RGB/RGBA string
  else if (color.startsWith("rgb")) {
    const values = color.match(/\d+/g);
    if (!values) return false;
    r = parseInt(values[0]);
    g = parseInt(values[1]);
    b = parseInt(values[2]);
  } else {
    // Fallback for named colors or unknowns -> assume it's light
    return false;
  }

  // YIQ equation from 24 Basic Color Contrast algorithms
  // ((R*299)+(G*587)+(B*114))/1000
  // If >= 128, the color is "light", otherwise "dark"
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq < 128;
}
