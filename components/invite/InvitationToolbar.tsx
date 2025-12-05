"use client";

import { ColorPickerPopover } from "@/components/color-picker-popover";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Baseline, PaintBucket, Share } from "lucide-react";
import { useTranslations } from "next-intl";
import { FontSelector } from "../font-selector";
import IconPicker from "./Emoji-svg-picker";

interface InvitationToolbarProps {
  bgColor: string;
  textColor: string;
  fontValue: string;
  selectedIcon: string;
  isSubmitting: boolean;
  inviteId?: string;
  onBgColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  onFontChange: (font: string) => void;
  onIconSelect: (iconId: string) => void;
  onShare?: () => void;
}

const ToolDivider = () => (
  <div className="w-px h-7 bg-border" aria-hidden="true" />
);

export const InvitationToolbar = ({
  bgColor,
  textColor,
  fontValue,
  selectedIcon,
  isSubmitting,
  inviteId,
  onBgColorChange,
  onTextColorChange,
  onFontChange,
  onIconSelect,
  onShare,
}: InvitationToolbarProps) => {
  const t = useTranslations("PRIVATE.INVITE.BUILDER");

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background">
      <div className="flex items-center justify-between px-2 py-2 sm:px-4 sm:py-2.5 max-w-4xl mx-auto">
        <div
          className="flex items-center gap-0.5 sm:gap-1"
          role="toolbar"
          aria-label="Invitation styling tools"
        >
          {/* Color Tools */}
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

          {/* New Unified Icon Picker */}
          <IconPicker
            selectedIconId={selectedIcon}
            onIconSelect={onIconSelect}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {inviteId && (
            <Button
              className="button-rounded"
              variant="outline"
              size="icon-lg"
              onClick={onShare}
              aria-label="Share invitation"
            >
              <Share size={18} />
            </Button>
          )}

          <Button
            className="rounded-full"
            type="submit"
            form="invitation-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
              </span>
            ) : (
              t("SAVE")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
