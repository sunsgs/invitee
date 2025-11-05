"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";

type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];

function clsx(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface Color extends HSL {
  hex: string;
}

const HashtagIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M11.097 1.515a.75.75 0 0 1 .589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 1 1 1.47.294L16.665 7.5h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.2 6h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103H3.75a.75.75 0 0 1 0-1.5h3.885l1.2-6H5.25a.75.75 0 0 1 0-1.5h3.885l1.08-5.397a.75.75 0 0 1 .882-.588ZM10.365 9l-1.2 6h4.47l1.2-6h-4.47Z"
      clipRule="evenodd"
    />
  </svg>
);

function hslToHex({ h, s, l }: HSL): string {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);

  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));

  const toHex = (x: number) => x.toString(16).padStart(2, "0");

  return `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToHsl(hex: string): HSL {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  hex = hex.padEnd(6, "0");

  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s: number;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = (h / 6) * 360;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

interface DraggableColorCanvasProps extends HSL {
  handleChange: (color: Partial<Color>) => void;
}

const DraggableColorCanvas = React.memo<DraggableColorCanvasProps>(
  ({ h, s, l, handleChange }) => {
    const [dragging, setDragging] = useState(false);
    const colorAreaRef = useRef<HTMLDivElement>(null);

    const calculateSaturationAndLightness = useCallback(
      (clientX: number, clientY: number) => {
        if (!colorAreaRef.current) return;
        const rect = colorAreaRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
        const newSaturation = Math.round((x / rect.width) * 100);
        const newLightness = 100 - Math.round((y / rect.height) * 100);
        handleChange({ s: newSaturation, l: newLightness });
      },
      [handleChange]
    );

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        e.preventDefault();
        calculateSaturationAndLightness(e.clientX, e.clientY);
      },
      [calculateSaturationAndLightness]
    );

    const handleMouseUp = useCallback(() => setDragging(false), []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(true);
      calculateSaturationAndLightness(e.clientX, e.clientY);
    };

    const handleTouchMove = useCallback(
      (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
          calculateSaturationAndLightness(touch.clientX, touch.clientY);
        }
      },
      [calculateSaturationAndLightness]
    );

    const handleTouchEnd = useCallback(() => setDragging(false), []);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        setDragging(true);
        calculateSaturationAndLightness(touch.clientX, touch.clientY);
      }
    };

    useEffect(() => {
      if (dragging) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        window.addEventListener("touchend", handleTouchEnd);
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }, [
      dragging,
      handleMouseMove,
      handleMouseUp,
      handleTouchMove,
      handleTouchEnd,
    ]);

    return (
      <div
        ref={colorAreaRef}
        className="relative h-48 w-full touch-none select-none rounded-xl border border-zinc-200 dark:border-zinc-700 sm:h-56"
        style={{
          background: `linear-gradient(to top, #000, transparent, #fff), linear-gradient(to left, hsl(${h}, 100%, 50%), #bbb)`,
          cursor: "crosshair",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className="pointer-events-none absolute border-4 border-white shadow-lg ring-1 ring-zinc-200 dark:border-zinc-900 dark:ring-zinc-700"
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: `hsl(${h}, ${s}%, ${l}%)`,
            transform: "translate(-50%, -50%)",
            left: `${s}%`,
            top: `${100 - l}%`,
          }}
        />
      </div>
    );
  }
);

DraggableColorCanvas.displayName = "DraggableColorCanvas";

