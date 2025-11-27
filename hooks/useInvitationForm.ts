import {
  InvitationCardData,
  InviteFormData,
  inviteSchema,
} from "@/validation/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface UseInvitationFormProps {
  inviteId?: string;
  inviteBgColor?: string;
  inviteTextColor?: string;
  inviteFontValue?: string;
  inviteIconId?: string;
  data?: InvitationCardData;
  inviteRSVPRequired?: boolean;
  inviteIsMaxGuestsCountEnabled?: boolean;
  inviteIsBabyCountEnabled?: boolean;
  inviteMaxGuestsBabyNumber?: number;
  inviteMaxGuestsNumber?: number;
  inviteDescription?: string;
}

export const useInvitationForm = (props: UseInvitationFormProps) => {
  return useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      // Card data
      title: props.data?.title || "",
      name: props.data?.name || "",
      date: props.data?.date,
      startTime: props.data?.startTime || "",
      endTime: props.data?.endTime || "",
      location: props.data?.location || "",
      description: props.inviteDescription || "",

      // Design
      bgColor: props.inviteBgColor || "#fff",
      textColor: props.inviteTextColor || "#000",
      fontValue: props.inviteFontValue || "bagel",
      iconId: props.inviteIconId || "",

      // RSVP settings
      rsvpRequired: props.inviteRSVPRequired || false,
      isMaxGuestsCountEnabled: props.inviteIsMaxGuestsCountEnabled || false,
      isBabyCountEnabled: props.inviteIsBabyCountEnabled || false,
      maxGuestsNumber: props.inviteMaxGuestsNumber || 2,
      maxGuestsBabyNumber: props.inviteMaxGuestsBabyNumber || 1,
    },
  });
};
