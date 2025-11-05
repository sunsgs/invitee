"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);

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
    </div>
  );
}
