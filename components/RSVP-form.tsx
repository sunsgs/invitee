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
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";

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
    selectedBg: "bg-muted-foreground",
    selectedText: "text-white",
    selectedBorder: "border-muted-foreground",
  },
  {
    value: "maybe",
    label: "Maybe",
    icon: HelpCircle,
    selectedBg: "bg-muted-foreground",
    selectedText: "text-white",
    selectedBorder: "border-muted-foreground",
  },
  {
    value: "attending",
    label: "Going",
    icon: CheckCircle2,
    selectedBg: "bg-muted-foreground",
    selectedText: "text-background",
    selectedBorder: "border-foreground",
  },
] as const;

export default function RsvpForm({
  inviteId,
  settings,
  onSubmitAction,
}: RsvpFormProps) {
  const [isPending, startTransition] = useTransition();

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
    startTransition(async () => {
      if (onSubmitAction) await onSubmitAction(data);
      console.log(data);
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 mt-8">
      {/* Status Selection */}
      <div className="space-y-2">
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
                          "flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium text-sm cursor-pointer transition-all duration-200 ease-out border",
                          isSelected
                            ? `${option.selectedBg} ${option.selectedText} ${option.selectedBorder} scale-[1.02]`
                            : "bg-card border-border text-foreground hover:border-muted-foreground/40"
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
                <p className="text-sm text-destructive mt-3">
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
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <Label
                  htmlFor="guest-name"
                  className="text-sm font-medium"
                >
                  Your name
                </Label>
                <Input
                  {...field}
                  id="guest-name"
                  placeholder="John Smith"
                  autoComplete="name"
                  className={cn(
                    "h-12 bg-card rounded-xl px-4 border transition-colors",
                    "focus:outline-none focus-visible:border-foreground focus-visible:ring-0",
                    fieldState.error
                      ? "border-destructive focus-visible:border-destructive"
                      : "border-border hover:border-muted-foreground/40"
                  )}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive mt-2">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* Guest Count - Only for attending/maybe */}
          {showGuestCount &&
            (settings.isBabyCountEnabled ||
              settings.isMaxGuestsCountEnabled) && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">
                  How many guests?
                </h4>

                <div className="space-y-0 border border-border rounded-xl overflow-hidden divide-y divide-border ">
                  {settings.isMaxGuestsCountEnabled && (
                    <div className="p-4">
                      <NumberInputField
                        id="adultsCount"
                        label="Guests"
                        value={adultsCount || 1}
                        onAdjust={(adj) => {
                          const current = adultsCount || 1;
                          setValue("adultsCount", current + adj, {
                            shouldDirty: true,
                          });
                        }}
                        registerProps={register("adultsCount", {
                          valueAsNumber: true,
                        })}
                        min={1}
                        max={settings.maxAdults}
                      />
                    </div>
                  )}
                  {settings.isBabyCountEnabled && (
                    <div className="p-4">
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
                      />
                    </div>
                  )}
                </div>

                {(errors.adultsCount || errors.babiesCount) && (
                  <p className="text-sm text-destructive mt-2">
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
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <Label
                  htmlFor="notes"
                  className="text-sm font-medium"
                >
                  Additional notes
                </Label>
                <Textarea
                  {...field}
                  id="notes"
                  placeholder="Dietary restrictions, accessibility needs, etc."
                  rows={4}
                  className={cn(
                    "bg-card rounded-xl px-4 py-3 border resize-none transition-colors",
                    "focus:outline-none focus-visible:border-foreground focus-visible:ring-0",
                    fieldState.error
                      ? "border-destructive focus-visible:border-destructive"
                      : "border-border hover:border-muted-foreground/40"
                  )}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive mt-2">
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
           className="py-8 w-full font-medium bg-muted-foreground hover:bg-foreground/80"
          >
            {isPending ? (
              <Spinner/>
            ) : (
              "Confirm RSVP"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}