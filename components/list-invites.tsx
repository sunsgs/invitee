"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn, isEventExpired } from "@/lib/utils";
import { InviteFormData } from "@/validation/schema";
import { BarChart3, Calendar, Clock, Edit2 } from "lucide-react";
import { useFormatter } from "next-intl";
import Link from "next/link";
import { Badge } from "./ui/badge";
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
          <Button asChild={canCreate} disabled={!canCreate} size={"lg"}>
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
            <>
              <span>•</span>
              <span>{remainingSlots} remaining</span>
            </>
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
        <div className="space-y-2">
          {data.map((invite) => (
            <InviteCard key={invite.id} invite={invite} />
          ))}
        </div>
      )}
    </div>
  );
}

interface InviteCardProps {
  invite: InviteFormData;
}

function InviteCard({ invite }: InviteCardProps) {
  const format = useFormatter();
  const isExpired = isEventExpired(invite.date, invite.startTime);

  const formattedTime = invite.startTime
    ? format.dateTime(new Date(`2000-01-01T${invite.startTime}`), {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <Card className="group p-0">
      <CardContent className="p-0">
        <div className="flex items-center gap-4 py-4 px-5">
          {/* Left: Date Badge */}
          <div
            className={cn(
              "flex flex-col items-center justify-center shrink-0 w-14 h-14 rounded-xl",
              isExpired
                ? "bg-muted text-muted-foreground"
                : "bg-primary/10 text-primary"
            )}
          >
            <span className="text-[10px] uppercase font-semibold tracking-wider opacity-75 leading-none">
              {format.dateTime(invite.date, { month: "short" })}
            </span>
            <span className="text-2xl font-bold leading-none mt-1">
              {format.dateTime(invite.date, { day: "numeric" })}
            </span>
          </div>

          {/* Middle: Event Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base truncate">
                {invite.name}
              </h3>
              {isExpired && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 h-5"
                >
                  Past
                </Badge>
              )}
            </div>
            {formattedTime && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{formattedTime}</span>
              </div>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="hidden sm:flex items-center gap-2 ">
            <Button asChild>
              <Link href={`invites/${invite.id}/stats`}>
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Stats</span>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`invites/edit/${invite.id}`}>
                <Edit2 className="h-4 w-4" />
                <span className="text-sm">Edit</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile: Bottom Actions Bar */}
        <div className="sm:hidden flex border-t bg-muted/30">
          <Link
            href={`invites/${invite.id}/stats`}
            className="flex-1 flex items-center justify-center gap-2 py-6 hover:bg-accent transition-colors"
          >
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Stats</span>
          </Link>
          <div className="w-px bg-border" />
          <Link
            href={`invites/edit/${invite.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-6 hover:bg-accent transition-colors"
          >
            <Edit2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Edit</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
