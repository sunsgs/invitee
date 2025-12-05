"use client";
import { SessionProvider } from "@/providers/session-context";
import { Easing, motion } from "motion/react";
import { useEffect } from "react";
import FeatureSection from "./feature-section";
import HeaderHome from "./header";
import Hero from "./hero";

export default function HomePage() {
  const EASE: Easing = [0.88, -0.4, 0.18, 1];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <SessionProvider>
      <main className="flex flex-col overflow-x-hidden">
        <section id="intro" className="flex h-full absolute w-full z-0">
          <div className="logo text-8xl md:text-9xl items-center justify-center flex w-full">
            {"SMOOU".split("").map((char, index) => (
              <motion.span
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1,
                  delay: index * 0.08,
                  ease: EASE,
                }}
                key={index}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </section>
        <HeaderHome />
        <Hero />
        <FeatureSection />
      </main>
    </SessionProvider>
  );
}
