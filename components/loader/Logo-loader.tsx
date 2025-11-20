import { motion, Variants } from "motion/react";

export default function LogoLoader() {
  const dotVariants: Variants = {
    jump: {
      y: -8,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      animate="jump"
      transition={{
        staggerChildren: -0.2,
        staggerDirection: -1,
      }}
      className="flex justify-center items-center logo text-4xl"
    >
      {"SMOOU".split("").map((char, index) => (
        <motion.div variants={dotVariants} key={index}>
          {char}
        </motion.div>
      ))}
    </motion.div>
  );
}
