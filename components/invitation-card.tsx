"use client";

import { INVITATION_FONTS } from "@/lib/fonts-config";
import { InvitationCardData, InviteFormData } from "@/validation/schema";
import { ChevronDownIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import AutoResizingTextarea from "./AutoResizingTextarea";
import { IconBackground } from "./emoji-svg-background";
import { FloatingError } from "./floating-error";
import { TimeToggle } from "./invite-time";
import { IconDisplay } from "./invite/Emoji-svg-picker";
import PencilIconInput from "./pencil-input";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Card, CardContent } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const YEARS_FROM_NOW = 2;

interface InvitationCardProps {
  bgColor: string;
  textColor: string;
  fontValue: string;
  isEditing?: boolean;
  control?: Control<InviteFormData>;
  errors?: FieldErrors<InviteFormData>;
  data: InvitationCardData;
  iconId?: string;
}

export function InvitationCard({
  bgColor,
  textColor,
  fontValue,
  isEditing = false,
  control,
  errors,
  iconId,
  data,
}: InvitationCardProps) {
  const selectedFont = INVITATION_FONTS.find((f) => f.value === fontValue);
  const fontFamily = selectedFont ? `var(${selectedFont.variable})` : "inherit";
  const format = useFormatter();
  const startTime = control ? control._getWatch("startTime") : undefined;
  const isStartTimeSet =
    typeof startTime === "string" && /^\d{2}:\d{2}$/.test(startTime);
  const t = useTranslations("PRIVATE.INVITE.BUILDER");

  return (
    <Card
      className="relative overflow-hidden border-none px-0 pt-8 pb-4"
      id="invite-card"
    >
      {iconId && <IconBackground iconId={iconId} bgColor={bgColor} />}
      {!iconId && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: bgColor }}
        />
      )}

      <CardContent
        className="relative z-20 flex h-full flex-col items-center justify-center px-8 py-4 md:py-16"
        style={{ color: textColor, fontFamily }}
      >
        {/* Title / Heading */}
        {iconId && <IconDisplay iconId={iconId} size={80} />}

        {/* Name */}
        <div className="relative w-full font-black leading-none text-5xl md:text-6xl  text-center focus:outline-none transition-all my-8">
          {isEditing ? (
            <>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <div className="relative group w-full">
                    <AutoResizingTextarea
                      style={{ color: textColor, fontFamily }}
                      value={field.value}
                      onValueChange={field.onChange}
                      maxLines={2}
                      aria-invalid={errors?.name ? "true" : "false"}
                      className="w-full focus:outline-none transition-all resize-none overflow-hidden text-center leading-normal"
                      placeholder={t("NAME")}
                      autoComplete="off"
                    />
                    <FloatingError error={errors?.name} bgColor={bgColor} />
                  </div>
                )}
              />
              <PencilIconInput />
            </>
          ) : (
            <div className="w-full" aria-label="Name">
              {data.name}
            </div>
          )}
        </div>

        {/* Date and Time Picker */}
        <div className="mb-6 w-full text-center flex flex-col md:flex-row text-lg items-center justify-center group relative gap-2 md:gap-4">
          {isEditing ? (
            <>
              {" "}
              {/* Date Controller */}
              <Controller
                name="date"
                control={control}
                render={({ field }) => {
                  const [popoverOpen, setPopoverOpen] = useState(false);
                  const now = new Date();

                  const selectedDate = field.value
                    ? new Date(field.value)
                    : undefined;

                  const updateDateWithNewDate = (date: Date) => {
                    if (!date) return;
                    date.setHours(0, 0, 0, 0);
                    field.onChange(date);
                  };

                  const onDateSelect = (date: Date) => {
                    setPopoverOpen(false);
                    if (date) {
                      updateDateWithNewDate(date);
                    }
                  };

                  return (
                    <div className="flex focus:outline-none transition-all duration-200">
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="hover:bg-transparent text-lg hover:text-current "
                            style={{ color: textColor }}
                            id="date-picker"
                            aria-haspopup="dialog"
                            aria-expanded={popoverOpen}
                          >
                            {selectedDate
                              ? format.dateTime(selectedDate, {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : t("SELECT-DATE")}
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            required
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
                            startMonth={now}
                            endMonth={
                              new Date(now.getFullYear() + YEARS_FROM_NOW, 0)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FloatingError error={errors?.date} bgColor={bgColor} />{" "}
                    </div>
                  );
                }}
              />
              {control && (
                <TimeToggle
                  label={t("START-TIME")}
                  name="startTime"
                  control={control}
                  errors={errors}
                  textColor={textColor}
                  selectedDate={data.date}
                  isSubmitting={false}
                />
              )}
              {isStartTimeSet && control && (
                <TimeToggle
                  label={t("END-TIME")}
                  name="endTime"
                  control={control}
                  errors={errors}
                  textColor={textColor}
                  selectedDate={data.date}
                  isSubmitting={false}
                />
              )}
              <PencilIconInput />
            </>
          ) : (
            <div aria-label="Event Date and Time " className="text-lg">
              {data.date
                ? format.dateTime(new Date(data.date), {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </div>
          )}
        </div>

        {/* Location */}
        {isEditing ? (
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <div className="relative group w-full">
                <AutoResizingTextarea
                  onValueChange={field.onChange}
                  maxLines={2}
                  aria-invalid={errors?.location ? "true" : "false"}
                  className="w-full focus:outline-none transition-all resize-none overflow-hidden text-center"
                  placeholder={t("LOCATION")}
                  autoComplete="off"
                />
                <PencilIconInput />
              </div>
            )}
          />
        ) : (
          <div
            className="w-full text-center text-lg"
            aria-label="Event Location"
          >
            {data.location}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
