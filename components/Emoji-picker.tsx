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
  onEmojiSelect: (emoji: string | string[]) => void;
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 shadow-none rounded-none rounded-tl-md rounded-bl-md "
        >
          {selectedEmoji ? (
            <span className="text-2xl">{selectedEmoji}</span>
          ) : (
            <Smile className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {selectedEmoji ? "Emoji" : "Add Emoji"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-60 z-50 p-1" align="end">
        <div className="flex flex-col gap-3 p-2">
          <div className="grid max-h-64 grid-cols-5 sm:grid-cols-6 gap-1 sm:gap-2 overflow-y-auto rounded-lg">
            {currentGroup?.emojis.length ? (
              currentGroup.emojis.map((emojiData, idx) => (
                <button
                  key={idx}
                  onClick={() => handleEmojiSelect(emojiData.unicode)}
                  className="flex items-center justify-center rounded-lg p-1 text-lg sm:p-2 sm:text-xl"
                  title={`${emojiData.name} - ${emojiData.keywords.join(", ")}`}
                >
                  {emojiData.unicode}
                </button>
              ))
            ) : (
              <div className="col-span-6 flex items-center justify-center p-4 text-xs">
                No emojis found for &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filteredGroups.map((group, idx) => (
              <Button
                key={idx}
                variant={activeCategory === idx ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(idx)}
                className="whitespace-nowrap text-xs relative"
              >
                {group.name}
              </Button>
            ))}
          </div>
          <Input
            type="text"
            aria-label="Search emojis"
            placeholder="Search emojis (e.g., penguin, party, marvel...)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setActiveCategory(0);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
