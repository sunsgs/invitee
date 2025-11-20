"use client";
import { authClient, signIn } from "@/lib/auth-client";
import { Easing, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { InvitationCard } from "../invitation-card";
import { Button } from "../ui/button";
import { invitationList } from "./invitation-cards";

export default function Hero() {
  const router = useRouter();

  const EASE: Easing = [0.88, -0.4, 0.18, 1];

  const invitations = invitationList;
  const totalCards = invitations.length;
  const centerIndex = Math.floor(totalCards / 2);
  const totalRotation = 35;
  const rotationInterval = totalRotation / (totalCards - 1);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: 0.9,
        duration: 0.9,
        ease: EASE,
      }}
      className="h-full z-1 bg-background p-4"
      onAnimationComplete={() =>
        document.body.classList.remove("overflow-hidden")
      }
    >
      <div className="w-full flex flex-col h-full justify-center  items-center text-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.5,
            delay: 1,
            ease: EASE,
          }}
          className="text-5xl md:text-6xl font-semibold mb-4 mt-5 tracking-tighter max-w-3xl"
        >
          Crea inviti troppo belli per essere ignorati.
        </motion.h1>
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.2, ease: EASE }}
          className="mt-8 tex-lg"
        >
          Scegli uno stile, lancia l’invito, scopri chi viene, chi no (e chi si
          pente).
        </motion.span>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 1.2, ease: EASE }}
        >
          <Button
            onClick={async () => {
              const { data: session } = await authClient.getSession();
              if (session) {
                router.push("/user/invites/create");
                return;
              }
              await signIn.anonymous();
              router.push("/user/invites/create");
            }}
            className="px-12 py-6 mt-4 shadow-xl text-xl border-b-4 bg-primary/90 border-primary"
          >
            Invita con stile
          </Button>
        </motion.div>
        <div className="w-full flex items-center pt-10">
          <div className="flex w-full justify-center relative min-h-[500]">
            {invitations.map((invitation, index) => {
              const position = index - centerIndex;
              const rotationAngle = -(position * rotationInterval);
              const zIndex = totalCards - Math.abs(position);
              const translateY = Math.abs(position) * 50;
              const translateX = position * -150;
              const isSideCard = position !== 0;
              const visibilityClass = ""; //isSideCard ? "hidden md:block" : "";
              const originClass =
                index === 0 ? "origin-bottom-right" : "origin-bottom-left";

              return (
                <motion.div
                  key={invitation.id}
                  initial={{
                    opacity: 0,
                    y: 0,
                    rotateZ: 0,
                    scale: isSideCard ? 0.85 : 1,
                    x: 0,
                  }}
                  animate={{
                    opacity: 1,
                    y: translateY,
                    rotateZ: rotationAngle,
                    x: translateX,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 2 + index * 0.1,
                    ease: EASE,
                  }}
                  className={`w-[400] ${visibilityClass} absolute ${originClass}`}
                  style={{
                    zIndex: zIndex,
                  }}
                >
                  <InvitationCard
                    emojiIntensity={1}
                    emoji={invitation.emoji}
                    bgColor={invitation.bgColor}
                    textColor={invitation.textColor}
                    fontValue={invitation.fontValue}
                    data={{
                      title: invitation.data.title,
                      name: invitation.data.name,
                      date: invitation.data.date,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
