"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { InvitationCard } from "@/components/invitation-card";
import { Field, FieldDescription } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { InvitationCardData, InviteFormData } from "@/validation/schema";

import { saveInvitation } from "@/actions/invitationActions";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useInvitationForm } from "@/hooks/useInvitationForm";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { InvitationSettings } from "./invite/InvitationSettings";
import { InvitationToolbar } from "./invite/InvitationToolbar";
import SignInDialog from "./signin-dialog";

interface InvitationBuilderProps {
  inviteId?: string;
  inviteBgColor?: string;
  inviteTextColor?: string;
  inviteFontValue?: string;
  data?: InvitationCardData;
  inviteRSVPRequired?: boolean;
  inviteIsMaxGuestsCountEnabled?: boolean;
  inviteIsBabyCountEnabled?: boolean;
  inviteMaxGuestsBabyNumber?: number;
  inviteMaxGuestsNumber?: number;
  inviteDescription?: string;
  inviteIconId?: string;
}

export default function InvitationBuilder(props: InvitationBuilderProps) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const t = useTranslations();

  const {
    callbackURL,
    openSignin,
    setOpenSignin,
    savePendingAction,
    pendingData,
  } = useAuthRedirect();

  const form = useInvitationForm(props);
  const hasSavedPendingRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // Auto-save when pendingData arrives after authentication
  useEffect(() => {
    if (pendingData && !hasSavedPendingRef.current) {
      hasSavedPendingRef.current = true;

      // Reset form with pending data first
      reset({
        title: pendingData.title,
        name: pendingData.name,
        date: new Date(pendingData.date),
        startTime: pendingData.startTime,
        endTime: pendingData.endTime,
        location: pendingData.location,
        description: pendingData.description,
        bgColor: pendingData.bgColor,
        textColor: pendingData.textColor,
        fontValue: pendingData.fontValue,
        rsvpRequired: pendingData.rsvpRequired,
        isMaxGuestsCountEnabled: pendingData.isMaxGuestsCountEnabled,
        isBabyCountEnabled: pendingData.isBabyCountEnabled,
        maxGuestsNumber: pendingData.maxGuestsNumber,
        maxGuestsBabyNumber: pendingData.maxGuestsBabyNumber,
        iconId: pendingData.iconId,
      });

      // Immediately trigger save with pending data
      (async () => {
        try {
          await saveInvitation({
            data: { ...pendingData, date: new Date(pendingData.date) },
            inviteId: props.inviteId,
            onSuccess: (result) => {
              toast.success(t(`${result.status}`));
              router.push(`/user/invites/edit/${result.id}`);
            },
          });
        } catch (error) {
          if (error instanceof Error) {
            let messageToDisplay = error.message;
            toast.error(t(messageToDisplay));
          }
          return;
        }
      })();
    }
  }, [pendingData, reset]);

  const onSubmit = async (data: InviteFormData) => {
    console.log(data);
    try {
      await saveInvitation({
        data,
        inviteId: props.inviteId,
        isAnonymous: session?.user.isAnonymous || undefined,
        onSuccess: (result) => {
          toast.success(t(result.status));
          if (result.status === "SUCCESS.INVITE.UPDATED") {
            router.push(`/user/invites/edit/${result.id}`);
          }
        },

        onAnonymous: () => {
          savePendingAction(data);
        },
      });
    } catch (error: any) {
      toast.error(t(error));
      return;
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
      } catch (err) {
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
  const rsvpRequired = watch("rsvpRequired");
  const isMaxGuestsCountEnabled = watch("isMaxGuestsCountEnabled");
  const isBabyCountEnabled = watch("isBabyCountEnabled");
  const maxGuestsNumber = watch("maxGuestsNumber");
  const maxGuestsBabyNumber = watch("maxGuestsBabyNumber");
  const iconId = watch("iconId");

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
        selectedIcon={iconId || ""}
        isSubmitting={isSubmitting}
        inviteId={props.inviteId}
        onBgColorChange={(color) =>
          setValue("bgColor", color, { shouldDirty: true })
        }
        onIconSelect={(id) => setValue("iconId", id, { shouldDirty: true })}
        onTextColorChange={(color) =>
          setValue("textColor", color, { shouldDirty: true })
        }
        onFontChange={(font) =>
          setValue("fontValue", font, { shouldDirty: true })
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
            iconId={iconId || ""}
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
            <p>Notes/Description</p>
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
