"use client";
import { authClient, signIn } from "@/lib/auth-client";
import { Easing, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { InvitationCard } from "../invitation-card";
import { Button } from "../ui/button";

export default function Hero() {
  const t = useTranslations("HOMEPAGE");

  const invitations = [
    {
      id: 1,
      emoji: "🎃",
      bgColor: "#2d1b00",
      textColor: "#ff8c00",
      fontValue: "poppins",
      data: {
        location: t("CARDS.1.LOCATION"),
        name: t("CARDS.1.NAME"),
        date: new Date("October 31, 2025"),
        startTime: "8:00 PM",
        endTime: "1:00 AM",
      },
    },
    {
      id: 2,
      emoji: "🎄",
      bgColor: "#1a4d2e",
      textColor: "#ffffff",
      fontValue: "playfair",
      data: {
        location: t("CARDS.2.LOCATION"),
        name: t("CARDS.2.NAME"),
        date: new Date("December 25, 2025"),
        startTime: "7:00 PM",
        endTime: "11:00 PM",
      },
    },
    {
      id: 3,
      emoji: "🎉",
      bgColor: "#4a00e0",
      textColor: "#ffffff",
      fontValue: "fredoka",
      data: {
        location: t("CARDS.3.LOCATION"),
        name: t("CARDS.3.NAME"),
        date: new Date("December 31, 2025"),
        startTime: "9:00 PM",
        endTime: "2:00 AM",
      },
    },
  ];
  const router = useRouter();

  const EASE: Easing = [0.88, -0.4, 0.18, 1];
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
      <div className="w-full flex flex-col h-full justify-center  items-center text-center md:max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.5,
            delay: 1,
            ease: EASE,
          }}
          className="mt-4"
        >
          {t("HERO.TITLE")}
        </motion.h1>
        <motion.h3
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.2, ease: EASE }}
        >
          {t("HERO.SUBTITLE")}
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 1.2, ease: EASE }}
          className="mt-2"
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
            className="shadow-xl bg-primary/90 hover:bg-primary/80 px-12 py-6 border-b-4 border-primary font-medium text-lg"
          >
            {t("HERO.CTA")}
          </Button>
        </motion.div>
        <div className="w-full flex items-center">
          <div className="flex w-full justify-center relative min-h-[400] md:min-h-[500] scale-85 md:scale-90 lg:scale-100 mt-2 md:mt-4 lg:mt-8 xl:mt-16">
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
