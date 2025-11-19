"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Baseline, PaintBucket, Share } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ColorPickerPopover } from "@/components/color-picker-popover";
import { EmojiDensityControl } from "@/components/emoji-density-control";
import { EmojiBackgroundPicker } from "@/components/Emoji-picker";
import { InvitationCard } from "@/components/invitation-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { getEmojiUnicode } from "@/lib/utils";
import {
  InvitationCardData,
  InviteFormData,
  inviteSchema,
} from "@/validation/schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FontSelector } from "./font-selector";
import { NumberInputField } from "./number-inputs";
import { Separator } from "./ui/separator";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";

interface InvitationBuilderPropos {
  inviteId?: string;
  inviteBgColor?: string;
  inviteTextColor?: string;
  inviteFontValue?: string;
  inviteEmoji?: string;
  inviteEmojiDensity?: number;
  data?: InvitationCardData;
}

export default function InvitationBuilder({
  inviteId,
  inviteBgColor,
  inviteTextColor,
  inviteFontValue,
  inviteEmoji,
  inviteEmojiDensity,
  data,
}: InvitationBuilderPropos) {
  const [bgColor, setBgColor] = useState(inviteBgColor || "#fff");
  const [textColor, setTextColor] = useState(inviteTextColor || "#000");
  const [fontValue, setFontValue] = useState(inviteFontValue || "playfair");
  const [selectedEmoji, setSelectedEmoji] = useState<string | string[]>(
    inviteEmoji || ""
  );
  const [selectedEmojiUnicode, setSelectedEmojiUnicode] = useState<
    string | string[]
  >(inviteEmoji || "");
  const router = useRouter();

  const [emojiDensity, setEmojiDensity] = useState(inviteEmojiDensity || 2);

  // UI states
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Guest count states
  const [isMaxGuestsCountEnabled, setIsMaxGuestsCountEnabled] = useState(false);
  const [maxGuestsNumber, setMaxGuestsNumber] = useState(2);
  const [isBabyCountEnabled, setIsBabyCountEnabled] = useState(false);
  const [maxBabies, setMaxBabies] = useState(2);

  const handleFontChange = (value: string) => {
    setFontValue(value);
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      title: data?.title || "",
      name: data?.name || "",
      date: data?.date,
      startTime: data?.startTime || "",
      endTime: data?.endTime || "",
      description: "",
      location: data?.location || "",
      isMaxGuestsCountEnabled: false,
      isBabyCountEnabled: false,
      rsvpRequired: false,
    },
  });

  useEffect(() => {
    const emojiValue =
      typeof selectedEmoji === "string"
        ? selectedEmoji
        : selectedEmoji.length > 0
        ? selectedEmoji[0]
        : undefined;

    setValue("bgColor", bgColor);
    setValue("fontValue", fontValue);
    setValue("textColor", textColor);
    setValue("emoji", emojiValue);
    setValue("emojiDensity", emojiValue ? emojiDensity : undefined);
    setValue("isMaxGuestsCountEnabled", isMaxGuestsCountEnabled);
    setValue("isBabyCountEnabled", isBabyCountEnabled);
    setValue("maxGuestsNumber", maxGuestsNumber);
    setValue("maxGuestsBabyNumber", isBabyCountEnabled ? maxBabies : undefined);
  }, [
    bgColor,
    fontValue,
    textColor,
    selectedEmoji,
    emojiDensity,
    isMaxGuestsCountEnabled,
    isBabyCountEnabled,
    maxGuestsNumber,
    maxBabies,
    setValue,
  ]);

  const rsvpRequiredValue = watch("rsvpRequired");

  // Generic number input handler factory
  const createNumberInputHandler = useCallback(
    (setter: React.Dispatch<React.SetStateAction<number>>) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= 99) {
          setter(value);
        }
      },
    []
  );

  // Generic adjustment handler factory
  const createAdjustmentHandler = useCallback(
    (setter: React.Dispatch<React.SetStateAction<number>>) =>
      (adjustment: number) => {
        setter((prev) => Math.max(1, Math.min(99, prev + adjustment)));
      },
    []
  );

  const handleMaxGuestInput = createNumberInputHandler(setMaxGuestsNumber);
  const handleMaxGuestAdjustment = createAdjustmentHandler(setMaxGuestsNumber);
  const handleMaxBabyInput = createNumberInputHandler(setMaxBabies);
  const handleMaxBabyAdjustment = createAdjustmentHandler(setMaxBabies);

  const onSubmit = async (data: InviteFormData) => {
    console.log(data);
    setIsSubmitting(true);
    setSubmitError(null);
    console.log(data);
    try {
      const payload = inviteId
        ? { ...data, id: inviteId } // Include inviteId for updates
        : { ...data };
      const validation = inviteSchema.safeParse(payload);
      if (!validation.success) {
        console.error("Validation failed:", validation.error);
        console.log(validation);
        setSubmitError("Please check your form fields");
        return;
      }

      // Determine method and endpoint based on whether we're editing or creating
      const method = inviteId ? "PATCH" : "POST";
      const endpoint = "/api/invite";

      const response = await fetch(endpoint, {
        method,
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Something went wrong");
        return;
      }

      const result = await response.json();
      console.log("Invitation saved successfully:", result);

      if (inviteId) {
        toast.success("Invite updated successfully");
      } else {
        toast.success("Invite created successfully");
        // Optionally redirect to the edit page with the new ID
        router.push("/user/invites");
      }
    } catch (error) {
      console.error("Error saving invitation:", error);
      setSubmitError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      toast.error("Failed to save invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmojiSelect = (shortcode: string) => {
    setSelectedEmoji(getEmojiUnicode(shortcode));
    setSelectedEmojiUnicode(shortcode);
  };

  const watchedTitle = watch("title");
  const watchedName = watch("name");
  const watchedDate = watch("date");
  const watchedStarttime = watch("startTime");
  const watchedEndtime = watch("endTime");
  const watchedLocation = watch("location");

  const previewEmoji = Array.isArray(selectedEmoji)
    ? selectedEmoji[0]
    : selectedEmoji;

  return (
    <div className="flex mb-10">
      <div className="flex w-full mx-auto fixed left-0 bottom-0 z-50 bg-background items-center border-t md:px-2 justify-between">
        <div className="divide-x w-full flex h-full">
          <ColorPickerPopover
            color={bgColor}
            onColorChange={setBgColor}
            icon={<PaintBucket className="h-4 w-4" />}
            label="Background color"
          />

          <ColorPickerPopover
            color={textColor}
            onColorChange={setTextColor}
            icon={<Baseline className="h-4 w-4" />}
            label="text color"
          />

          <FontSelector value={fontValue} onValueChange={handleFontChange} />

          <EmojiBackgroundPicker
            onEmojiSelect={handleEmojiSelect}
            selectedEmoji={previewEmoji}
          />
          {previewEmoji && (
            <div>
              <EmojiDensityControl
                density={emojiDensity}
                onDensityChange={setEmojiDensity}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center my-4">
          <Button
            type="submit"
            form="invitation-form"
            disabled={isSubmitting}
            size={"lg"}
            aria-label="Save"
            title="Save"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner /> Saving
              </div>
            ) : (
              "Save"
            )}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="px-4 py-6 cta"
            onClick={() => alert("Share feature coming soon")}
            aria-label="Share invitation"
          >
            <Share size={20} />
          </Button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 pb-16">
        {/* TODO: REMOVE AS NOT NEEDED*/}
        {Object.keys(errors).length > 0 && (
          <pre className="bg-red-100 text-red-700 p-4 mb-4 rounded max-w-2xl overflow-auto">
            {JSON.stringify(errors, null, 2)}
          </pre>
        )}
        <form
          id="invitation-form"
          onSubmit={handleSubmit((formData) => {
            console.log("Form data:", formData);
            onSubmit(formData); // your submit logic here
          })}
          className="flex flex-col gap-8 mt-8"
        >
          <InvitationCard
            isEditing={isEditing}
            control={control}
            errors={errors}
            bgColor={bgColor}
            textColor={textColor}
            fontValue={fontValue}
            emoji={previewEmoji}
            emojiIntensity={emojiDensity}
            data={{
              title: watchedTitle,
              name: watchedName,
              date: watchedDate,
              location: watchedLocation,
              startTime: watchedStarttime,
              endTime: watchedEndtime,
            }}
          />

          <Field>
            <h2>Notes/Description</h2>
            <Textarea
              className="bg-card rounded-2xl p-4 focus:outline-none focus-visible:border-foreground focus-visible:ring-[0]  "
              id="description"
              {...register("description")}
              placeholder="description or notes"
            />
            <FieldDescription>
              Any additional details about your invitation
            </FieldDescription>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </Field>
          <Separator className="my-2" />

          <Card className="relative overflow-hidden p-0 ">
            <CardContent className="p-8">
              <FieldGroup>
                <FieldSet>
                  <h2>Customize your invite</h2>
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
                              RSVP Required
                            </FieldLabel>
                            <p className="text-sm text-muted-foreground mt-1">
                              Guests must confirm attendance
                            </p>
                          </div>
                          <Switch
                            id="rsvpRequired"
                            {...register("rsvpRequired")}
                            checked={rsvpRequiredValue || false}
                            onCheckedChange={(checked) =>
                              setValue("rsvpRequired", checked)
                            }
                            aria-label={
                              rsvpRequiredValue ? "Disable RSVP" : "Enable RSVP"
                            }
                          />
                        </div>
                      </Field>
                    </div>

                    {/* Guest Count Section */}
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
                            checked={isMaxGuestsCountEnabled}
                            onCheckedChange={setIsMaxGuestsCountEnabled}
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
                                onChange={handleMaxGuestInput}
                                onAdjust={handleMaxGuestAdjustment}
                                registerProps={register("maxGuestsNumber", {
                                  valueAsNumber: true,
                                })}
                              />
                            </div>
                            <Field>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h2>Track babies separately</h2>
                                </div>
                                <Switch
                                  id="enableBabyCount"
                                  checked={isBabyCountEnabled}
                                  onCheckedChange={setIsBabyCountEnabled}
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
                                  onChange={handleMaxBabyInput}
                                  onAdjust={handleMaxBabyAdjustment}
                                  registerProps={register(
                                    "maxGuestsBabyNumber",
                                    {
                                      valueAsNumber: true,
                                    }
                                  )}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </FieldSet>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* {isEditing && (
            <div className="flex flex-col w-full items-center gap-2">
              <Button
                type="submit"
                className="w-full px-4 py-8 cta"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Invitation"}
              </Button>
              {submitError && (
                <p className="text-red-500 text-sm text-center">
                  {submitError}
                </p>
              )}
            </div>
          )} */}
        </form>
      </main>
    </div>
  );
}
