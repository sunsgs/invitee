"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { InvitationCard } from "@/components/invitation-card";
import { Field, FieldDescription } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { getEmojiUnicode } from "@/lib/utils";
import { InvitationCardData, InviteFormData } from "@/validation/schema";

import { saveInvitation } from "@/actions/invitationActions";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useInvitationForm } from "@/hooks/useInvitationForm";
import { InvitationSettings } from "./invite/InvitationSettings";
import { InvitationToolbar } from "./invite/InvitationToolbar";
import SignInDialog from "./signin-dialog";

interface InvitationBuilderProps {
  inviteId?: string;
  inviteBgColor?: string;
  inviteTextColor?: string;
  inviteFontValue?: string;
  inviteEmoji?: string;
  inviteEmojiDensity?: number;
  data?: InvitationCardData;
  inviteRSVPRequired?: boolean;
  inviteIsMaxGuestsCountEnabled?: boolean;
  inviteIsBabyCountEnabled?: boolean;
  inviteMaxGuestsBabyNumber?: number;
  inviteMaxGuestsNumber?: number;
  inviteDescription?: string;
}

export default function InvitationBuilder(props: InvitationBuilderProps) {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const {
    callbackURL,
    openSignin,
    setOpenSignin,
    savePendingAction,
    pendingData,
  } = useAuthRedirect();

  const form = useInvitationForm(props);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // When pending data arrives, reset form with it
  useEffect(() => {
    if (pendingData) {
      reset({
        title: pendingData.title,
        name: pendingData.name,
        date: pendingData.date,
        startTime: pendingData.startTime,
        endTime: pendingData.endTime,
        location: pendingData.location,
        description: pendingData.description,
        bgColor: pendingData.bgColor,
        textColor: pendingData.textColor,
        fontValue: pendingData.fontValue,
        emoji: pendingData.emoji,
        emojiDensity: pendingData.emojiDensity,
        rsvpRequired: pendingData.rsvpRequired,
        isMaxGuestsCountEnabled: pendingData.isMaxGuestsCountEnabled,
        isBabyCountEnabled: pendingData.isBabyCountEnabled,
        maxGuestsNumber: pendingData.maxGuestsNumber,
        maxGuestsBabyNumber: pendingData.maxGuestsBabyNumber,
      });
    }
  }, [pendingData, reset]);

  const onSubmit = async (data: InviteFormData) => {
    try {
      await saveInvitation({
        data,
        inviteId: props.inviteId,
        isAnonymous: session?.user.isAnonymous || undefined,
        onSuccess: (inviteId) => {
          if (!inviteId) {
            router.push("/user/invites");
          }
        },
        onAnonymous: () => {
          savePendingAction(data);
        },
      });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out",
          text: "Some description here",
          url: window.location.href,
        });
        console.log("Shared successfully");
      } catch (err) {
        // User cancelled or share failed
        console.log("Share failed:", err);
      }
    } else {
      // Fallback - copy to clipboard or show your own share modal
      console.log("Web Share API not supported");
    }
  };

  // Watch only what we need for preview
  const title = watch("title");
  const name = watch("name");
  const date = watch("date");
  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const location = watch("location");
  const bgColor = watch("bgColor");
  const textColor = watch("textColor");
  const fontValue = watch("fontValue");
  const emoji = watch("emoji");
  const emojiDensity = watch("emojiDensity");
  const rsvpRequired = watch("rsvpRequired");
  const isMaxGuestsCountEnabled = watch("isMaxGuestsCountEnabled");
  const isBabyCountEnabled = watch("isBabyCountEnabled");
  const maxGuestsNumber = watch("maxGuestsNumber");
  const maxGuestsBabyNumber = watch("maxGuestsBabyNumber");

  const previewEmoji = Array.isArray(emoji) ? emoji[0] : emoji;

  return (
    <div className="flex mb-10">
      <SignInDialog
        open={openSignin}
        onOpenChange={setOpenSignin}
        showTrigger={false}
        callbackURL={callbackURL}
      />

      <InvitationToolbar
        bgColor={bgColor || "#fff"}
        textColor={textColor || "#000"}
        fontValue={fontValue || "bagel"}
        selectedEmoji={previewEmoji || ""}
        emojiDensity={emojiDensity || 2}
        isSubmitting={isSubmitting}
        inviteId={props.inviteId}
        onBgColorChange={(color) =>
          setValue("bgColor", color, { shouldDirty: true })
        }
        onTextColorChange={(color) =>
          setValue("textColor", color, { shouldDirty: true })
        }
        onFontChange={(font) =>
          setValue("fontValue", font, { shouldDirty: true })
        }
        onEmojiSelect={(shortcode) =>
          setValue("emoji", getEmojiUnicode(shortcode), { shouldDirty: true })
        }
        onEmojiDensityChange={(density) =>
          setValue("emojiDensity", density, { shouldDirty: true })
        }
        onShare={() => handleShare()}
      />

      <div className="w-full mb-10">
        <form
          id="invitation-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 mt-8"
        >
          <InvitationCard
            isEditing={true}
            control={control}
            errors={errors}
            bgColor={bgColor || "#fff"}
            textColor={textColor || "#000"}
            fontValue={fontValue || "bagel"}
            emoji={previewEmoji || ""}
            // emojiIntensity={emojiDensity || 2}
            emojiIntensity={1}
            data={{
              title,
              name,
              date,
              location,
              startTime,
              endTime,
            }}
          />

          <Field>
            <h3 className="m-0">Notes/Description</h3>
            <Textarea
              className="bg-card rounded-2xl p-4 focus:outline-none focus-visible:border-foreground focus-visible:ring-[0]"
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

          <InvitationSettings
            rsvpRequired={rsvpRequired}
            isMaxGuestsCountEnabled={isMaxGuestsCountEnabled}
            isBabyCountEnabled={isBabyCountEnabled}
            maxGuestsNumber={maxGuestsNumber || 2}
            maxBabies={maxGuestsBabyNumber || 1}
            register={register}
            onRsvpToggle={(val) =>
              setValue("rsvpRequired", val, { shouldDirty: true })
            }
            onMaxGuestsToggle={(val) =>
              setValue("isMaxGuestsCountEnabled", val, { shouldDirty: true })
            }
            onBabyCountToggle={(val) =>
              setValue("isBabyCountEnabled", val, { shouldDirty: true })
            }
            onMaxGuestInput={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val >= 1 && val <= 99) {
                setValue("maxGuestsNumber", val, { shouldDirty: true });
              }
            }}
            onMaxGuestAdjust={(adj) => {
              const current = maxGuestsNumber || 2;
              setValue(
                "maxGuestsNumber",
                Math.max(1, Math.min(99, current + adj)),
                { shouldDirty: true }
              );
            }}
            onMaxBabyInput={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val >= 1 && val <= 99) {
                setValue("maxGuestsBabyNumber", val, { shouldDirty: true });
              }
            }}
            onMaxBabyAdjust={(adj) => {
              const current = maxGuestsBabyNumber || 1;
              setValue(
                "maxGuestsBabyNumber",
                Math.max(1, Math.min(99, current + adj)),
                { shouldDirty: true }
              );
            }}
          />
        </form>
      </div>
    </div>
  );
}
