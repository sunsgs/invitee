"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface DeleteAccountDialogProps {
  session: any; // Replace with your session type
}

export default function DeleteAccountDialog({
  session,
}: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const CONFIRM_PHRASE = process.env.NEXT_PUBLIC_CONFIRM_PHRASE;
  const isConfirmValid = confirmText === CONFIRM_PHRASE;

  const handleDelete = async () => {
    if (!isConfirmValid) return;

    startTransition(async () => {
      try {
        // Call better-auth delete account endpoint
        const response = await authClient.deleteUser();

        if (response.error) {
          toast.error("Failed to delete account", {
            description: response.error.message || "Please try again later",
          });
          return;
        }

        // Success
        toast.success("Account deleted", {
          description: "Your account has been permanently deleted",
        });

        // Close dialog and redirect
        setOpen(false);

        // Sign out and redirect to home
        await authClient.signOut();
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error("Delete account error:", error);
        toast.error("Something went wrong", {
          description: "Unable to delete your account. Please contact support.",
        });
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isPending) {
      setOpen(newOpen);
      // Reset state when closing
      if (!newOpen) {
        setConfirmText("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl">Delete Account</DialogTitle>
            <DialogDescription className="text-sm mt-1">
              This action is permanent and cannot be undone
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Warning:</strong> Deleting your account will:
              <ul className="mt-2 ml-4 list-disc space-y-1 text-xs">
                <li>Permanently delete all your data</li>
                <li>Remove all your content and settings</li>
                <li>Cancel any active subscriptions</li>
                <li>This action cannot be reversed</li>
              </ul>
            </AlertDescription>
          </Alert>

          {session?.user?.email && (
            <div className="rounded-lg bg-muted p-3 space-y-1">
              <p className="text-sm font-medium">Account to be deleted:</p>
              <p className="text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="confirm-delete" className="text-sm font-medium">
              Type <span className="font-mono font-bold">{CONFIRM_PHRASE}</span>{" "}
              to confirm
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type ${CONFIRM_PHRASE}`}
              disabled={isPending}
              className="font-mono"
              autoComplete="off"
              onPaste={(e) => e.preventDefault()} // Prevent paste
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmValid || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete My Account"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
