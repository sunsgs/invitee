// components/invites-empty-state.tsx
import { Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function InvitesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Calendar className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No invites yet</h3>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
        Create your first event invitation to get started
      </p>
      <Link href="invites/create">
        <Button variant={"outline"} className="gap-2">
          <span className="text-lg leading-none">+</span>
          <span>Create Invite</span>
        </Button>
      </Link>
    </div>
  );
}
