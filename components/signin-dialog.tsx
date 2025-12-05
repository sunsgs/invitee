"use client";

import { signIn, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Easing, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LogoLoader from "./loader/Logo-loader";
import { Button } from "./ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface SignInDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  callbackURL?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  showTrigger?: boolean;
}

export default function SignInDialog({
  open,
  onOpenChange,
  callbackURL = "/user/invites",
  onSuccess,
  onCancel,
  showTrigger = true,
}: SignInDialogProps) {
  const EASE: Easing = [0.88, -0.4, 0.18, 1];
  const [loading, setLoading] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const { data: session } = useSession();

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !loading) {
      onCancel?.();
    }
    setIsOpen(newOpen);
  };

  // Handle button click - check session first
  const handleButtonClick = () => {
    if (session) {
      router.push(callbackURL);
      onSuccess?.();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.5,
        delay: showTrigger ? 1 : 0,
        ease: EASE,
      }}
    >
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {showTrigger && (
          <DialogTrigger asChild>
            <Button
              className="px-8 py-4 border-b-4 button-rounded"
              variant="outline"
              onClick={(e) => {
                if (session) {
                  e.preventDefault(); // Prevent dialog from opening
                  handleButtonClick();
                }
              }}
            >
              {t("COMMON.LOGIN")}
            </Button>
          </DialogTrigger>
        )}

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center mb-6 flex justify-center items-center gap-1">
              <span className="text-sm">Sign in to continue</span>
            </DialogTitle>
          </DialogHeader>
          <div className="w-full gap-2 flex items-center justify-between flex-col">
            {loading ? (
              <LogoLoader />
            ) : (
              <>
                <Button
                  variant="outline"
                  className={cn("w-full gap-2")}
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await signIn.social(
                        {
                          provider: "google",
                          callbackURL,
                        },
                        {
                          onSuccess: () => {
                            onSuccess?.();
                          },
                          onRequest: () => {
                            setLoading(true);
                          },
                          onError: () => {
                            setLoading(false);
                          },
                        }
                      );
                    } catch (error) {
                      console.error("Sign in error:", error);
                      setLoading(false);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faGoogle} size="lg" />
                  Sign in with Google
                </Button>

                {/* <Button
                  variant="outline"
                  className={cn("w-full gap-2")}
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await signIn.social(
                        {
                          provider: "facebook",
                          callbackURL,
                        },
                        {
                          onRequest: () => {
                            setLoading(true);
                          },
                          onSuccess: () => {
                            setLoading(false);
                          },
                          onError: () => {
                            setLoading(false);
                          },
                        }
                      );
                    } catch (error) {
                      console.error("Sign in error:", error);
                      setLoading(false);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faFacebook} size="lg" />
                  Sign in with Facebook
                </Button> */}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
