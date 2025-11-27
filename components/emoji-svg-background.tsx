"use client";
import { IconItem } from "@/lib/types";
import { memo, useEffect, useMemo, useState } from "react";
import { findIconById } from "./invite/Emoji-svg-picker";

interface IconBackgroundProps {
  iconId: string;
  bgColor: string;
}

interface IconInstance {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
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

function seededSelect(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function selectBalancedPoints(
  points: Array<{ x: number; y: number }>,
  count: number,
  exclusionRadius: number
): Array<{ x: number; y: number }> {
  const validPoints = points.filter((point) => {
    const distFromCenter = Math.sqrt(
      Math.pow(point.x - 50, 2) + Math.pow(point.y - 50, 2)
    );
    return distFromCenter > exclusionRadius;
  });

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

  let quadrantIdx = 0;
  let passCount = 0;

  while (selected.length < count && passCount < count * 2) {
    const quadrantName = quadrantOrder[quadrantIdx % 4];
    const quadrant = quadrants[quadrantName];
    const available = quadrant.filter((p) => !selected.includes(p));

    if (available.length > 0) {
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

function renderIcon(item: IconItem, size: number) {
  if (item.unicode) {
    return (
      <span
        className="leading-none select-none"
        style={{ fontSize: `${size}px` }}
        aria-hidden="true"
      >
        {item.unicode}
      </span>
    );
  }

  if (item.svg) {
    return (
      <div
        style={{ width: size, height: size }}
        className="[&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
        dangerouslySetInnerHTML={{ __html: item.svg }}
        aria-hidden="true"
      />
    );
  }

  if (item.path) {
    return (
      <img
        src={item.path}
        alt=""
        className="object-contain"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  return null;
}

function IconBackgroundComponent({ iconId, bgColor }: IconBackgroundProps) {
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

  const icon = useMemo(() => {
    return findIconById(iconId);
  }, [iconId]);

  const iconInstances: IconInstance[] = useMemo(() => {
    if (!icon) return [];

    const items: IconInstance[] = [];
    const sizeMultiplier = isMobile ? 0.65 : isTablet ? 0.85 : 1.0;
    const exclusionRadius = isMobile ? 25 : isTablet ? 22 : 18;

    // Adaptive count based on screen size
    const count = isMobile ? 12 : isTablet ? 18 : 24;

    const selectedPoints = selectBalancedPoints(
      STABLE_POINTS,
      count,
      exclusionRadius
    );

    selectedPoints.forEach((point, idx) => {
      const baseSize = 20 + seededSelect(idx * 13) * 28;
      const rotation = seededSelect(idx * 17) * 360;
      const opacityBase = 0.18;
      const opacityRange = 0.22;
      const opacity = opacityBase + seededSelect(idx * 23) * opacityRange;

      items.push({
        id: idx,
        x: point.x,
        y: point.y,
        size: baseSize * sizeMultiplier,
        rotation,
        opacity,
      });
    });

    return items;
  }, [icon, isMobile, isTablet]);

  if (!mounted) {
    return (
      <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
    );
  }

  if (!icon) {
    return (
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{ backgroundColor: bgColor }}
      />
    );
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      {iconInstances.map((instance) => (
        <div
          key={instance.id}
          className="absolute pointer-events-none select-none transition-opacity duration-300"
          style={{
            left: `${instance.x}%`,
            top: `${instance.y}%`,
            transform: `translate(-50%, -50%) rotate(${instance.rotation}deg)`,
            opacity: instance.opacity,
          }}
        >
          {renderIcon(icon, instance.size)}
        </div>
      ))}
    </div>
  );
}

export const IconBackground = memo(IconBackgroundComponent);
