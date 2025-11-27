"use client";

import { cn, isEventExpired } from "@/lib/utils";
import { InviteFormData } from "@/validation/schema";
import { BarChart3, Clock, Edit2, Trash2 } from "lucide-react";
import { useFormatter } from "next-intl";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface InviteCardProps {
  invite: InviteFormData;
  onDelete: (inviteId: string, inviteName: string) => Promise<void>;
}

export function InviteCard({ invite, onDelete }: InviteCardProps) {
  const format = useFormatter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isExpired = isEventExpired(invite.date, invite.startTime);

  const formattedStartTime = invite.startTime
    ? format.dateTime(new Date(`2000-01-01T${invite.startTime}`), {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  const formattedEndTime = invite.endTime
    ? format.dateTime(new Date(`2000-01-01T${invite.endTime}`), {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  let formattedTime = null;

  if (formattedStartTime && formattedEndTime) {
    formattedTime = `${formattedStartTime} - ${formattedEndTime}`;
  } else if (formattedStartTime) {
    formattedTime = formattedStartTime;
  }

  const handleDelete = () => {
    startTransition(async () => {
      await onDelete(invite.id || "", invite.name);
      setShowDeleteDialog(false);
    });
  };

  return (
    <>
      <Card className="group p-0">
        <CardContent className="p-0">
          <div className="flex items-center gap-6 py-4 px-5">
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
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost">
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isPending}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
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
            <div className="w-px bg-border" />
            <Button
              onClick={() => setShowDeleteDialog(true)}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-6 hover:bg-accent transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                Delete
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invitation?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{invite.name}"? This action
              cannot be undone and all associated RSVPs will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {" "}
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
