import { ColorPickerPopover } from "@/components/color-picker-popover";
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

const ToolDivider = () => (
  <div className="w-px h-7 bg-border" aria-hidden="true" />
);

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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background">
      <div className="flex items-center justify-between px-2 py-2 sm:px-4 sm:py-2.5 max-w-4xl mx-auto">
        <div
          className="flex items-center gap-0.5 sm:gap-1"
          role="toolbar"
          aria-label="Invitation styling tools"
        >
          {/* Color Tools Group */}
          <ColorPickerPopover
            color={bgColor}
            onColorChange={onBgColorChange}
            icon={<PaintBucket className="h-[18px] w-[18px]" />}
            label="Background"
          />
          <ToolDivider />

          <ColorPickerPopover
            color={textColor}
            onColorChange={onTextColorChange}
            icon={<Baseline className="h-[18px] w-[18px]" />}
            label="Text"
          />

          <ToolDivider />

          {/* Typography */}
          <FontSelector value={fontValue} onValueChange={onFontChange} />

          <ToolDivider />

          {/* Decoration */}
          <EmojiBackgroundPicker
            onEmojiSelect={onEmojiSelect}
            selectedEmoji={selectedEmoji}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {inviteId && (
            // <Dialog>
            //   <DialogTrigger asChild>
            //     <Button variant="outline">Share</Button>
            //   </DialogTrigger>
            //   <DialogContent className="sm:max-w-md">
            //     <DialogHeader>
            //       <DialogTitle>Share link</DialogTitle>
            //       <DialogDescription>
            //         Anyone who has this link will be able to view this.
            //       </DialogDescription>
            //     </DialogHeader>
            //     <div className="flex items-center gap-2">
            //       <div className="grid flex-1 gap-2">
            //         <Label htmlFor="link" className="sr-only">
            //           Link
            //         </Label>
            //         <Input
            //           id="link"
            //           defaultValue={`${process.env.NEXT_PUBLIC_APP_URL}/invites/${inviteId}`}
            //           readOnly
            //         />
            //       </div>
            //     </div>
            //     <DialogFooter className="sm:justify-start">
            //       <DialogClose asChild>
            //         <Button type="button" variant="secondary">
            //           Close
            //         </Button>
            //       </DialogClose>
            //     </DialogFooter>
            //   </DialogContent>
            // </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              aria-label="Share invitation"
              className="
                h-10 w-10 sm:h-11 sm:w-11
                rounded-full
                text-muted-foreground
                hover:text-foreground hover:bg-muted
                active:scale-95
                transition-all
              "
            >
              <Share className="h-[18px] w-[18px]" />
            </Button>
          )}

          <Button
            type="submit"
            form="invitation-form"
            disabled={isSubmitting}
            className="py-6 px-8 font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Saving</span>
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
