import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ICON_GROUPS } from "@/lib/emoji-svg";
import { IconGroup, IconItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Smile } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface IconPickerProps {
  /** Callback when an icon is selected - returns the item's id */
  onIconSelect: (id: string) => void;
  /** Currently selected icon id */
  selectedIconId?: string;
  /** Array of icon groups to display */
  groups?: IconGroup[];
  /** Additional className for the trigger button */
  className?: string;
  /** Popover alignment */
  align?: "start" | "center" | "end";
  /** Popover side */
  side?: "top" | "bottom" | "left" | "right";
}

export interface IconDisplayProps {
  /** Icon id to display */
  iconId: string;
  /** Array of icon groups to search from */
  groups?: IconGroup[];
  /** Size of the icon in pixels (default: 24) */
  size?: number;
  /** Additional className */
  className?: string;
  /** Custom style object */
  style?: React.CSSProperties;
}

// // Sample data structure - should be replaced with actual icon data
// export const ICON_GROUPS: IconGroup[] = [
//   {
//     name: "Smileys",
//     items: [
//       {
//         id: "grinning",
//         name: "Grinning Face",
//         unicode: "😀",
//         keywords: ["happy", "smile"],
//       },
//       {
//         id: "laughing",
//         name: "Laughing",
//         unicode: "😆",
//         keywords: ["happy", "laugh"],
//       },
//       {
//         id: "heart-eyes",
//         name: "Heart Eyes",
//         unicode: "😍",
//         keywords: ["love", "heart"],
//       },
//       {
//         id: "cool",
//         name: "Cool",
//         unicode: "😎",
//         keywords: ["cool", "sunglasses"],
//       },
//       {
//         id: "thinking",
//         name: "Thinking",
//         unicode: "🤔",
//         keywords: ["think", "wonder"],
//       },
//     ],
//   },
//   {
//     name: "Gestures",
//     items: [
//       {
//         id: "wave",
//         name: "Waving Hand",
//         unicode: "👋",
//         keywords: ["hello", "hi", "wave"],
//       },
//       {
//         id: "thumbs-up",
//         name: "Thumbs Up",
//         unicode: "👍",
//         keywords: ["like", "yes", "good"],
//       },
//       {
//         id: "clap",
//         name: "Clapping",
//         unicode: "👏",
//         keywords: ["applause", "clap"],
//       },
//       {
//         id: "pray",
//         name: "Prayer",
//         unicode: "🙏",
//         keywords: ["thanks", "pray"],
//       },
//       {
//         id: "fire",
//         name: "Fire",
//         unicode: "🔥",
//         keywords: ["hot", "fire", "lit"],
//       },
//     ],
//   },
//   {
//     name: "Superheroes",
//     items: [
//       {
//         id: "spiderman",
//         name: "Spiderman",
//         path: "/svg/spiderman.svg",
//         keywords: ["hero", "super", "strong"],
//       },
//       {
//         id: "batman",
//         name: "Batman",
//         svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7v6c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5z"/></svg>',
//         keywords: ["hero", "dark", "knight"],
//       },
//     ],
//   },
//   {
//     name: "Disney",
//     items: [
//       {
//         id: "mickey",
//         name: "Mickey Mouse",
//         svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><circle cx="7" cy="8" r="3"/><circle cx="17" cy="8" r="3"/></svg>',
//         keywords: ["mouse", "disney", "mickey"],
//       },
//       {
//         id: "castle",
//         name: "Castle",
//         svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M4 18V8M8 18V8M12 18V8M16 18V8M20 18V8M4 8l2-6M8 8l2-6M12 8l2-6M16 8l2-6M20 8l2-6"/></svg>',
//         keywords: ["castle", "disney", "princess"],
//       },
//     ],
//   },
//   {
//     name: "Arrows",
//     items: [
//       {
//         id: "arrow-right",
//         name: "Arrow Right",
//         svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
//         keywords: ["arrow", "right", "next"],
//       },
//       {
//         id: "arrow-left",
//         name: "Arrow Left",
//         svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
//         keywords: ["arrow", "left", "back"],
//       },
//     ],
//   },
// ];

/**
 * Helper function to find an icon by id across all groups
 */
export function findIconById(
  id: string,
  groups: IconGroup[] = ICON_GROUPS
): IconItem | undefined {
  if (!id) return undefined;
  return groups.flatMap((g) => g.items).find((item) => item.id === id);
}

/**
 * Internal helper to render an icon item
 */
