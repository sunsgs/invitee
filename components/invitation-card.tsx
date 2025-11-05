"use client";

import { INVITATION_FONTS } from "@/lib/fonts-config";
import { InvitationCardData, InviteFormData } from "@/validation/schema";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { EmojiBackground } from "./emoji-background";
import PencilIconInput from "./pencil-input";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Card, CardContent } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface InvitationCardProps {
  bgColor: string;
  textColor: string;
  fontValue: string;
  isEditing?: boolean;
  control: Control<InviteFormData>;
  errors: FieldErrors<InviteFormData>;
  emoji?: string;
  emojiIntensity?: number;
  data: InvitationCardData;
}

export function InvitationCard({
  bgColor,
  textColor,
  fontValue,
  isEditing = false,
  control,
  errors,
  emoji,
  emojiIntensity = 2,
  data,
}: InvitationCardProps) {
  const selectedFont = INVITATION_FONTS.find((f) => f.value === fontValue);
  const fontFamily = selectedFont ? `var(${selectedFont.variable})` : "inherit";

  return (
    <Card
      className="relative w-full max-w-2xl mx-auto aspect-square overflow-hidden border-none shadow-2xl"
      id="invite-card"
    >
      {emoji && (
        <EmojiBackground
          emoji={emoji}
          bgColor={bgColor}
          density={emojiIntensity}
        />
      )}
      {!emoji && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: bgColor }}
        />
      )}

      <CardContent
        className="relative z-20 flex h-full flex-col items-center justify-center gap-4 p-4"
        style={{ color: textColor, fontFamily }}
      >
        {/* Title / Heading */}
        <div className="font-semibold text-2xl w-full text-center tracking-wider">
          {isEditing ? (
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <div className="relative group w-full " id="event-title">
                  <input
                    {...field}
                    aria-invalid={errors.title ? "true" : "false"}
                    className={`w-full focus:outline-none transition-all duration-200 ${
                      errors.title
                        ? "border-red-400 border-b-2"
                        : "border-transparent hover:border-current/30 focus:border-current/60"
                    }`}
                    placeholder="your title"
                    autoComplete="off"
                  />
                  <PencilIconInput />
                </div>
              )}
            />
          ) : (
            <div className="w-full" role="heading" aria-level={3}>
              {data.title}
            </div>
          )}
        </div>

        {/* Name */}
        <div className="w-full font-black leading-none text-5xl  md:text-8xl  text-center focus:outline-none transition-all duration-200">
          {isEditing ? (
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <div className="relative group w-full">
                  <input
                    {...field}
                    aria-invalid={errors.name ? "true" : "false"}
                    className={`w-full focus:outline-none transition-all duration-200 ${
                      errors.name
                        ? "border-red-400 border-b-2"
                        : "border-transparent hover:border-current/30 focus:border-current/60"
                    }`}
                    placeholder="Name"
                    autoComplete="off"
                  />
                  <PencilIconInput />
                </div>
              )}
            />
          ) : (
            <div className="w-full" aria-label="Name">
              {data.name}
            </div>
          )}
        </div>

        {/* Date and Time Picker */}
        {isEditing ? (
          <Controller
            name="datetime"
            control={control}
            render={({
              field,
              formState: { isSubmitting },
              fieldState: { error },
            }) => {
              const [popoverOpen, setPopoverOpen] = useState(false);
              const now = new Date();

              const selectedDate = field.value
                ? new Date(field.value)
                : undefined;

              const updateDateWithNewDate = (date: Date) => {
                if (!date) return;
                const existingTime = selectedDate || new Date();
                date.setHours(
                  existingTime.getHours(),
                  existingTime.getMinutes(),
                  0,
                  0
                );
                field.onChange(date.toISOString());
              };

              const updateDateWithNewTime = (timeStr: string) => {
                if (!selectedDate) return;
                const [hours, minutes] = timeStr.split(":").map(Number);
                if (isNaN(hours) || isNaN(minutes)) return;
                const updated = new Date(selectedDate);
                updated.setHours(hours, minutes, 0, 0);

                // Prevent past times for today
                if (updated <= now) {
                  return;
                }

                field.onChange(updated.toISOString());
              };

              const onDateSelect = (date: Date | undefined) => {
                setPopoverOpen(false);
                if (date) {
                  updateDateWithNewDate(date);
                }
              };

              // Get minimum time for today
              const getMinTime = () => {
                if (!selectedDate) return undefined;
                const isToday =
                  selectedDate.toDateString() === now.toDateString();
                if (isToday) {
                  const hours = now.getHours().toString().padStart(2, "0");
                  const minutes = now.getMinutes().toString().padStart(2, "0");
                  return `${hours}:${minutes}`;
                }
                return undefined;
              };

              return (
                <div className="flex gap-4 items-center justify-center group relative w-full">
                  {/* Date Picker */}
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="hover:bg-transparent hover:text-current transition-colors"
                        style={{ color: textColor }}
                        id="date-picker"
                        aria-haspopup="dialog"
                        aria-expanded={popoverOpen}
                      >
                        {selectedDate ? selectedDate.toISOString() : "select"}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        captionLayout="dropdown"
                        onSelect={onDateSelect}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        hidden={{ before: now }}
                        defaultMonth={selectedDate || now}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Time Picker */}
                  <input
                    id="time-picker"
                    type="time"
                    step={60}
                    value={
                      selectedDate
                        ? selectedDate.toTimeString().slice(0, 5)
                        : "10:30"
                    }
                    onChange={(e) =>
                      updateDateWithNewTime(e.currentTarget.value)
                    }
                    min={getMinTime()}
                    disabled={isSubmitting}
                    aria-invalid={!!error}
                    aria-describedby={error ? "datetime-error" : undefined}
                    className="w-32 bg-transparent appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    style={{
                      color: textColor,
                      borderColor: error
                        ? "rgb(248 113 113 / 0.6)"
                        : "currentColor",
                    }}
                  />
                  {error && (
                    <p
                      id="datetime-error"
                      role="alert"
                      className="text-red-400 text-xs mt-1 absolute -bottom-6"
                    >
                      {error.message}
                    </p>
                  )}
                  <PencilIconInput />
                </div>
              );
            }}
          />
        ) : (
          <div aria-label="Event Date and Time">
            {data.datetime
              ? new Date(data.datetime).toLocaleString(undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </div>
        )}

        {/* Location */}
        {isEditing ? (
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                aria-invalid={errors.location ? "true" : "false"}
                className={`w-full focus:outline-none transition-all duration-200  ${
                  errors.location
                    ? "border-red-400/60"
                    : "border-transparent hover:border-current/30 focus:border-current/60"
                }`}
                placeholder="Location"
                autoComplete="off"
              />
            )}
          />
        ) : (
          <div className="w-full" aria-label="Event Location">
            {data.location}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
