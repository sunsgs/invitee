"use client";
import { authClient, signIn } from "@/lib/auth-client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";

export default function CTAhero() {
  const t = useTranslations("HOMEPAGE");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleGetStarted = async () => {
    try {
      setIsLoading(true);

      const { data: session } = await authClient.getSession();

      if (session) {
        startTransition(() => {
          router.push("/user/invites/create");
        });
        return;
      }

      await signIn.anonymous({
        fetchOptions: {
          onRequest: () => {
            console.log("Authenticating...");
          },
        },
      });

      startTransition(() => {
        router.push("/user/invites/create");
      });
    } catch (error) {
      console.error("Authentication error:", error);
      setIsLoading(false);
    }
  };

  const isProcessing = isLoading || isPending;

  return (
    <Button
      onClick={handleGetStarted}
      disabled={isProcessing}
      className="shadow-xl mt-4 bg-primary/90 hover:bg-primary/80 px-12 py-6 border-b-4 border-primary font-medium text-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
    >
      {isProcessing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <motion.div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                className="w-2 h-2 bg-current rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      ) : (
        t("HERO.CTA")
      )}
    </Button>
  );
}
