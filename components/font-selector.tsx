"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FONT_CATEGORIES, INVITATION_FONTS } from "@/lib/fonts-config";
import { cn } from "@/lib/utils";
import { Type } from "lucide-react";
import { useState } from "react";

interface FontSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function FontSelector({
  value,
  onValueChange,
  className,
}: FontSelectorProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredFonts =
    categoryFilter === "all"
      ? INVITATION_FONTS
      : INVITATION_FONTS.filter((font) => font.category === categoryFilter);

  const selectedFont = INVITATION_FONTS.find((f) => f.value === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label="Select font"
        className={cn(
          "flex items-center justify-center gap-2",
          "min-w-11 min-h-11 px-3",
          "bg-transparent border-none shadow-none",
          "rounded-xl gap-1",
          className
        )}
      >
        <Type className="h-5 w-5 text-muted-foreground shrink-0" />
      </SelectTrigger>

      <SelectContent
        className="
          w-[min(320px,calc(100vw-32px))]
          rounded-2xl 
          shadow-lg 
          border-border/50
          overflow-hidden
        "
        sideOffset={12}
        side="top"
        align="start"
        collisionPadding={16}
      >
        {/* Category Filter */}
        <div className="flex gap-1.5 p-3 border-b border-border/50 overflow-x-auto scrollbar-none">
          {FONT_CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              type="button"
              size="sm"
              variant={categoryFilter === cat.value ? "default" : "outline"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCategoryFilter(cat.value);
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={cn(
                "rounded-full px-3 py-1 h-8",
                "text-sm font-medium",
                "whitespace-nowrap shrink-0",
                "transition-all",
                categoryFilter === cat.value ? "shadow-sm" : "hover:bg-muted"
              )}
            >
              {cat.label.split("(")[0].trim()}
            </Button>
          ))}
        </div>

        {/* Font List */}
        <div className="max-h-[280px] overflow-y-auto p-1.5">
          {filteredFonts.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No fonts in this category
            </div>
          ) : (
            filteredFonts.map((font) => (
              <SelectItem
                key={font.value}
                value={font.value}
                className={cn(
                  "cursor-pointer",
                  "py-3 px-3",
                  "rounded-xl",
                  "transition-colors",
                  // Remove all focus/outline styles
                  "focus:bg-muted focus:outline-none",
                  "focus-visible:outline-none focus-visible:ring-0",
                  "data-[highlighted]:bg-muted data-[highlighted]:outline-none",
                  "data-[state=checked]:bg-muted",
                  // Remove any default outlines
                  "outline-none ring-0"
                )}
              >
                <div className="flex flex-col items-start gap-1">
                  <span
                    className="text-base"
                    style={{ fontFamily: `var(${font.variable})` }}
                  >
                    {font.name}
                  </span>
                  <span
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: `var(${font.variable})` }}
                  >
                    {font.preview}
                  </span>
                </div>
              </SelectItem>
            ))
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
