import { useMemo } from "react";

const emojis = ["🎉", "🎈", "✨", "🎂", "🥳"];

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function EmojiCloud() {
  const emojiStyles = useMemo(() => {
    return emojis.map(() => ({
      top: `${getRandom(0, 80)}%`, // avoid touching top/bottom edges
      left: `${getRandom(0, 90)}%`, // avoid touching side edges
      fontSize: `${getRandom(28, 72)}px`,
      opacity: getRandom(0.5, 0.92),
      rotate: `${getRandom(-30, 30)}deg`,
    }));
  }, []);

  return (
    <div
      className="relative w-full h-56 mt-6 select-none"
      aria-label="Emoji cloud"
    >
      {emojis.map((emoji, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: emojiStyles[i].top,
            left: emojiStyles[i].left,
            fontSize: emojiStyles[i].fontSize,
            opacity: emojiStyles[i].opacity,
            transform: `translate(-50%, -50%) rotate(${emojiStyles[i].rotate})`,
            pointerEvents: "none",
            userSelect: "none",
          }}
          aria-hidden="true"
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
