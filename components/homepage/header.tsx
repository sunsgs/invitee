import { Easing, motion } from "motion/react";
import SigninDialog from "../signin-dialog";

export default function HeaderHome() {
  const EASE: Easing = [0.88, -0.4, 0.18, 1];

  return (
    <header className="flex flex-col relative mx-4 my-4">
      <div className="flex justify-between items-center">
        <div className="logo pr-4 text-4xl flex items-center overflow-hidden">
          {"SMOOU".split("").map((char, index) => (
            <motion.span
              onClick={() => console.log("click")}
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 1,
                delay: 1.5 + index * 0.08,
                ease: EASE,
              }}
              key={index}
              className="cursor-pointer"
            >
              {char}
            </motion.span>
          ))}
        </div>
        <SigninDialog />
      </div>
    </header>
  );
}
