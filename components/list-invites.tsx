// components/list-invites.tsx
"use client";
import { InviteFormData } from "@/validation/schema";
import { InvitesEmptyState } from "./invite/invites-empty-state";
import { InviteCard } from "./list-invite-card";

interface ListInvitesProps {
  data: InviteFormData[];
}

export default function ListInvites({ data }: ListInvitesProps) {
  if (data.length === 0) {
    return <InvitesEmptyState />;
  }

  return (
    <div className="space-y-4">
      {data.map((invite) => (
        <InviteCard key={invite.id} invite={invite} />
      ))}
    </div>
  );
}
