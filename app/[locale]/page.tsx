"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    confetti();
  }, []);

  return (
    <button
      onClick={() => {
        confetti();
      }}
    >
      click for confetti
    </button>
  );
}
