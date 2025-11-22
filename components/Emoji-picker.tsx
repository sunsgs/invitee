"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EMOJI_GROUPS } from "@/lib/emojis";
import { cn } from "@/lib/utils";
import { Smile } from "lucide-react";
import { useMemo, useState } from "react";

interface EmojiBackgroundPickerProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji?: string;
  className?: string;
}

export function EmojiBackgroundPicker({
  onEmojiSelect,
  selectedEmoji,
  className,
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
        <Button
          variant="ghost"
          aria-label={selectedEmoji ? "Change emoji" : "Add emoji"}
          className={cn(
            "flex items-center justify-center",
            "min-w-[44px] min-h-[44px] p-2",
            "rounded-xl",
            "hover:bg-muted active:bg-muted/80",
            "transition-colors",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
        >
          {selectedEmoji ? (
            <span className="text-xl">{selectedEmoji}</span>
          ) : (
            <Smile className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="
          w-[min(320px,calc(100vw-32px))] 
          p-0 
          rounded-2xl 
          shadow-lg 
          border-border/50
          overflow-hidden
        "
        align="end"
        side="top"
        sideOffset={12}
        collisionPadding={16}
      >
        {/* Category Tabs */}
        <div className="flex gap-1.5 p-3 overflow-x-auto scrollbar-none border-b border-border/50">
          {filteredGroups.map((group, idx) => (
            <Button
              key={idx}
              type="button"
              size="sm"
              variant={activeCategory === idx ? "default" : "outline"}
              onClick={() => setActiveCategory(idx)}
              className={cn(
                "rounded-full px-3 h-8",
                "text-sm font-medium",
                "whitespace-nowrap shrink-0",
                "transition-all",
                activeCategory === idx ? "shadow-sm" : "hover:bg-muted"
              )}
            >
              {group.name}
            </Button>
          ))}
        </div>

        {/* Emoji Grid */}
        <div className="p-2">
          <div className="grid grid-cols-5 gap-1 max-h-[200px] overflow-y-auto">
            {currentGroup?.emojis.length ? (
              currentGroup.emojis.map((emojiData, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleEmojiSelect(emojiData.shortcode)}
                  title={emojiData.name}
                  className={cn(
                    "aspect-square",
                    "flex items-center justify-center",
                    "text-2xl",
                    "rounded-xl",
                    "hover:bg-muted active:bg-muted/80 active:scale-95",
                    "transition-all",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  )}
                >
                  {emojiData.unicode}
                </button>
              ))
            ) : (
              <div className="col-span-5 flex items-center justify-center py-12 text-sm text-muted-foreground">
                No emojis found
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-3 border-t border-border/50 bg-muted/30">
          <Button
            type="button"
            onClick={handleClear}
            variant="outline"
            className="flex-1 h-11 rounded-xl"
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 h-11 rounded-xl"
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