function sanitizeHex(val: string): string {
  return val
    .replace(/[^a-fA-F0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);
}

export interface ColorPickerProps {
  defaultValue?: string;
  onChange?: (color: { hex: string; hsl: HSL }) => void;
}

export const ColorPicker = ({
  defaultValue = "#1C9488",
  onChange,
}: ColorPickerProps) => {
  const [color, setColor] = useState<Color>(() => {
    const hex = sanitizeHex(defaultValue);
    const hsl = hexToHsl(hex);
    return { ...hsl, hex };
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onChange?.({
      hex: `#${color.hex}`,
      hsl: { h: color.h, s: color.s, l: color.l },
    });
  }, [color, onChange]);

  const handleHexInputChange = (newVal: string) => {
    const hex = sanitizeHex(newVal);
    if (hex.length === 6) {
      const hsl = hexToHsl(hex);
      setColor({ ...hsl, hex });
    } else {
      setColor((prev) => ({ ...prev, hex }));
    }
  };

  const handleCanvasChange = useCallback((partial: Partial<Color>) => {
    setColor((prev) => {
      const updated = { ...prev, ...partial };
      const hex = hslToHex({ h: updated.h, s: updated.s, l: updated.l });
      return { ...updated, hex };
    });
  }, []);

  const handleHueChange = (hue: number) => {
    setColor((prev) => {
      const hex = hslToHex({ h: hue, s: prev.s, l: prev.l });
      return { ...prev, h: hue, hex };
    });
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            input[type='range']::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 22px; 
              height: 22px;
              background: transparent;
              border: 4px solid #FFFFFF;
              box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1), 0 0 0 1px #e4e4e7; 
              cursor: pointer;
              border-radius: 50%;
              transition: transform 0.1s ease;
            }
            input[type='range']::-webkit-slider-thumb:active {
              transform: scale(1.1);
            }
            input[type='range']::-moz-range-thumb {
              width: 22px;
              height: 22px;
              cursor: pointer;
              border-radius: 50%;
              background: transparent;
              border: 4px solid #FFFFFF;
              box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1), 0 0 0 1px #e4e4e7;
              transition: transform 0.1s ease;
            }
            input[type='range']::-moz-range-thumb:active {
              transform: scale(1.1);
            }
            .dark input[type='range']::-webkit-slider-thumb {
              border: 4px solid rgb(24 24 27);
              box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.2), 0 0 0 1px #3f3f46; 
            }
            .dark input[type='range']::-moz-range-thumb {
              border: 4px solid rgb(24 24 27);
              box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.2), 0 0 0 1px #3f3f46; 
            }
            input[type='range'] {
              -webkit-tap-highlight-color: transparent;
            }
          `,
        }}
      />
      <div className="flex w-full max-w-[340px] select-none flex-col items-center gap-4 p-4">
        <DraggableColorCanvas {...color} handleChange={handleCanvasChange} />

        <Input
          type="range"
          min="0"
          max="360"
          value={color.h}
          className="h-4 w-full cursor-pointer appearance-none rounded-full border"
          style={{
            background: `linear-gradient(to right, 
              hsl(0, 100%, 50%), 
              hsl(60, 100%, 50%), 
              hsl(120, 100%, 50%), 
              hsl(180, 100%, 50%), 
              hsl(240, 100%, 50%), 
              hsl(300, 100%, 50%), 
              hsl(360, 100%, 50%))`,
            WebkitTapHighlightColor: "transparent",
          }}
          onChange={(e) => handleHueChange(e.target.valueAsNumber)}
        />

        <div className="relative h-fit w-full">
          <div className="pointer-events-none absolute inset-y-0 flex items-center px-2">
            <HashtagIcon className="size-3" />
          </div>
          <Input
            maxLength={6}
            inputMode="text"
            autoComplete="off"
            spellCheck="false"
            className="pl-5 flex w-full items-center justify-between rounded-lg border"
            // className={clsx(
            //   "flex w-full items-center justify-between rounded-lg border p-3 text-base font-medium focus:ring-2 focus:outline-none transition-colors sm:text-sm sm:p-2",
            //   "pl-[32px] sm:pl-[28px] pr-[42px] sm:pr-[38px]",
            //   "bg-black/[2.5%] text-zinc-700 dark:bg-white/[2.5%] dark:text-zinc-200",
            //   "border-zinc-200 dark:border-zinc-700",
            //   "hover:border-zinc-300 dark:hover:border-zinc-600",
            //   "focus:border-zinc-400 focus:ring-zinc-300",
            //   "dark:focus:border-zinc-500 dark:focus:ring-zinc-600",
            //   "selection:bg-black/20 selection:text-black",
            //   "dark:selection:bg-white/30 dark:selection:text-white"
            // )}
            style={{ WebkitTapHighlightColor: "transparent" }}
            value={color.hex}
            onChange={(e) => handleHexInputChange(e.target.value)}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex h-full items-center px-2">
            <div
              className="size-6 rounded-md"
              style={{
                backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
