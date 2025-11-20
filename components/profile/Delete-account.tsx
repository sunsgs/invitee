"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader2, TriangleAlert } from "lucide-react";
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
          </div>
        </DialogHeader>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
            <TriangleAlert aria-hidden="true" className="size-6 text-red-400" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <div className="mt-2">
              <p className="text-sm">
                Are you sure you want to delete your account? All of your data
                will be permanently removed. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 py-4">
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

        <DialogFooter className="gap-2">
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
