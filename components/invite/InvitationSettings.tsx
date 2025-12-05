"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { InviteFormData } from "@/validation/schema";
import { useTranslations } from "next-intl";
import { UseFormRegister } from "react-hook-form";
import { GuestLimitSettings } from "./GuestLimitSettings";

interface InvitationSettingsProps {
  rsvpRequired?: boolean;
  isMaxGuestsCountEnabled?: boolean;
  isBabyCountEnabled?: boolean;
  maxGuestsNumber: number;
  maxBabies: number;
  register: UseFormRegister<InviteFormData>;
  onRsvpToggle: (enabled: boolean) => void;
  onMaxGuestsToggle: (enabled: boolean) => void;
  onBabyCountToggle: (enabled: boolean) => void;
  onMaxGuestInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxGuestAdjust: (adjustment: number) => void;
  onMaxBabyInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxBabyAdjust: (adjustment: number) => void;
}

export const InvitationSettings = ({
  rsvpRequired,
  isMaxGuestsCountEnabled,
  isBabyCountEnabled,
  maxGuestsNumber,
  maxBabies,
  register,
  onRsvpToggle,
  onMaxGuestsToggle,
  onBabyCountToggle,
  onMaxGuestInput,
  onMaxGuestAdjust,
  onMaxBabyInput,
  onMaxBabyAdjust,
}: InvitationSettingsProps) => {
  const t = useTranslations("PRIVATE.INVITE.BUILDER")
  return (
    <Card className="relative overflow-hidden p-0">
      <CardContent className="p-8">
        <FieldGroup>
          <FieldSet>
            <h3>{t("CUSTOMIZE-TITLE")}</h3>
            <div className="space-y-4">
              {/* RSVP Section */}
              <div className="space-y-4">
                <Field>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <FieldLabel
                        htmlFor="rsvpRequired"
                        className="text-base font-medium"
                      >
                       {t("RSVP-REQ")}
                      </FieldLabel>
                      <p className="text-sm text-muted-foreground mt-1">
                       {t("RSVP-DESC")}
                      </p>
                    </div>
                    <Switch
                      id="rsvpRequired"
                      {...register("rsvpRequired")}
                      checked={rsvpRequired}
                      onCheckedChange={onRsvpToggle}
                      aria-label={rsvpRequired ? "Disable RSVP" : "Enable RSVP"}
                    />
                  </div>
                </Field>
              </div>

              {/* Guest Count Section */}
              <GuestLimitSettings
                isMaxGuestsCountEnabled={isMaxGuestsCountEnabled}
                isBabyCountEnabled={isBabyCountEnabled}
                maxGuestsNumber={maxGuestsNumber}
                maxBabies={maxBabies}
                register={register}
                onMaxGuestsToggle={onMaxGuestsToggle}
                onBabyCountToggle={onBabyCountToggle}
                onMaxGuestInput={onMaxGuestInput}
                onMaxGuestAdjust={onMaxGuestAdjust}
                onMaxBabyInput={onMaxBabyInput}
                onMaxBabyAdjust={onMaxBabyAdjust}
              />
            </div>
          </FieldSet>
        </FieldGroup>
      </CardContent>
    </Card>
  );
};
