import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { InviteFormData } from "@/validation/schema";
import { UseFormRegister } from "react-hook-form";
import { NumberInputField } from "../number-inputs";

interface GuestLimitSettingsProps {
  isMaxGuestsCountEnabled?: boolean;
  isBabyCountEnabled?: boolean;
  maxGuestsNumber: number;
  maxBabies: number;
  register: UseFormRegister<InviteFormData>;
  onMaxGuestsToggle: (enabled: boolean) => void;
  onBabyCountToggle: (enabled: boolean) => void;
  onMaxGuestInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxGuestAdjust: (adjustment: number) => void;
  onMaxBabyInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxBabyAdjust: (adjustment: number) => void;
}

export const GuestLimitSettings = ({
  isMaxGuestsCountEnabled,
  isBabyCountEnabled,
  maxGuestsNumber,
  maxBabies,
  register,
  onMaxGuestsToggle,
  onBabyCountToggle,
  onMaxGuestInput,
  onMaxGuestAdjust,
  onMaxBabyInput,
  onMaxBabyAdjust,
}: GuestLimitSettingsProps) => {
  return (
    <div className="space-y-4 pt-4 border-t">
      <Field>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <FieldLabel
              htmlFor="isMaxGuestsCountEnabled"
              className="text-base font-medium"
            >
              Guest Limits
            </FieldLabel>
            <p className="text-sm text-muted-foreground mt-1">
              Maximum guests each invitee can bring
            </p>
          </div>
          <Switch
            id="isMaxGuestsCountEnabled"
            {...register("isMaxGuestsCountEnabled")}
            checked={isMaxGuestsCountEnabled}
            onCheckedChange={onMaxGuestsToggle}
            aria-label={
              isMaxGuestsCountEnabled
                ? "Disable guest limits"
                : "Enable guest limits"
            }
          />
        </div>
      </Field>

      {isMaxGuestsCountEnabled && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <NumberInputField
                id="maxGuestsNumber"
                min={1}
                max={10}
                label="Adults"
                value={maxGuestsNumber}
                onChange={onMaxGuestInput}
                onAdjust={onMaxGuestAdjust}
                registerProps={register("maxGuestsNumber", {
                  valueAsNumber: true,
                })}
              />
            </div>

            <Field>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <FieldLabel
                    htmlFor="isMaxGuestsCountEnabled"
                    className="text-base font-medium"
                  >
                    Track babies separately
                  </FieldLabel>
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum guests each invitee can bring
                  </p>
                </div>
                <Switch
                  id="enableBabyCount"
                  checked={isBabyCountEnabled}
                  onCheckedChange={onBabyCountToggle}
                  aria-label={
                    isBabyCountEnabled
                      ? "Disable baby count"
                      : "Enable baby count"
                  }
                  className="shrink-0"
                />
              </div>
            </Field>

            {isBabyCountEnabled && (
              <div className="flex-1 animate-in slide-in-from-top-2 duration-200">
                <NumberInputField
                  id="maxGuestsBabyNumber"
                  min={1}
                  max={10}
                  label="Babies (under 2 years)"
                  value={maxBabies}
                  onChange={onMaxBabyInput}
                  onAdjust={onMaxBabyAdjust}
                  registerProps={register("maxGuestsBabyNumber", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
