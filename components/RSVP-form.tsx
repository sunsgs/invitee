"use client";

import { cn } from "@/lib/utils";
import { RSVPFormData, RSVPSchema } from "@/validation/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, HelpCircle, Loader2, XCircle } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldError, FieldGroup } from "./ui/field";
import { Input } from "./ui/input";

interface RsvpFormProps {
  inviteId: string;
  onSubmitAction?: (data: RSVPFormData) => Promise<void>;
}

// RSVP option configurations for UI and logic
const RSVP_OPTIONS = [
  {
    value: "attending",
    label: "Going",
    description: "Count me in!",
    icon: CheckCircle2,
    color: "text-green-600",
    activeBorder: "border-green-600 bg-green-50",
  },
  {
    value: "maybe",
    label: "Maybe",
    description: "Still deciding",
    icon: HelpCircle,
    color: "text-orange-500",
    activeBorder: "border-orange-500 bg-orange-50",
  },
  {
    value: "not_attending",
    label: "Can't Go",
    description: "Next time",
    icon: XCircle,
    color: "text-red-500",
    activeBorder: "border-red-500 bg-red-50",
  },
] as const;

export default function RsvpForm({ inviteId, onSubmitAction }: RsvpFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RSVPFormData>({
    resolver: zodResolver(RSVPSchema),
    defaultValues: {
      guestName: undefined,
      status: undefined,
    },
  });

  const onSubmit = (data: RSVPFormData) => {
    startTransition(async () => {
      console.log(`Submitting RSVP for invite ${inviteId}:`, data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onSubmitAction) await onSubmitAction(data);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-4">
      <FieldGroup>
        <Controller
          name="guestName"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor="guest-name" className="mb-2 block font-medium">
                Name
              </Label>
              <Input
                className="bg-card"
                {...field}
                id="guest-name"
                aria-invalid={fieldState.invalid}
                placeholder="your name"
                autoComplete="off"
              />
              <FieldError errors={fieldState.error ? [fieldState.error] : []} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <RadioGroup
                value={field.value ?? ""}
                onValueChange={field.onChange}
                className="flex w-full items-center rounded-2xl gap-0 border border-border bg-card p-1 shadow-sm divide-x"
              >
                {RSVP_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = field.value === option.value;

                  return (
                    <div key={option.value} className={cn("flex-1 min-w-0")}>
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={option.value}
                        className={cn(
                          "flex flex-col items-center justify-center text-center p-3 sm:p-4 transition-colors duration-200 cursor-pointer h-full",
                          "rounded-2xl",
                          "peer-data-[state=checked]:bg-muted-foreground/20 peer-data-[state=checked]:text-muted-foreground"
                        )}
                      >
                        <div className="flex flex-col items-center w-full">
                          <div className="flex flex-col items-center space-y-1 mb-1.5">
                            <Icon className={cn("h-5 w-5", option.color)} />
                            <span className="font-semibold">
                              {option.label}
                            </span>
                          </div>
                          <span className="text-xs leading-tight">
                            {option.description}
                          </span>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              <FieldError errors={fieldState.error ? [fieldState.error] : []} />
            </Field>
          )}
        />
      </FieldGroup>

      <hr className="my-6 border-t border-border" />

      <Button
        type="submit"
        className="w-full rounded-2xl py-7 bg-muted-foreground font-bold tracking-wide"
        size="lg"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending Response...
          </>
        ) : (
          "Confirm Response"
        )}
      </Button>
    </form>
  );
}
