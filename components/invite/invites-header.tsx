// components/invites-header.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface InvitesHeaderProps {
  count: number;
  maxInvites: number;
  canCreate: boolean;
}

export function InvitesHeader({
  count,
  maxInvites,
  canCreate,
}: InvitesHeaderProps) {
  const remainingSlots = maxInvites - count;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <h2 className="m-0">Invites</h2>
        <Button
          className="justify-center items-center flex "
          disabled={!canCreate}
          size={"lg"}
        >
          <Link href="invites/create" className="flex items-center gap-2">
            <span className="text-lg leading-none">+</span>
            <span className="hidden sm:inline">Create invite</span>
          </Link>
        </Button>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          {count} of {maxInvites} invites
        </span>
        {remainingSlots > 0 && (
          <div>
            <span>-</span> <span>{remainingSlots} remaining</span>
          </div>
        )}
      </div>
    </div>
  );
}
