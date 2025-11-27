"use client";
import { Easing, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { InvitationCard } from "../invitation-card";
import CTAhero from "./cta";

export default function Hero() {
  const t = useTranslations("HOMEPAGE");

  const invitations = [
    {
      id: 1,
      iconId: "jackolantern",
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
      iconId: "christmastree",
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
      iconId: "partypopper",
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

  const EASE: Easing = [0.88, -0.4, 0.18, 1];
  const totalCards = invitations.length;
  const centerIndex = Math.floor(totalCards / 2);
  const totalRotation = 35;
  const rotationInterval = totalRotation / (totalCards - 1);

  return (
    <>
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
        <div className="w-full flex flex-col h-full justify-center items-center text-center md:max-w-3xl mx-auto">
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
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.2, ease: EASE }}
            className="text-lg"
          >
            {t("HERO.SUBTITLE")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 1.2, ease: EASE }}
            className="mt-2"
          >
            <CTAhero />
          </motion.div>
          <div className="w-full flex items-center">
            <div className="flex w-full justify-center relative min-h-[400] md:min-h-[500] scale-85 md:scale-90 lg:scale-100 mt-2 md:mt-4 lg:mt-8 xl:mt-16">
              {invitations.map((invitation, index) => {
                const position = index - centerIndex;
                const rotationAngle = -(position * rotationInterval);
                const zIndex = totalCards - Math.abs(position);
                const translateY = Math.abs(position) * 20;
                const translateX = position * -100;
                const isSideCard = position !== 0;
                const visibilityClass = "";
                const originClass =
                  index === 0 ? "origin-bottom-right" : "origin-bottom-left";

                return (
                  <motion.div
                    key={invitation.id}
                    initial={{
                      opacity: 0,
                      y: 0,
                      rotateZ: 0,
                      scale: isSideCard ? 0.8 : 1,
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
                      iconId={invitation.iconId}
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
    </>
  );
}
