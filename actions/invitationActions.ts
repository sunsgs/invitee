import { InviteFormData, inviteSchema } from "@/validation/schema";
import { toast } from "sonner";

interface SaveInvitationParams {
  data: InviteFormData;
  inviteId?: string;
  isAnonymous?: boolean;
  onSuccess?: (inviteId?: string) => void;
  onAnonymous?: () => void;
}

export const saveInvitation = async ({
  data,
  inviteId,
  isAnonymous,
  onSuccess,
  onAnonymous,
}: SaveInvitationParams) => {
  try {
    const payload = inviteId ? { ...data, id: inviteId } : { ...data };

    const validation = inviteSchema.safeParse(payload);
    if (!validation.success) {
      console.error("Validation failed:", validation.error);
      throw new Error("Please check your form fields");
    }

    if (isAnonymous) {
      onAnonymous?.();
      return;
    }

    const method = inviteId ? "PATCH" : "POST";
    const endpoint = "/api/invite";

    const response = await fetch(endpoint, {
      method,
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Something went wrong");
    }

    const result = await response.json();

    if (inviteId) {
      toast.success("Invite updated successfully");
    } else {
      toast.success("Invite created successfully");
    }

    onSuccess?.(inviteId);
    return result;
  } catch (error) {
    console.error("Error saving invitation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    toast.error("Failed to save invitation");
    throw new Error(errorMessage);
  }
};
