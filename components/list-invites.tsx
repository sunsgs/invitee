"use client";

import { InviteFormData } from "@/validation/schema";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner"; // or your toast library
import { InvitesEmptyState } from "./invite/invites-empty-state";
import { InviteCard } from "./list-invite-card";

interface ListInvitesProps {
  data: InviteFormData[];
}

export default function ListInvites({ data }: ListInvitesProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [optimisticInvites, setOptimisticInvites] = useOptimistic(
    data,
    (state, inviteId: string) => {
      return state.filter((invite) => invite.id !== inviteId);
    }
  );

  const handleDelete = async (inviteId: string, inviteName: string) => {
    startTransition(async () => {
      // Optimistically remove from UI immediately
      setOptimisticInvites(inviteId);

      try {
        const response = await fetch(`/api/invite?id=${inviteId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (!result.success) {
          toast.error(result.error || "Failed to delete invitation");
          // Optimistic update will revert automatically
          return;
        }

        toast.success(`"${inviteName}" deleted successfully`);

        // Refresh server data to sync with database state
        router.refresh();
      } catch (error) {
        toast.error("An error occurred while deleting");
        console.error("Error deleting invite:", error);
        // Optimistic update will revert automatically
      }
    });
  };

  if (optimisticInvites.length === 0) {
    return <InvitesEmptyState />;
  }

  return (
    <div className="space-y-4">
      {optimisticInvites.map((invite) => (
        <InviteCard key={invite.id} invite={invite} onDelete={handleDelete} />
      ))}
    </div>
  );
}
