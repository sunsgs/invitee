"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isEventExpired } from "@/lib/utils";
import { InviteFormData } from "@/validation/schema";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { InviteCard } from "./list-invite-card";

interface ListInvitesProps {
  data: InviteFormData[];
}

const MAX_INVITES = 4;

const EmptyState = ({
  variant,
  onCreateInvite,
}: {
  variant: "upcoming" | "expired";
  onCreateInvite?: () => void;
}) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
      <Calendar className="w-12 h-12 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-semibold mb-2">
      {variant === "expired" ? "No past events" : "No upcoming events"}
    </h3>
    <p className="text-muted-foreground mb-6">
      {variant === "expired"
        ? "Past events will appear here once they've concluded"
        : "Create your first invite to get started"}
    </p>
    {variant === "upcoming" && onCreateInvite && (
      <Button onClick={onCreateInvite}>Create invite</Button>
    )}
  </div>
);

export default function ListInvites({ data }: ListInvitesProps) {
  // Compute filtered data based on event status
  const { upcomingInvites, expiredInvites } = useMemo(() => {
    const upcoming = data.filter(
      (invite) => !isEventExpired(invite.date, invite.startTime)
    );
    const expired = data.filter((invite) =>
      isEventExpired(invite.date, invite.startTime)
    );

    return {
      upcomingInvites: upcoming,
      expiredInvites: expired,
    };
  }, [data]);

  const remainingSlots = MAX_INVITES - data.length;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Invites</h1>
        <p className="text-muted-foreground">
          You've created {data.length} of {MAX_INVITES} invites ·{" "}
          {upcomingInvites.length} upcoming
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="all" className="gap-2">
            All invites
            <Badge variant="secondary" className="ml-1">
              {data.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            Upcoming
            <Badge variant="secondary" className="ml-1">
              {upcomingInvites.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="expired" className="gap-2">
            Past events
            <Badge variant="secondary" className="ml-1">
              {expiredInvites.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* All Invites Tab */}
        <TabsContent value="all" className="mt-0">
          {data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {remainingSlots > 0 && (
                <Link href="invites/create">
                  <Card className="border-2 border-dashed transition-colors hover:border-primary cursor-pointer flex items-center justify-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Create new invite</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {remainingSlots} {remainingSlots === 1 ? "slot" : "slots"}{" "}
                      remaining
                    </p>
                  </Card>
                </Link>
              )}
              {data.map((invite) => (
                <InviteCard key={invite.id} invite={invite} />
              ))}
            </div>
          ) : (
            <EmptyState variant="upcoming" />
          )}
        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="mt-0">
          {upcomingInvites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingInvites.map((invite) => (
                <InviteCard key={invite.id} invite={invite} />
              ))}
            </div>
          ) : (
            <EmptyState variant="upcoming" />
          )}
        </TabsContent>

        {/* Past Events Tab */}
        <TabsContent value="expired" className="mt-0">
          {expiredInvites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expiredInvites.map((invite) => (
                <InviteCard key={invite.id} invite={invite} />
              ))}
            </div>
          ) : (
            <EmptyState variant="expired" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
