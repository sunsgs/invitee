"use client";
import { useEffect, useMemo, useState } from "react";

interface EmojiBackgroundProps {
  emoji: string;
  bgColor: string;
  density: number;
  emojiCounts?: {
    background: number;
    foreground: number;
  };
}

interface EmojiItem {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  zIndex: "below" | "above";
}

function generateStablePoints(
  targetCount: number
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const minDistance = 100 / Math.sqrt(targetCount) + 2;

  const cellSize = minDistance / Math.sqrt(2);
  const gridWidth = Math.ceil(100 / cellSize);
  const gridHeight = Math.ceil(100 / cellSize);
  const grid: Array<Array<{ x: number; y: number } | null>> = Array(gridHeight)
    .fill(null)
    .map(() => Array(gridWidth).fill(null));

  const active: Array<{ x: number; y: number }> = [];

  const firstPoint = { x: 50, y: 50 };
  points.push(firstPoint);
  active.push(firstPoint);

  const gridX = Math.floor(firstPoint.x / cellSize);
  const gridY = Math.floor(firstPoint.y / cellSize);
  if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
    grid[gridY][gridX] = firstPoint;
  }

  let seed = 12345;
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (active.length > 0 && points.length < targetCount) {
    const idx = Math.floor(seededRandom() * active.length);
    const point = active[idx];
    let found = false;

    for (let i = 0; i < 30; i++) {
      const angle = seededRandom() * Math.PI * 2;
      const distance = minDistance + seededRandom() * minDistance;
      let newX = point.x + distance * Math.cos(angle);
      let newY = point.y + distance * Math.sin(angle);

      newX = ((newX % 100) + 100) % 100;
      newY = ((newY % 100) + 100) % 100;

      const gridX = Math.floor(newX / cellSize);
      const gridY = Math.floor(newY / cellSize);

      let valid = true;
      const searchRadius = 2;

      for (
        let gy = Math.max(0, gridY - searchRadius);
        gy < Math.min(gridHeight, gridY + searchRadius + 1);
        gy++
      ) {
        for (
          let gx = Math.max(0, gridX - searchRadius);
          gx < Math.min(gridWidth, gridX + searchRadius + 1);
          gx++
        ) {
          if (grid[gy][gx]) {
            const neighbor = grid[gy][gx];
            const dx = newX - neighbor!.x;
            const dy = newY - neighbor!.y;
            if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
              valid = false;
              break;
            }
          }
        }
        if (!valid) break;
      }

      if (valid) {
        const newPoint = { x: newX, y: newY };
        points.push(newPoint);
        active.push(newPoint);
        if (
          gridX >= 0 &&
          gridX < gridWidth &&
          gridY >= 0 &&
          gridY < gridHeight
        ) {
          grid[gridY][gridX] = newPoint;
        }
        found = true;
        break;
      }
    }

    if (!found) {
      active.splice(idx, 1);
    }
  }

  return points;
}

const STABLE_POINTS = generateStablePoints(60);

