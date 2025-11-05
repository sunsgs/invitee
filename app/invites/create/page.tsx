"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Edit3,
  Eye,
  Minus,
  PaintRollerIcon,
  Plus,
  Settings2,
  Share2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ColorPickerPopover } from "@/components/color-picker-popover";
import { EmojiDensityControl } from "@/components/emoji-density-control";
import { EmojiBackgroundPicker } from "@/components/Emoji-picker";
import { FontAndColorPopover } from "@/components/font-and-color-selector";
import { InvitationCard } from "@/components/invitation-card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { hexToRGBA } from "@/lib/utils";
import { InviteFormData, inviteSchema } from "@/validation/schema";

export default function InvitationBuilder() {
  const [bgColor, setBgColor] = useState("#FF69B4");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontValue, setFontValue] = useState("playfair");
  const [selectedEmoji, setSelectedEmoji] = useState<string | string[]>("");
  const [emojiDensity, setEmojiDensity] = useState(2);
  const [isEditing, setIsEditing] = useState(true);
  const [gpuCount, setGpuCount] = useState(8);

  const [babyCountEnabled, setBabyCountEnabled] = useState(false);
  const [babyCount, setBabyCount] = useState(2);

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
      title: "",
      name: "lorenzo",
      datetime: "2025-11-24T18:00",
      location: "napoli",
      description: "",
      maxGuests: gpuCount,
      maxGuestsBaby: babyCountEnabled ? babyCount : undefined,
      rsvpRequired: false,
      bgColor,
      fontValue,
      textColor,
      emoji:
        typeof selectedEmoji === "string"
          ? selectedEmoji
          : selectedEmoji.length > 0
          ? selectedEmoji[0]
          : undefined,
      emojiDensity: selectedEmoji ? emojiDensity : undefined,
    },
  });

  useEffect(() => {
    setValue("bgColor", bgColor, { shouldValidate: true });
  }, [bgColor, setValue]);

  useEffect(() => {
    setValue("fontValue", fontValue, { shouldValidate: true });
  }, [fontValue, setValue]);

  useEffect(() => {
    setValue("textColor", textColor, { shouldValidate: true });
  }, [textColor, setValue]);

  useEffect(() => {
    const emojiValue =
      typeof selectedEmoji === "string"
        ? selectedEmoji
        : selectedEmoji.length > 0
        ? selectedEmoji[0]
        : undefined;
    setValue("emoji", emojiValue);
    setValue("emojiDensity", emojiValue ? emojiDensity : undefined);
  }, [selectedEmoji, emojiDensity, setValue]);

  useEffect(() => {
    setValue("maxGuests", gpuCount, { shouldValidate: true });
  }, [gpuCount, setValue]);

  useEffect(() => {
    setValue("maxGuestsBaby", babyCountEnabled ? babyCount : undefined, {
      shouldValidate: true,
    });
  }, [babyCount, babyCountEnabled, setValue]);

  const rsvpRequiredValue = watch("rsvpRequired");

  const handleMaxGuestInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 1 && value <= 99) {
        setGpuCount(value);
      }
    },
    []
  );

  const handleMaxGuestAdjustment = useCallback((adjustment: number) => {
    setGpuCount((prevCount) =>
      Math.max(1, Math.min(99, prevCount + adjustment))
    );
  }, []);

  const handleMaxBabyInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 1 && value <= 99) {
        setBabyCount(value);
      }
    },
    []
  );

  const handleMaxBabyAdjustment = useCallback((adjustment: number) => {
    setBabyCount((prevCount) =>
      Math.max(1, Math.min(99, prevCount + adjustment))
    );
  }, []);

  const onSubmit = (data: InviteFormData) => {
    const payload = {
      ...data,
      emojiDensity: data.emoji ? data.emojiDensity ?? 2 : undefined,
      maxGuestsBaby: babyCountEnabled ? data.maxGuestsBaby : undefined,
    };
    console.log("Invitation saved:", payload);
    setIsEditing(false);
  };

  const watchedTitle = watch("title");
  const watchedName = watch("name");
  const watchedDatetime = watch("datetime");
  const watchedLocation = watch("location");

  const previewEmoji = Array.isArray(selectedEmoji)
    ? selectedEmoji[0]
    : selectedEmoji;

  return (
    <div
      className="min-h-screen "
      style={{ backgroundColor: hexToRGBA(bgColor, 0.3) }}
    >
      <div
        id="customizator"
        className="flex flex-col fixed right-0 top-1/2 -translate-y-1/2 z-50 gap-2"
        aria-label="Invitation customization controls"
      >
        <ColorPickerPopover
          color={bgColor}
          onColorChange={setBgColor}
          icon={<PaintRollerIcon className="h-4 w-4" />}
          label="Background color"
        />
        <FontAndColorPopover
          fontValue={fontValue}
          onFontChange={setFontValue}
          textColor={textColor}
          onTextColorChange={setTextColor}
        />
        <EmojiBackgroundPicker
          onEmojiSelect={setSelectedEmoji}
          selectedEmoji={previewEmoji}
        />
        <EmojiDensityControl
          density={emojiDensity}
          onDensityChange={setEmojiDensity}
        />
      </div>

      <div className="sticky top-0 flex items-center justify-between px-4 py-4 z-20 bg-white">
        <h1 className="text-2xl font-semibold">Invitation Builder</h1>

        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            aria-pressed={isEditing}
            aria-label={
              isEditing ? "Switch to view mode" : "Switch to edit mode"
            }
            title={isEditing ? "View invitation" : "Edit invitation"}
          >
            {isEditing ? <Eye size={16} /> : <Edit3 size={16} />}
            <span className="ml-2">{isEditing ? "View" : "Edit"}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => alert("Share feature coming soon")}
            aria-label="Share invitation"
          >
            <Share2 size={20} />
          </Button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 pb-16">
        <form
          onSubmit={handleSubmit(onSubmit)}
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
              datetime: watchedDatetime,
              location: watchedLocation,
            }}
          />

          <div className="flex">
            <FieldGroup>
              <FieldSet>
                <FieldDescription className="flex gap-2 items-center">
                  <Settings2 size={20} /> Invite settings—you can select all
                  your settings here
                </FieldDescription>

                <div className="flex gap-4 flex-col">
                  <Field className="flex">
                    <div className="flex justify-between items-center mb-2">
                      <FieldLabel htmlFor="rsvpRequired" className="mr-3">
                        RSVP Required
                      </FieldLabel>
                      <Switch
                        id="rsvpRequired"
                        {...register("rsvpRequired")}
                        checked={rsvpRequiredValue}
                        onCheckedChange={(checked) =>
                          setValue("rsvpRequired", checked)
                        }
                        aria-label={
                          rsvpRequiredValue ? "Disable RSVP" : "Enable RSVP"
                        }
                      />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="maxGuests">
                      Max number of guests
                    </FieldLabel>
                    <ButtonGroup>
                      <Input
                        id="maxGuests"
                        value={gpuCount}
                        {...register("maxGuests", { valueAsNumber: true })}
                        onChange={handleMaxGuestInput}
                        size={2}
                        className="h-8"
                        maxLength={2}
                      />
                      <Button
                        variant="outline"
                        size="icon-sm"
                        type="button"
                        aria-label="Decrement guests"
                        onClick={() => handleMaxGuestAdjustment(-1)}
                        disabled={gpuCount <= 1}
                      >
                        <Minus />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        type="button"
                        aria-label="Increment guests"
                        onClick={() => handleMaxGuestAdjustment(1)}
                        disabled={gpuCount >= 99}
                      >
                        <Plus />
                      </Button>
                    </ButtonGroup>
                  </Field>

                  <Field>
                    <div className="flex justify-between items-center">
                      <FieldLabel htmlFor="enableBabyCount">
                        Include Baby Count
                      </FieldLabel>
                      <Switch
                        id="enableBabyCount"
                        checked={babyCountEnabled}
                        onCheckedChange={setBabyCountEnabled}
                        aria-label={
                          babyCountEnabled
                            ? "Disable baby count"
                            : "Enable baby count"
                        }
                      />
                    </div>
                    {babyCountEnabled && (
                      <ButtonGroup>
                        <Input
                          id="maxGuestsBaby"
                          value={babyCount}
                          {...register("maxGuestsBaby", {
                            valueAsNumber: true,
                          })}
                          onChange={handleMaxBabyInput}
                          size={2}
                          className="h-8"
                          maxLength={2}
                        />
                        <Button
                          variant="outline"
                          size="icon-sm"
                          type="button"
                          aria-label="Decrement baby count"
                          onClick={() => handleMaxBabyAdjustment(-1)}
                          disabled={babyCount <= 1}
                        >
                          <Minus />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          type="button"
                          aria-label="Increment baby count"
                          onClick={() => handleMaxBabyAdjustment(1)}
                          disabled={babyCount >= 99}
                        >
                          <Plus />
                        </Button>
                      </ButtonGroup>
                    )}
                  </Field>
                </div>
              </FieldSet>
            </FieldGroup>
          </div>

          {isEditing && (
            <div className="flex justify-center">
              <Button type="submit" className="w-48">
                Save Invitation
              </Button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