function renderIconInternal(
  item: IconItem,
  size: number = 24,
  className?: string,
  style?: React.CSSProperties
) {
  // Render emoji
  if (item.unicode) {
    return (
      <span
        className={cn("leading-none select-none", className)}
        style={{ fontSize: `${size}px`, ...style }}
        aria-label={item.name}
      >
        {item.unicode}
      </span>
    );
  }

  // Render inline SVG
  if (item.svg) {
    return (
      <div
        style={{ width: size, height: size, ...style }}
        className={cn(
          "[&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain",
          className
        )}
        dangerouslySetInnerHTML={{ __html: item.svg }}
        aria-label={item.name}
      />
    );
  }

  // Render SVG from path using Next.js Image component
  if (item.path) {
    return (
      <Image
        src={item.path}
        alt={item.name}
        width={size}
        height={size}
        className={cn("object-contain", className)}
        style={{ width: size, height: size, ...style }}
        priority={false}
      />
    );
  }

  return null;
}

/**
 * IconDisplay Component
 *
 * Use this component to display a selected icon anywhere in your app.
 * Works with both emojis and SVGs, handles sizing and styling automatically.
 *
 * @example
 * // Simple display
 * <IconDisplay iconId="spiderman" size={48} />
 *
 * @example
 * // With custom styling
 * <IconDisplay
 *   iconId="heart-eyes"
 *   size={64}
 *   className="text-red-500"
 *   style={{ opacity: 0.5 }}
 * />
 *
 * @example
 * // In background pattern (like EmojiBackground)
 * <div className="absolute inset-0">
 *   {positions.map((pos, i) => (
 *     <IconDisplay
 *       key={i}
 *       iconId={selectedIconId}
 *       size={32}
 *       style={{
 *         position: 'absolute',
 *         left: `${pos.x}%`,
 *         top: `${pos.y}%`,
 *         opacity: 0.3,
 *         transform: `rotate(${pos.rotation}deg)`
 *       }}
 *     />
 *   ))}
 * </div>
 */
export function IconDisplay({
  iconId,
  groups = ICON_GROUPS,
  size = 24,
  className,
  style,
}: IconDisplayProps) {
  const icon = findIconById(iconId, groups);

  if (!icon) {
    return null;
  }

  return (
    <div
      className={cn("inline-flex items-center justify-center", className)}
      style={style}
    >
      {renderIconInternal(icon, size)}
    </div>
  );
}

/**
 * IconPicker Component
 *
 * A popover-based picker for selecting icons (emojis or SVGs).
 * Organized into categories with smooth interactions and proper accessibility.
 *
 * @example
 * const [iconId, setIconId] = useState('');
 *
 * <IconPicker
 *   selectedIconId={iconId}
 *   onIconSelect={setIconId}
 *   groups={MY_ICON_GROUPS}
 * />
 */
export default function IconPicker({
  onIconSelect,
  selectedIconId,
  groups = ICON_GROUPS,
  className,
  align = "end",
  side = "top",
}: IconPickerProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [open, setOpen] = useState(false);

  const currentGroup = groups[activeCategory];

  const handleIconSelect = (item: IconItem) => {
    onIconSelect(item.id);
    setOpen(false);
  };

  const handleClear = () => {
    onIconSelect("");
    setOpen(false);
  };

  // Find selected item for display in trigger button
  const selectedItem = selectedIconId
    ? findIconById(selectedIconId, groups)
    : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          aria-label={selectedIconId ? "Change icon" : "Add icon"}
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
          {selectedItem ? (
            renderIconInternal(selectedItem, 24)
          ) : (
            <Smile className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[min(380px,calc(100vw-32px))] p-0 rounded-2xl shadow-lg border-border/50 overflow-hidden"
        align={align}
        side={side}
        sideOffset={12}
        collisionPadding={16}
      >
        {/* Category Navigation */}
        <div className="flex gap-1.5 p-3 overflow-x-auto scrollbar-none border-b border-border/50 bg-background">
          {groups.map((group, idx) => (
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

        {/* Icon Grid */}
        <div className="p-2">
          <div className="grid gap-1 max-h-[280px] overflow-y-auto grid-cols-8">
            {currentGroup?.items.length ? (
              currentGroup.items.map((item, idx) => {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleIconSelect(item)}
                    title={item.name}
                    className={cn(
                      "aspect-square",
                      "flex items-center justify-center",
                      "rounded-full",
                      "hover:bg-muted active:bg-muted/80 active:scale-95",
                      "transition-all duration-150"
                    )}
                  >
                    {item.unicode
                      ? renderIconInternal(item, 24)
                      : renderIconInternal(item, 50)}
                  </button>
                );
              })
            ) : (
              <div className="col-span-full flex items-center justify-center py-12 text-sm text-muted-foreground">
                No icons found
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 p-3 border-t border-border/50 bg-muted/30">
          <Button
            type="button"
            onClick={handleClear}
            variant="outline"
            className="flex-1 h-11 rounded-xl font-medium"
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 h-11 rounded-xl font-medium"
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
