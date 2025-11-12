import { InviteFormData } from "@/validation/schema";
import { Clock, X } from "lucide-react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TimeToggleProps {
  label: string;
  name: "startTime" | "endTime";
  control: Control<InviteFormData>;
  errors?: FieldErrors<InviteFormData>;
  textColor: string;
  selectedDate?: Date;
  isSubmitting?: boolean;
}

// Generate 15-minute time slots
const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
});

export function TimeToggle({
  label,
  name,
  control,
  errors,
  textColor,
  isSubmitting,
}: TimeToggleProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const isActive =
          typeof field.value === "string" && /^\d{2}:\d{2}$/.test(field.value);

        const handleToggle = () => {
          if (isActive) {
            field.onChange(undefined);
          } else {
            field.onChange("10:00");
          }
        };

        return (
          <div className="relative inline-flex items-center gap-2">
            {/* Toggle Button */}
            <button
              type="button"
              onClick={handleToggle}
              disabled={isSubmitting}
              style={{
                color: textColor,
                borderColor: isActive ? "transparent" : `${textColor}33`,
              }}
              className={`
                group relative inline-flex items-center justify-center gap-2
                transition-all duration-200 ease-out touch-manipulation
                ${
                  isActive
                    ? "w-8 h-8 rounded-full bg-current/10 hover:bg-current/15 active:scale-95"
                    : "px-4 py-2 rounded-full border hover:border-current/60 hover:bg-current/5 active:scale-98"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/50 focus-visible:ring-offset-2
              `}
              aria-label={
                isActive
                  ? `Remove ${label.toLowerCase()}`
                  : `Add ${label.toLowerCase()}`
              }
              aria-pressed={isActive}
            >
              {isActive ? (
                <X className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              ) : (
                <>
                  <Clock className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {label}
                  </span>
                </>
              )}
            </button>

            {/* Time Picker - Only shown when active */}
            {isActive && (
              <Select
                value={field.value || "10:00"}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  className="text-base border-none shadow-none focus:outline-none"
                  aria-label={`Select ${label.toLowerCase()}`}
                  aria-invalid={errors?.[name] ? "true" : "false"}
                >
                  <SelectValue placeholder="10:00" />
                </SelectTrigger>
                <SelectContent
                  className="max-h-[200px] sm:max-h-[300px]"
                  position="popper"
                >
                  {timeSlots.map((slot) => (
                    <SelectItem
                      key={slot}
                      value={slot}
                      className="text-base cursor-pointer"
                    >
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Error Message */}
            {errors?.[name] && isActive && (
              <div
                role="alert"
                className="absolute -bottom-6 left-0 text-red-500 text-xs whitespace-nowrap font-medium"
              >
                {errors[name]?.message as string}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
