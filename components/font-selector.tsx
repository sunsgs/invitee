"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FONT_CATEGORIES, INVITATION_FONTS } from "@/lib/fonts-config";
import { Type } from "lucide-react";
import { useState } from "react";

interface FontSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function FontSelector({ value, onValueChange }: FontSelectorProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredFonts =
    categoryFilter === "all"
      ? INVITATION_FONTS
      : INVITATION_FONTS.filter((font) => font.category === categoryFilter);

  const selectedFont = INVITATION_FONTS.find((f) => f.value === value);

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="bg-background shadow-none gap-2">
          <Type className="h-4 w-4 shrink-0" />
          <SelectValue placeholder="Scegli font">
            {selectedFont?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-1 p-2 border-b">
            {FONT_CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant={categoryFilter === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat.value)}
                className="h-7 text-xs"
              >
                {cat.label.split("(")[0].trim()}
              </Button>
            ))}
          </div>

          {/* Font List */}
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredFonts.map((font) => (
              <SelectItem
                key={font.value}
                value={font.value}
                className="cursor-pointer py-3"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span
                    className="font-medium text-base"
                    style={{ fontFamily: `var(${font.variable})` }}
                  >
                    {font.name}
                  </span>
                  <span className="text-xs text-zinc-500">{font.preview}</span>
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
