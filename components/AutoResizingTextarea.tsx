// AutoResizingTextarea.tsx
import React, { ForwardedRef, useCallback, useEffect, useRef } from "react";

type AutoResizingTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    maxLines?: number;
    onValueChange?: (value: string) => void;
    value?: string;
  };

const AutoResizingTextarea = React.forwardRef(function AutoResizingTextarea(
  { maxLines = 2, onValueChange, value, ...props }: AutoResizingTextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || localRef;

  const adjustHeight = useCallback(
    (target: HTMLTextAreaElement) => {
      // Always reset to get accurate scrollHeight measurement
      target.style.height = "auto";

      const computed = window.getComputedStyle(target);
      const lineHeight = parseFloat(computed.lineHeight);
      const paddingTop = parseFloat(computed.paddingTop);
      const paddingBottom = parseFloat(computed.paddingBottom);
      const borderTop = parseFloat(computed.borderTopWidth);
      const borderBottom = parseFloat(computed.borderBottomWidth);

      const totalPadding =
        paddingTop + paddingBottom + borderTop + borderBottom;
      const maxHeight = lineHeight * maxLines + totalPadding;

      // Get actual content height
      const contentHeight = target.scrollHeight;

      // Apply height: either content height OR max height, whichever is smaller
      const finalHeight = Math.min(contentHeight, maxHeight);
      target.style.height = `${finalHeight}px`;
    },
    [maxLines]
  );

  // Adjust on value change or mount
  useEffect(() => {
    if (textareaRef.current) {
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          adjustHeight(textareaRef.current);
        }
      });
    }
  }, [value, adjustHeight, textareaRef]);

  // Input event logic
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const computed = window.getComputedStyle(target);
    const lineHeight = parseFloat(computed.lineHeight);
    const paddingTop = parseFloat(computed.paddingTop);
    const paddingBottom = parseFloat(computed.paddingBottom);
    const borderTop = parseFloat(computed.borderTopWidth);
    const borderBottom = parseFloat(computed.borderBottomWidth);
    const totalPadding = paddingTop + paddingBottom + borderTop + borderBottom;
    const maxHeight = lineHeight * maxLines + totalPadding;

    target.style.height = "auto";

    if (target.scrollHeight > maxHeight) {
      // Text exceeds max lines, revert
      target.value = target.value.slice(0, -1);
      onValueChange?.(target.value);
    } else {
      onValueChange?.(target.value);
    }

    // Always adjust height - this handles both growing AND shrinking
    adjustHeight(target);
  };

  // Handle paste operations
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const pastedText = e.clipboardData.getData("text");

    const currentPos = target.selectionStart;
    const beforeCursor = target.value.substring(0, currentPos);
    const afterCursor = target.value.substring(target.selectionEnd);

    let newValue = beforeCursor + pastedText + afterCursor;

    const computed = window.getComputedStyle(target);
    const lineHeight = parseFloat(computed.lineHeight);
    const paddingTop = parseFloat(computed.paddingTop);
    const paddingBottom = parseFloat(computed.paddingBottom);
    const borderTop = parseFloat(computed.borderTopWidth);
    const borderBottom = parseFloat(computed.borderBottomWidth);
    const totalPadding = paddingTop + paddingBottom + borderTop + borderBottom;
    const maxHeight = lineHeight * maxLines + totalPadding;

    target.value = newValue;
    target.style.height = "auto";

    while (target.scrollHeight > maxHeight && target.value.length > 0) {
      target.value = target.value.slice(0, -1);
    }

    onValueChange?.(target.value);
    adjustHeight(target);
  };

  return (
    <textarea
      {...props}
      ref={textareaRef}
      rows={1}
      value={value}
      onInput={handleInput}
      onPaste={handlePaste}
      style={{
        lineHeight: "1.5",
        ...props.style,
      }}
    />
  );
});

export default AutoResizingTextarea;
