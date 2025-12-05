"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

import { InvitationCard } from "@/components/invitation-card";
import { Field } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { InvitationCardData, InviteFormData } from "@/validation/schema";

import { saveInvitation } from "@/actions/invitationActions";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useInvitationForm } from "@/hooks/useInvitationForm";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { InvitationSettings } from "./invite/InvitationSettings";
import { InvitationToolbar } from "./invite/InvitationToolbar";
import SignInDialog from "./signin-dialog";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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

  const [isShareDialogOpen, setIsShareDialogOpen] = useState<boolean>(false);

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
    try {
      await saveInvitation({
        data,
        inviteId: props.inviteId,
        isAnonymous: session?.user.isAnonymous || undefined,
        onSuccess: (result) => {
          toast.success(t(result.status));
          if (result.status === "SUCCESS.INVITE.CREATED") {
            router.push(`/user/invites/edit/${result.id}`);
          }
        },

        onAnonymous: () => {
          savePendingAction(data);
        },
      });
    } catch (error: any) {
      console.log(error);
      toast.error(t(error));
      return;
    }
  };

  const handleShare = async () => {
    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: `${props.data?.name} - ${t("PRIVATE.INVITE.SHARE")}}`,
          text: t("PRIVATE.INVITE.SHARE"),
          url: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${props.inviteId}`,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      setIsShareDialogOpen(true);
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

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("PRIVATE.INVITE.SHARE-DIALOG-TITLE")}</DialogTitle>
            <DialogDescription>
              {t("PRIVATE.INVITE.SHARE-DIALOG-COPY")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue={`${process.env.NEXT_PUBLIC_APP_URL}/invite/${props.inviteId}`}
                readOnly
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                className="button-rounded"
                type="button"
                variant="secondary"
              >
                {t("PRIVATE.INVITE.SHARE-DIALOG-CLOSE")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full mb-10">
        <div>
          <Link href="/user/invites">
            <Button
              className="button-rounded"
              variant="outline"
              size={"icon-lg"}
            >
              <ArrowLeft />
            </Button>
          </Link>
        </div>
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
            <p>{t("PRIVATE.INVITE.BUILDER.NOTES")}</p>
            <Textarea
              className="bg-card rounded-2xl p-4 focus:outline-none focus-visible:border-foreground focus-visible:ring-[0]"
              id="description"
              {...register("description")}
              placeholder={t("PRIVATE.INVITE.BUILDER.NOTES")}
            />
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
