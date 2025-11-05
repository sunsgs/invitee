"use client";

import { CreateInviteModal } from "@/components/create-invite-modal";
import { Button } from "@/components/ui/button";
import { InviteFormData } from "@/validation/schema";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = async (data: InviteFormData) => {
    // Send data to your API route or directly to Turso here.
    console.log("New invite data:", data);
    setModalOpen(false);
  };

  return (
    <div className="grid grid-cols-4">
      <Button
        onClick={() => setModalOpen(true)}
        variant="outline"
        className="flex items-center justify-center border-dashed h-50 w-full rounded-lg"
        aria-label="Create new invite"
      >
        <PlusCircle className="mr-2" />
        Create Invite
      </Button>
      <CreateInviteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
