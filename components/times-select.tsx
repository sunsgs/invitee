import { InviteFormData } from "@/validation/schema";
import { AlarmClock } from "lucide-react";
import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateTimeSlots } from "@/lib/utils";

interface TimeToggleProps {
  label: string;
  name: "startTime" | "endTime";
  control: Control<InviteFormData>;
  errors?: FieldErrors<InviteFormData>;
  textColor: string;
}

const timeSlots = generateTimeSlots();

export function TimeToggle2({
  label,
  name,
  control,
  errors,
  textColor,
}: TimeToggleProps) {
  const startTime = useWatch({ control, name: "startTime" });
  const isEnd = name === "endTime";

  // If endTime toggle, don't show until startTime is active
  if (isEnd && !startTime) return null;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const isActive = !!field.value; // toggle ON if value exists

        const toggleValue =
          name === "startTime" ? "start-toggle" : "end-toggle";

        const onToggleChange = (val: string | undefined) => {
          if (val === toggleValue) {
            if (!field.value) field.onChange("10:30"); // default on enable
          } else {
            field.onChange(undefined); // disable clears field
          }
        };

        const availableSlots =
          name === "endTime" && startTime
            ? timeSlots.filter((t) => t > startTime)
            : timeSlots;

        return (
          <div className="relative">
            <ToggleGroup
              type="single"
              value={isActive ? toggleValue : undefined}
              onValueChange={onToggleChange}
              variant="outline"
              spacing={2}
              aria-label={`Toggle ${label}`}
            >
              <ToggleGroupItem
                value={toggleValue}
                variant="outline"
                className="data-[state=on]:bg-transparent border-none shadow-none data-[state=off]:opacity-40"
              >
                <AlarmClock className="mr-2" />
                {isActive ? (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger
                      className="h-auto p-0 bg-transparent border-none shadow-none text-base"
                      style={{ color: textColor }}
                    >
                      <SelectValue placeholder={label.toLowerCase()} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-base" style={{ color: textColor }}>
                    {label.toLowerCase()}
                  </span>
                )}
              </ToggleGroupItem>
            </ToggleGroup>

            {errors?.[name] && isActive && (
              <p className="text-red-400 text-xs mt-1 absolute -bottom-5">
                {errors[name]?.message as string}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
