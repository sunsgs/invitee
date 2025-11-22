"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { ColorPicker } from "./color-picker";

interface ColorPickerPopoverProps {
  color: string;
  onColorChange: (color: string) => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export function ColorPickerPopover({
  color,
  onColorChange,
  icon,
  label,
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const lastColorRef = useRef(color);

  const handleChange = (c: { hex: string }) => {
    if (c.hex.toLowerCase() !== lastColorRef.current.toLowerCase()) {
      lastColorRef.current = c.hex;
      onColorChange(c.hex);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (val) {
          lastColorRef.current = color;
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          aria-label={label}
          className={cn(
            "flex items-center justify-center gap-2",
            "min-w-11 min-h-11 p-2",
            className
          )}
        >
          <span className="text-muted-foreground">{icon}</span>
          <div
            className="
              h-5 w-5 
              rounded-md 
              border border-border/50
              shadow-sm
              ring-1 ring-inset ring-black/5
              transition-transform
              group-active:scale-95
            "
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-3 rounded-2xl shadow-lg border-border/50"
        sideOffset={12}
        align="start"
        side="top"
        collisionPadding={8}
      >
        <div className="flex flex-col gap-2">
          <ColorPicker defaultValue={color} onChange={handleChange} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
