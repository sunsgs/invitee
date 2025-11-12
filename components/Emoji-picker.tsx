"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EMOJI_GROUPS } from "@/lib/emojis";
import { Smile } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "./ui/input";

interface EmojiBackgroundPickerProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

export function EmojiBackgroundPicker({
  onEmojiSelect,
  selectedEmoji,
}: EmojiBackgroundPickerProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return EMOJI_GROUPS;

    const query = searchTerm.toLowerCase();

    return EMOJI_GROUPS.map((group) => ({
      ...group,
      emojis: group.emojis.filter(
        (emojiData) =>
          emojiData.keywords.some((keyword) => keyword.includes(query)) ||
          emojiData.name.toLowerCase().includes(query) ||
          emojiData.shortcode.includes(query)
      ),
    })).filter(
      (group) =>
        group.emojis.length > 0 || group.name.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  const currentGroup = filteredGroups[activeCategory];

  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  const handleClear = () => {
    onEmojiSelect("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="rounded-none">
          {selectedEmoji ? (
            <span className="text-lg">{selectedEmoji}</span>
          ) : (
            <Smile className="h-4 w-4" />
          )}
          {/* <span className="hidden sm:inline">
            {selectedEmoji ? "Emoji" : "Add Emoji"}
          </span> */}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-70 p-0 z-50 ml-2" align="end" side="bottom">
        {/* Header */}
        <div className="flex flex-col gap-3 px-6">
          {/* Search Input */}
          <Input
            type="text"
            aria-label="Search emojis"
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setActiveCategory(0);
            }}
            className="w-full px-3 py-2 mt-6 rounded-lg text-sm"
          />

          {/* Category Tabs - Horizontal Scroll */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-6 px-6">
            {filteredGroups.map((group, idx) => (
              <Button
                key={idx}
                variant={activeCategory === idx ? "default" : "outline"}
                size={"lg"}
                onClick={() => setActiveCategory(idx)}
                className="rounded-full"
              >
                {group.name}
              </Button>
            ))}
          </div>

          {/* Emoji Grid - Compact */}
          <div className="grid grid-cols-4 gap-1 max-h-50 overflow-y-auto">
            {currentGroup?.emojis.length ? (
              currentGroup.emojis.map((emojiData, idx) => (
                <button
                  key={idx}
                  onClick={() => handleEmojiSelect(emojiData.shortcode)}
                  title={`${emojiData.name}`}
                  className="aspect-square p-2 border flex items-center justify-center text-xl rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  {emojiData.unicode}
                </button>
              ))
            ) : (
              <div className="col-span-7 flex items-center justify-center p-6 text-xs text-gray-500">
                No emojis found
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="grid grid-cols-2 border-t border-gray-200  gap-2 pt-3 -mx-6 px-6 pb-6">
            <Button
              onClick={handleClear}
              variant={"outline"}
              size={"lg"}
              className=""
            >
              Clear
            </Button>
            <Button onClick={() => setOpen(false)} className="">
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
