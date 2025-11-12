"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Minus, Plus, RulerDimensionLine } from "lucide-react";

interface EmojiDensityControlProps {
  density: number;
  onDensityChange: (density: number) => void;
}

export function EmojiDensityControl({
  density,
  onDensityChange,
}: EmojiDensityControlProps) {
  const densityLevels = [
    { value: 1, label: "Minimal", description: "Few emojis, clean look" },
    {
      value: 2,
      label: "Balanced",
      description: "Perfect mix (recommended)",
    },
    {
      value: 3,
      label: "Rich",
      description: "More emojis, vibrant",
    },
    { value: 4, label: "Maximum", description: "Full emoji coverage" },
  ];

  const currentLevel = densityLevels.find((level) => level.value === density);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="rounded-none">
          <RulerDimensionLine className="h-4 w-4" />
          {/* <span className="hidden sm:inline">Emoji Density</span> */}
          <span className="sm:hidden text-xs">{currentLevel?.label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="font-semibold text-sm mb-1">Emoji Density</h4>
            <span className="text-xs sm:hidden">
              {currentLevel?.description}
            </span>
          </div>

          <div className="flex gap-1.5">
            {densityLevels.map((level) => (
              <Button
                onClick={() => onDensityChange(level.value)}
                key={level.value}
                className={`flex-1 h-4 rounded-full transition-all p-1 ${
                  level.value <= density ? "bg-primary" : "bg-accent"
                }`}
              />
            ))}
          </div>

          {/* <div className="grid grid-cols-2 gap-2">
            {densityLevels.map((level) => (
              <Button
                key={level.value}
                variant={density === level.value ? "default" : "outline"}
                size="sm"
                onClick={() => onDensityChange(level.value)}
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <span className="text-xs font-medium">{level.label}</span>
                <span className="text-[10px] opacity-70">
                  ≈{level.value === 1 && 17}
                  {level.value === 2 && 33}
                  {level.value === 3 && 49}
                  {level.value === 4 && 66} emojis
                </span>
              </Button>
            ))}
          </div> */}

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDensityChange(Math.max(1, density - 1))}
              disabled={density === 1}
              className="flex-1"
            >
              <Minus className="h-4 w-4 mr-1" />
              Less
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDensityChange(Math.min(4, density + 1))}
              disabled={density === 4}
              className="flex-1"
            >
              More
              <Plus className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
