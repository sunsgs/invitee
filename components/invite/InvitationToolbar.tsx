import { ColorPickerPopover } from "@/components/color-picker-popover";
import { EmojiDensityControl } from "@/components/emoji-density-control";
import { EmojiBackgroundPicker } from "@/components/Emoji-picker";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Baseline, PaintBucket, Share } from "lucide-react";
import { FontSelector } from "../font-selector";

interface InvitationToolbarProps {
  bgColor: string;
  textColor: string;
  fontValue: string;
  selectedEmoji: string;
  emojiDensity: number;
  isSubmitting: boolean;
  inviteId?: string;
  onBgColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  onFontChange: (font: string) => void;
  onEmojiSelect: (emoji: string) => void;
  onEmojiDensityChange: (density: number) => void;
  onShare?: () => void;
}

export const InvitationToolbar = ({
  bgColor,
  textColor,
  fontValue,
  selectedEmoji,
  emojiDensity,
  isSubmitting,
  inviteId,
  onBgColorChange,
  onTextColorChange,
  onFontChange,
  onEmojiSelect,
  onEmojiDensityChange,
  onShare,
}: InvitationToolbarProps) => {
  return (
    <div className="flex w-full mx-auto fixed left-0 bottom-0 z-50 bg-background items-center border-t md:px-2 justify-between">
      <div className="divide-x w-full flex h-full">
        <ColorPickerPopover
          color={bgColor}
          onColorChange={onBgColorChange}
          icon={<PaintBucket className="h-4 w-4" />}
          label="Background color"
        />

        <ColorPickerPopover
          color={textColor}
          onColorChange={onTextColorChange}
          icon={<Baseline className="h-4 w-4" />}
          label="text color"
        />

        <FontSelector value={fontValue} onValueChange={onFontChange} />

        <EmojiBackgroundPicker
          onEmojiSelect={onEmojiSelect}
          selectedEmoji={selectedEmoji}
        />

        {selectedEmoji && (
          <div>
            <EmojiDensityControl
              density={emojiDensity}
              onDensityChange={onEmojiDensityChange}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center my-4">
        <Button
          type="submit"
          form="invitation-form"
          disabled={isSubmitting}
          size={"lg"}
          aria-label="Save"
          title="Save"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Spinner /> Saving
            </div>
          ) : (
            "Save"
          )}
        </Button>

        {inviteId && (
          <Button
            variant="ghost"
            size="lg"
            className="px-4 py-6 cta"
            onClick={onShare}
            aria-label="Share invitation"
          >
            <Share size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};
