"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { insertRsvpSchema, RSVPFormData } from "@/validation/schema";
import { NumberInputField } from "./number-inputs";
import { Field } from "./ui/field";
import { Input } from "./ui/input";

interface RsvpFormProps {
  inviteId: string;
  settings: any; //TODO: adjust type
  onSubmitAction?: (data: RSVPFormData) => Promise<void>;
}

const RSVP_OPTIONS = [
  {
    value: "not_attending",
    label: "Can't go",
    icon: XCircle,
    iconColor: "text-gray-500",
    selectedBg: "bg-gray-900",
    selectedText: "text-white",
    selectedBorder: "border-gray-900",
  },
  {
    value: "maybe",
    label: "Maybe",
    icon: HelpCircle,
    iconColor: "text-gray-500",
    selectedBg: "bg-gray-900",
    selectedText: "text-white",
    selectedBorder: "border-gray-900",
  },
  {
    value: "attending",
    label: "Going",
    icon: CheckCircle2,
    iconColor: "text-gray-500",
    selectedBg: "bg-black",
    selectedText: "text-white",
    selectedBorder: "border-black",
  },
] as const;

export default function RsvpForm({
  inviteId,
  settings,
  onSubmitAction,
}: RsvpFormProps) {
  const [isPending, startTransition] = useTransition();
  console.log(settings);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors, isValid },
  } = useForm<RSVPFormData>({
    resolver: zodResolver(insertRsvpSchema),
    mode: "onChange",
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      status: undefined,
      adultsCount: 0,
      babiesCount: 0,
      notes: "",
      inviteId: inviteId,
    },
  });

  const selectedStatus = watch("status");
  const adultsCount = watch("adultsCount");
  const babiesCount = watch("babiesCount");
  const hasSelectedStatus = !!selectedStatus;
  const showGuestCount =
    selectedStatus === "attending" || selectedStatus === "maybe";

  const onSubmit = (data: RSVPFormData) => {
    // startTransition(async () => {
    //   if (onSubmitAction) await onSubmitAction(data);
    // });
    console.log(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Status Selection */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-foreground">
          Will you attend?
        </h3>

        <Controller
          control={control}
          name="status"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <RadioGroup
                value={field.value ?? ""}
                onValueChange={field.onChange}
                className="grid grid-cols-3 gap-2"
              >
                {RSVP_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = field.value === option.value;

                  return (
                    <div key={option.value} className="relative">
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={option.value}
                        className={cn(
                          "flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-medium text-sm cursor-pointer transition-all duration-200 ease-out border-2",
                          isSelected
                            ? `${option.selectedBg} ${option.selectedText} shadow-md scale-[1.02]`
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-900 hover:shadow-sm active:scale-[0.98]"
                        )}
                      >
                        {isSelected && <Icon className="h-4 w-4" />}
                        <span>{option.label}</span>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              {fieldState.error && (
                <p className="text-sm text-red-500 mt-2">
                  {fieldState.error.message}
                </p>
              )}
            </Field>
          )}
        />
      </div>

      {/* Form Fields - Progressive Disclosure */}
      {hasSelectedStatus && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Guest Name */}
          <Controller
            name="guestName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label
                  htmlFor="guest-name"
                  className="text-sm font-medium text-foreground mb-2 block"
                >
                  Your name
                </Label>
                <Input
                  {...field}
                  id="guest-name"
                  placeholder="John Smith"
                  autoComplete="name"
                  className={cn(
                    "h-12 rounded-xl border-2 transition-colors",
                    fieldState.error
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-input"
                  )}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500 mt-1.5">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* Contact Info - Optional
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="guestEmail"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label
                    htmlFor="guest-email"
                    className="text-sm font-medium text-foreground mb-2 block"
                  >
                    Email
                  </Label>
                  <Input
                    {...field}
                    id="guest-email"
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    className={cn(
                      "h-12 rounded-xl border-2 transition-colors",
                      fieldState.error
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-input"
                    )}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-500 mt-1.5">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />

            <Controller
              name="guestPhone"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label
                    htmlFor="guest-phone"
                    className="text-sm font-medium text-foreground mb-2 block"
                  >
                    Phone
                  </Label>
                  <Input
                    {...field}
                    id="guest-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                    className={cn(
                      "h-12 rounded-xl border-2 transition-colors",
                      fieldState.error
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-input"
                    )}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-500 mt-1.5">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />
          </div> */}

          {/* Guest Count - Only for attending/maybe */}
          {showGuestCount &&
            (settings.isBabyCountEnabled ||
              settings.isMaxGuestsCountEnabled) && (
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-semibold text-foreground">
                  How many guests?
                </h4>

                <div className="space-y-3 border-2 border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  {settings.isMaxGuestsCountEnabled && (
                    <NumberInputField
                      id="adultsCount"
                      label="Guests"
                      value={adultsCount || 0}
                      onAdjust={(adj) => {
                        const current = adultsCount || 0;
                        setValue("adultsCount", current + adj, {
                          shouldDirty: true,
                        });
                      }}
                      registerProps={register("adultsCount", {
                        valueAsNumber: true,
                      })}
                      min={1}
                      max={settings.maxAdults}
                      className="border-b border-gray-200 last:border-b-0 pb-4"
                    />
                  )}
                  {settings.isBabyCountEnabled && (
                    <NumberInputField
                      id="babiesCount"
                      label="Babies"
                      description="Under 2 years"
                      value={babiesCount || 0}
                      onAdjust={(adj) => {
                        const current = babiesCount || 0;
                        setValue("babiesCount", current + adj, {
                          shouldDirty: true,
                        });
                      }}
                      registerProps={register("babiesCount", {
                        valueAsNumber: true,
                      })}
                      min={0}
                      max={settings.maxBabies}
                      className="pt-4"
                    />
                  )}
                </div>

                {(errors.adultsCount || errors.babiesCount) && (
                  <p className="text-sm text-red-500 mt-1.5">
                    {errors.adultsCount?.message || errors.babiesCount?.message}
                  </p>
                )}
              </div>
            )}

          {/* Notes */}
          <Controller
            name="notes"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label
                  htmlFor="notes"
                  className="text-sm font-medium text-foreground mb-2 block"
                >
                  Additional notes
                </Label>
                <textarea
                  {...field}
                  id="notes"
                  placeholder="Dietary restrictions, accessibility needs, etc."
                  rows={3}
                  className={cn(
                    "w-full rounded-xl border-2 px-3 py-2 text-sm transition-colors resize-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    fieldState.error
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-input"
                  )}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500 mt-1.5">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* Submit Button */}
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending || !isValid}
            className={cn(
              "w-full h-12 rounded-xl text-base font-semibold transition-all",
              "bg-black hover:bg-gray-900 text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isPending && "cursor-wait"
            )}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              "Confirm RSVP"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
