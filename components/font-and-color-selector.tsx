"use client";

import { FontSelector } from "@/components/font-selector";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Type } from "lucide-react";
import { ColorPicker } from "./color-picker"; // use the underlying ColorPicker directly

interface FontAndColorPopoverProps {
  fontValue: string;
  onFontChange: (value: string) => void;
  textColor: string;
  onTextColorChange: (color: string) => void;
}

export function FontAndColorPopover({
  fontValue,
  onFontChange,
  textColor,
  onTextColorChange,
}: FontAndColorPopoverProps) {
  const handleColorChange = (c: { hex: string }) => {
    onTextColorChange(c.hex);
  };

  const handleFontChange = (value: string) => {
    onFontChange(value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 shadow-none rounded-none rounded-tl-sm rounded-bl-sm py-6"
        >
          <Type className="h-4 w-4" />
          <span className="hidden sm:inline">Text Style</span>
          <div
            className="h-4 w-4 rounded border"
            style={{ backgroundColor: textColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col p-4 gap-4">
        <div className="flex-1">
          <FontSelector value={fontValue} onValueChange={handleFontChange} />
        </div>
        <div className="flex-1">
          <ColorPicker defaultValue={textColor} onChange={handleColorChange} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
