"use client";
import { memo, useEffect, useMemo, useState } from "react";

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

// Seeded random for consistent selection
function seededSelect(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Select evenly distributed points from all quadrants
function selectBalancedPoints(
  points: Array<{ x: number; y: number }>,
  count: number,
  exclusionRadius: number
): Array<{ x: number; y: number }> {
  // Filter out center points
  const validPoints = points.filter((point) => {
    const distFromCenter = Math.sqrt(
      Math.pow(point.x - 50, 2) + Math.pow(point.y - 50, 2)
    );
    return distFromCenter > exclusionRadius;
  });

  // Divide into quadrants
  const quadrants = {
    topLeft: validPoints.filter((p) => p.x < 50 && p.y < 50),
    topRight: validPoints.filter((p) => p.x >= 50 && p.y < 50),
    bottomLeft: validPoints.filter((p) => p.x < 50 && p.y >= 50),
    bottomRight: validPoints.filter((p) => p.x >= 50 && p.y >= 50),
  };

  const selected: Array<{ x: number; y: number }> = [];
  const quadrantOrder = [
    "topLeft",
    "topRight",
    "bottomRight",
    "bottomLeft",
  ] as const;

  // Round-robin selection from each quadrant
  let quadrantIdx = 0;
  let passCount = 0;

  while (selected.length < count && passCount < count * 2) {
    const quadrantName = quadrantOrder[quadrantIdx % 4];
    const quadrant = quadrants[quadrantName];

    // Find next available point in this quadrant
    const available = quadrant.filter((p) => !selected.includes(p));

    if (available.length > 0) {
      // Use seeded random to pick from available points
      const pickIdx = Math.floor(
        seededSelect(selected.length * 17 + quadrantIdx) * available.length
      );
      selected.push(available[pickIdx]);
    }

    quadrantIdx++;
    passCount++;
  }

  return selected;
}

function EmojiBackgroundComponent({
  emoji,
  bgColor,
  density,
  emojiCounts,
}: EmojiBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

    const sizeMultiplier = isMobile ? 0.65 : isTablet ? 0.85 : 1.0;
    const exclusionRadius = isMobile ? 25 : isTablet ? 22 : 18;

    // Use balanced selection instead of simple slice
    const selectedPoints = selectBalancedPoints(
      STABLE_POINTS,
      counts.background,
      exclusionRadius
    );

    selectedPoints.forEach((point, idx) => {
      // Use seeded random for consistent size/rotation
      const baseSize = 16 + seededSelect(idx * 13) * 24;
      const rotation = seededSelect(idx * 17) * 360;
      const opacityBase = isMobile ? 0.2 : 0.25;
      const opacityRange = isMobile ? 0.2 : 0.25;
      const opacity = opacityBase + seededSelect(idx * 23) * opacityRange;

      items.push({
        id: idx,
        x: point.x,
        y: point.y,
        size: baseSize * sizeMultiplier,
        rotation,
        opacity,
        zIndex: "below",
      });
    });

    return items;
  }, [counts.background, isMobile, isTablet]);

  const backgroundEmojis = useMemo(
    () => emojis.filter((e) => e.zIndex === "below"),
    [emojis]
  );

  if (!mounted) {
    return (
      <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
    );
  }

  if (!emoji) {
    return (
      <div
        className="absolute inset-0 transition-colors duration-200"
        style={{ backgroundColor: bgColor }}
      />
    );
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden transition-colors duration-200"
      style={{ backgroundColor: bgColor }}
    >
      {backgroundEmojis.map((item) => (
        <span
          key={item.id}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

export const EmojiBackground = memo(EmojiBackgroundComponent);
