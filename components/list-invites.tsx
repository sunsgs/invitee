"use client";

import { InviteFormData } from "@/validation/schema";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { InviteCard } from "./list-invite-card";
import { Button } from "./ui/button";

interface ListInvitesProps {
  data: InviteFormData[];
}

const MAX_INVITES: number = Number(process.env.NEXT_PUBLIC_MAX_INVITES);

export default function ListInvites({ data }: ListInvitesProps) {
  const remainingSlots = MAX_INVITES - data.length;
  const canCreate = remainingSlots > 0;

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-end justify-between mb-3">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Invites
          </h1>
          <Button
            className="justify-center items-center flex"
            asChild={canCreate}
            disabled={!canCreate}
            size={"lg"}
          >
            <Link href="invites/create">
              <span className="text-lg leading-none">+</span>
              <span className="hidden sm:inline">Create invite</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {data.length} of {MAX_INVITES} invites
          </span>
          {remainingSlots > 0 && (
            <div>
              <span>-</span> <span>{remainingSlots} remaining</span>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No invites yet</h3>
          <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
            Create your first event invitation to get started
          </p>
          <Button asChild size="default" className="gap-2">
            <Link href="invites/create">
              <span className="text-lg leading-none">+</span>
              <span>Create Invite</span>
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((invite) => (
            <InviteCard key={invite.id} invite={invite} />
          ))}
        </div>
      )}
    </div>
  );
}
