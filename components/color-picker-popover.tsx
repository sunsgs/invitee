"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRef, useState } from "react";
import { ColorPicker } from "./color-picker";

interface ColorPickerPopoverProps {
  color: string;
  onColorChange: (color: string) => void;
  icon: React.ReactNode;
  label: string;
}

export function ColorPickerPopover({
  color,
  onColorChange,
  icon,
  label,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const lastColorRef = useRef(color);

  const handleChange = (c: { hex: string }) => {
    // Only trigger onChange if the color actually changed
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
          // Sync ref with current prop when opening
          lastColorRef.current = color;
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" className="rounded-none" type="button">
          {icon}
          {/* <span className="hidden sm:inline">{label}</span> */}
          <div
            className="h-5 w-5 rounded-sm border"
            style={{ backgroundColor: color }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 ml-2"
        sideOffset={16}
        align="center"
      >
        <ColorPicker defaultValue={color} onChange={handleChange} />
      </PopoverContent>
    </Popover>
  );
}
