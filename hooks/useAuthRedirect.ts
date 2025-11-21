"use client";

import { InviteFormData } from "@/validation/schema";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "pending_invite";

export const useAuthRedirect = () => {
  const [openSignin, setOpenSignin] = useState(false);
  const [pendingData, setPendingData] = useState<InviteFormData | null>(null);
  const searchParams = useSearchParams();

  // Generate callback URL once
  const callbackURL =
    typeof window !== "undefined"
      ? `${window.location.pathname}?resume_action=true`
      : "";

  // Check for pending data on mount or when resume_action param appears
  useEffect(() => {
    if (searchParams.get("resume_action") === "true") {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const data = JSON.parse(stored) as InviteFormData;
          setPendingData(data);
          // sessionStorage.removeItem(STORAGE_KEY); // Clean up immediately
        } catch (error) {
          console.error("Failed to parse pending invite data:", error);
        }
      }
    }
  }, [searchParams]);

  const savePendingAction = (data: InviteFormData) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setOpenSignin(true);
  };

  return {
    callbackURL,
    openSignin,
    setOpenSignin,
    savePendingAction,
    pendingData,
  };
};
