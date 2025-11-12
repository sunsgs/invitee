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
