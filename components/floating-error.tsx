// components/floating-error.tsx
import { cn, isColorDark } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { FieldError } from "react-hook-form";

interface FloatingErrorProps {
  error?: FieldError;
  bgColor?: string; // ✅ Add this prop
}

export function FloatingError({
  error,
  bgColor = "#ffffff",
}: FloatingErrorProps) {
  if (!error || !error.message) return null;

  // Determine if the invitation card background is dark
  const isBackgroundDark = useMemo(() => isColorDark(bgColor), [bgColor]);

  return (
    <div
      className={cn(
        "font-sans! absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-xl animate-in fade-in slide-in-from-top-1 duration-200 pointer-events-none border",
        isBackgroundDark
          ? "bg-white/95 border-white text-rose-600 shadow-black/20" // Light Pill (for Dark Cards)
          : "bg-gray-900/95  border-gray-800 shadow-gray-400/20" // Dark Pill (for Light Cards)
      )}
      style={{
        backdropFilter: "blur(8px)",
      }}
    >
      <AlertCircle className="w-3.5 h-3.5 stroke-[2.5] shrink-0 text-background" />
      <span
        className={cn(
          "text-sm font-medium whitespace-nowrap",
          isBackgroundDark ? "text-red" : "text-background"
        )}
      >
        {error.message}
      </span>

      {/* The little arrow pointing up */}
      <div
        className={cn(
          "absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-t border-l",
          isBackgroundDark
            ? "bg-white border-white"
            : "bg-gray-900 border-gray-800"
        )}
      />
    </div>
  );
}