export function EmojiBackground({
  emoji,
  bgColor,
  density,
  emojiCounts,
}: EmojiBackgroundProps) {
  // Detect screen size for responsive behavior
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Responsive density configurations
  const densityConfig = {
    1: {
      background: { desktop: 14, tablet: 10, mobile: 6 },
      foreground: { desktop: 2, tablet: 2, mobile: 1 },
    },
    2: {
      background: { desktop: 20, tablet: 14, mobile: 8 },
      foreground: { desktop: 4, tablet: 3, mobile: 2 },
    },
    3: {
      background: { desktop: 30, tablet: 20, mobile: 12 },
      foreground: { desktop: 6, tablet: 4, mobile: 2 },
    },
    4: {
      background: { desktop: 50, tablet: 32, mobile: 16 },
      foreground: { desktop: 10, tablet: 6, mobile: 3 },
    },
  };

  const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
  const config =
    densityConfig[density as keyof typeof densityConfig] || densityConfig[2];

  const counts = emojiCounts || {
    background: config.background[deviceType],
    foreground: config.foreground[deviceType],
  };

  const emojis: EmojiItem[] = useMemo(() => {
    const items: EmojiItem[] = [];

    // Responsive size multipliers
    const sizeMultiplier = isMobile ? 0.65 : isTablet ? 0.85 : 1.0;
    const minDistanceMultiplier = isMobile ? 1.3 : isTablet ? 1.15 : 1.0;

    // BACKGROUND LAYER with responsive sizing
    const backgroundPoints = STABLE_POINTS.filter((point) => {
      const distFromCenter = Math.sqrt(
        Math.pow(point.x - 50, 2) + Math.pow(point.y - 50, 2)
      );
      // Larger exclusion zone on mobile for cleaner center
      const exclusionRadius = isMobile ? 25 : isTablet ? 22 : 18;
      return distFromCenter > exclusionRadius;
    });

    const selectedPoints = backgroundPoints.slice(0, counts.background);

    selectedPoints.forEach((point, idx) => {
      const baseSize = 16 + Math.random() * 24;
      items.push({
        id: idx,
        x: point.x,
        y: point.y,
        size: baseSize * sizeMultiplier,
        rotation: Math.random() * 360,
        opacity: isMobile
          ? 0.2 + Math.random() * 0.2
          : 0.25 + Math.random() * 0.25,
        zIndex: "below",
      });
    });

    // FOREGROUND LAYER - Responsive positioning and sizing
    const allPositions = [
      // TIER 1: Minimal (2) - optimized for mobile
      { x: 30, y: 42, size: 38, rotation: -12, tier: 1 },
      { x: 70, y: 42, size: 38, rotation: 12, tier: 1 },

      // TIER 2: Balanced (4)
      { x: 45, y: 26, size: 36, rotation: -8, tier: 2 },
      { x: 55, y: 58, size: 36, rotation: 10, tier: 2 },

      // TIER 3: Rich (6)
      { x: 18, y: 36, size: 34, rotation: 15, tier: 3 },
      { x: 82, y: 36, size: 34, rotation: -14, tier: 3 },

      // TIER 4: Maximum (10)
      { x: 28, y: 28, size: 32, rotation: -10, tier: 4 },
      { x: 50, y: 24, size: 34, rotation: 8, tier: 4 },
      { x: 72, y: 28, size: 32, rotation: 14, tier: 4 },
      { x: 15, y: 38, size: 30, rotation: 12, tier: 4 },
      { x: 85, y: 38, size: 30, rotation: -12, tier: 4 },
      { x: 35, y: 46, size: 30, rotation: -8, tier: 4 },
      { x: 65, y: 46, size: 30, rotation: 10, tier: 4 },
      { x: 25, y: 54, size: 32, rotation: 6, tier: 4 },
      { x: 50, y: 58, size: 34, rotation: -6, tier: 4 },
      { x: 75, y: 54, size: 32, rotation: 12, tier: 4 },
    ];

    const selectedPositions = allPositions
      .filter((p) => p.tier <= Math.ceil(counts.foreground / 2.5))
      .sort((a, b) => {
        if (a.tier !== b.tier) return a.tier - b.tier;
        return a.y - b.y;
      })
      .slice(0, counts.foreground);

    // Collision detection with responsive minimum distance
    const minDistancePx = isMobile ? 16 : isTablet ? 14 : 12;

    const verifyNoOverlap = (
      newPos: (typeof allPositions)[0],
      existing: typeof selectedPositions
    ): boolean => {
      return !existing.some((pos) => {
        const dx = newPos.x - pos.x;
        const dy = newPos.y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistancePx * minDistanceMultiplier;
      });
    };

    const finalPositions: typeof allPositions = [];
    selectedPositions.forEach((pos) => {
      if (verifyNoOverlap(pos, finalPositions)) {
        finalPositions.push(pos);
      }
    });

    if (finalPositions.length < counts.foreground) {
      const tier2Positions = allPositions.filter(
        (p) => p.tier === 2 && !finalPositions.includes(p)
      );
      for (const pos of tier2Positions) {
        if (finalPositions.length >= counts.foreground) break;
        if (verifyNoOverlap(pos, finalPositions)) {
          finalPositions.push(pos);
        }
      }
    }

    // Apply responsive sizing to foreground emojis
    finalPositions.forEach((pos, idx) => {
      items.push({
        id: 200 + idx,
        x: pos.x,
        y: pos.y,
        size: pos.size * sizeMultiplier,
        rotation: pos.rotation,
        opacity: 1.0,
        zIndex: "above",
      });
    });

    return items;
  }, [counts, isMobile, isTablet]);

  const backgroundEmojis = useMemo(
    () => emojis.filter((e) => e.zIndex === "below"),
    [emojis]
  );

  const foregroundEmojis = useMemo(
    () => emojis.filter((e) => e.zIndex === "above"),
    [emojis]
  );

  return (
    <>
      {/* Background layer */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {backgroundEmojis.map((item) => (
          <div
            key={item.id}
            className="absolute pointer-events-none select-none"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              fontSize: `${item.size}px`,
              opacity: item.opacity,
              filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.08))`,
              userSelect: "none",
            }}
            aria-hidden="true"
          >
            {emoji}
          </div>
        ))}

        {/* Radial gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              ellipse 62% 52% at center,
              rgba(255, 255, 255, 0.02) 0%,
              rgba(0, 0, 0, 0.01) 40%,
              rgba(0, 0, 0, 0.04) 100%
            )`,
          }}
        />
      </div>

      {/* Foreground layer */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 30 }}
      >
        {foregroundEmojis.map((item) => (
          <div
            key={item.id}
            className="absolute pointer-events-none select-none"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              fontSize: `${item.size}px`,
              opacity: item.opacity,
              filter: `drop-shadow(0 2px 8px rgba(0,0,0,0.2))`,
              userSelect: "none",
              transformOrigin: "center center",
              mixBlendMode: "lighten",
            }}
            aria-hidden="true"
          >
            {emoji}
          </div>
        ))}
      </div>
    </>
  );
}

// Demo component
export default function Demo() {
  return (
    <div className="relative w-full h-screen">
      <EmojiBackground emoji="🎉" bgColor="#fef3c7" density={2} />
      <div className="relative z-40 flex items-center justify-center h-full">
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            You're Invited!
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Resize window to see responsive behavior
          </p>
        </div>
      </div>
    </div>
  );
}
