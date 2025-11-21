import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import type { InviteFormData } from "@/validation/schema";
import React from "react";
import type { UseFormRegister } from "react-hook-form";

interface RSVPSettingsProps {
  rsvpRequired: boolean;
  setRsvpRequired: React.Dispatch<React.SetStateAction<boolean>>;
  register: UseFormRegister<InviteFormData>;
}

export function RSVPSettings({
  rsvpRequired,
  setRsvpRequired,
  register,
}: RSVPSettingsProps) {
  return (
    <Field>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <FieldLabel htmlFor="rsvpRequired" className="text-base font-medium">
            RSVP Required
          </FieldLabel>
          <p className="text-sm text-muted-foreground mt-1">
            Guests must confirm attendance
          </p>
        </div>
        <Switch
          id="rsvpRequired"
          {...register("rsvpRequired")}
          checked={rsvpRequired}
          onCheckedChange={setRsvpRequired}
          aria-label={rsvpRequired ? "Disable RSVP" : "Enable RSVP"}
        />
      </div>
    </Field>
  );
}
