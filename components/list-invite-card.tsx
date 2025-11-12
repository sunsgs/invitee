"use client";
import { isEventExpired } from "@/lib/utils";
import { InviteFormData } from "@/validation/schema";
import { BarChart3, Calendar, Edit, Users } from "lucide-react";
import { useFormatter } from "next-intl";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
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
    <Card
      className={`group hover:shadow-lg transition-all duration-200 ${
        isExpired ? "opacity-75" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold truncate flex-1">{invite.name}</h3>
          {isExpired && (
            <Badge variant="secondary" className="text-xs">
              Past
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="truncate">{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4 " />
          <span>24 responses of 50</span>
        </div>
      </CardContent>

      <CardFooter className="border-t flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <BarChart3 className="w-4 h-4 mr-2" />
          Responses
        </Button>
      </CardFooter>
    </Card>
  );
}
