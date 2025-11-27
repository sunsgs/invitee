import { InviteFormData, inviteSchema } from "@/validation/schema";

interface SaveInvitationParams {
  data: InviteFormData;
  inviteId?: string;
  isAnonymous?: boolean;
  onSuccess?: (result: any) => void;
  onAnonymous?: () => void;
}

export const saveInvitation = async ({
  data,
  inviteId,
  isAnonymous,
  onSuccess,
  onAnonymous,
}: SaveInvitationParams) => {
  const payload = {
    ...data,
    ...(inviteId && { id: inviteId }),
  };

  const validation = inviteSchema.safeParse(payload);
  if (!validation.success) {
    console.error("Validation failed:", validation.error);
    throw new Error("Validation failed: Please check your form fields");
  }
  if (isAnonymous) {
    onAnonymous?.();
    return { status: "ANONYMOUS" };
  }

  const method = inviteId ? "PATCH" : "POST";
  const endpoint = "/api/invite";

  const response = await fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validation.data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const userMessage = errorData.error || "GENERIC_MESSAGE";
    throw new Error(userMessage);
  }

  const result = await response.json();
  onSuccess?.({
    ...result,
    status: inviteId ? "SUCCESS.INVITE.UPDATED" : "SUCCESS.INVITE.CREATED",
  });

  return;
};

export async function deleteAction(inviteId: string) {
  console.log(inviteId);
  const endpoint = `/api/invite?id=${inviteId}`;
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();
  return result;
}
