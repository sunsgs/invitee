"use client";
import { ConfirmationDialog } from "@/components/change-password-modal";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { RotateCcwKey, User } from "lucide-react";
import { useFormatter } from "next-intl";
import { useState } from "react";

export default function UserProfile() {
  const { data: session } = useSession();
  const format = useFormatter();

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <div>
      <h1>Account</h1>
      <div className="flex flex-col mt-6 gap-4 divide-accent divide-y">
        {/* User info */}
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Full name</div>
            <div>{session?.user.name}</div>
          </div>
          <div>
            <Button variant={"outline"}>
              <User /> Edit full name
            </Button>
          </div>
        </div>
        <div>
          <div className="font-medium">Email</div>
          <div>{session?.user.email}</div>
        </div>
        <div>
          <div className="font-medium">Joined at</div>
          <div>
            {format.dateTime(session?.user.createdAt || Date.now(), "long")}
          </div>
        </div>
        <div>
          <Button onClick={handleOpenDialog}>
            <RotateCcwKey /> Change password
          </Button>
        </div>
      </div>

      <ConfirmationDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
}
