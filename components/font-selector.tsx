"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
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
    <div className="flex  gap-1">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="bg-background border-none shadow-none">
          <Type className="h-4 w-4 shrink-0" />
          {/* <SelectValue placeholder="Scegli font" className="invisible">
            {selectedFont?.name}
          </SelectValue> */}
        </SelectTrigger>
        <SelectContent className="mb-3 w-70">
          {/* Category Filter Buttons */}
          <div className="flex f gap-1 p-2 border-b overflow-x-auto">
            {FONT_CATEGORIES.map((cat) => (
              <Button
                size={"lg"}
                key={cat.value}
                variant={categoryFilter === cat.value ? "default" : "outline"}
                onClick={() => setCategoryFilter(cat.value)}
                className="rounded-full"
              >
                <span className="text-sm">
                  {" "}
                  {cat.label.split("(")[0].trim()}
                </span>
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
                  <span className="">{font.preview}</span>
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
