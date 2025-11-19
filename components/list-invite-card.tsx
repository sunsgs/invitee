"use client";
import { isEventExpired } from "@/lib/utils";
import { InviteFormData } from "@/validation/schema";
import { BarChart3, Calendar, Pencil } from "lucide-react";
import { useFormatter } from "next-intl";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
interface InviteCardProps {
  invite: InviteFormData;
}

export function InviteCard({ invite }: InviteCardProps) {
  const isExpired = isEventExpired(invite.date, invite.startTime);
  const format = useFormatter();
  const formattedDate = format.dateTime(invite.date, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="p-0 gap-0 overflow-hidden  aspect-square">
      <CardContent className="flex-1 items-center justify-center flex flex-col ">
        <div className="flex gap-2">
          <h3 className="font-semibold truncate flex-1">{invite.name}</h3>
          {isExpired && (
            <Badge variant="secondary" className="text-xs">
              Past
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="w-4 h-4" />
          <span className="truncate">{formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <div className="flex flex-1 px-6 py-4 gap-2 border-t  bg-background">
          <Button asChild variant="outline" size="lg">
            <Link href={`invites/edit/${invite.id}`}>
              <Pencil /> Edit
            </Link>
          </Button>
          <Button size="lg">
            <BarChart3 /> Stats
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
