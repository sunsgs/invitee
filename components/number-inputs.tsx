import { Minus, Plus } from "lucide-react";
import { memo, useCallback } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Button } from "./ui/button";

interface NumberInputFieldProps {
  /** Unique identifier for the input */
  id?: string;
  /** The label text displayed on the left */
  label: string;
  /** Optional description text shown below the label */
  description?: string;
  /** Current numeric value */
  value: number;
  /** Callback fired when increment/decrement buttons are clicked */
  onAdjust?: (adjustment: number) => void;
  /** Direct onChange handler for the input (if needed) */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** React Hook Form register props for form integration */
  registerProps?: UseFormRegisterReturn;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Custom className for the container */
  className?: string;
  /** Disable all interactions */
  disabled?: boolean;
  /** Custom aria-label for accessibility */
  ariaLabel?: string;
  /** Step increment/decrement amount */
  step?: number;
}

/**
 * NumberInputField - A minimalist counter component inspired by Airbnb's guest selector.
 * Features circular +/- buttons with a centered numeric display.
 * Fully compatible with React Hook Form.
 *
 * @example
 * ```tsx
 * // Simple usage with state
 * <NumberInputField
 *   label="Adults"
 *   description="Ages 13 or above"
 *   value={adults}
 *   onAdjust={(adj) => setAdults(prev => prev + adj)}
 *   min={1}
 *   max={16}
 * />
 *
 * // With React Hook Form
 * <NumberInputField
 *   id="maxGuestsNumber"
 *   label="Adults"
 *   value={maxGuestsNumber}
 *   onAdjust={handleMaxGuestAdjustment}
 *   onChange={handleMaxGuestInput}
 *   registerProps={register("maxGuestsNumber", { valueAsNumber: true })}
 *   min={1}
 *   max={99}
 * />
 * ```
 */
export const NumberInputField = memo<NumberInputFieldProps>(
  ({
    id,
    label,
    description,
    value,
    onAdjust,
    onChange,
    registerProps,
    min = 0,
    max = 99,
    className = "",
    disabled = false,
    ariaLabel,
    step = 1,
  }) => {
    const handleDecrement = useCallback(() => {
      if (disabled || value <= min) return;
      onAdjust?.(-step);
    }, [disabled, value, min, onAdjust, step]);

    const handleIncrement = useCallback(() => {
      if (disabled || value >= max) return;
      onAdjust?.(step);
    }, [disabled, value, max, onAdjust, step]);

    const isDecrementDisabled = disabled || value <= min;
    const isIncrementDisabled = disabled || value >= max;

    // Merge registerProps with our onChange handler
    const inputProps = registerProps
      ? {
          ...registerProps,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            registerProps.onChange(e);
            onChange?.(e);
          },
        }
      : { onChange };

    return (
      <div
        className={`flex items-center justify-between py-4 ${className}`}
        role="group"
        aria-label={ariaLabel || label}
      >
        <div className="flex-1 min-w-0 pr-4">
          <label htmlFor={id} className="tfont-medium cursor-pointer">
            {label}
          </label>
          {description && <p className="text-sm">{description}</p>}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            type="button"
            variant={"outline"}
            className="rounded-full w-8 h-8"
            onClick={handleDecrement}
            disabled={isDecrementDisabled}
            aria-label={`Decrease ${label.toLowerCase()}`}
            tabIndex={disabled ? -1 : 0}
          >
            <Minus />
          </Button>

          {/* Hidden input for form integration */}
          <input
            type="number"
            id={id}
            value={value}
            readOnly
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
            {...inputProps}
          />

          <div className="tabular-nums" aria-live="polite" aria-atomic="true">
            {value}
          </div>

          <Button
            variant={"outline"}
            type="button"
            className="rounded-full w-8 h-8"
            onClick={handleIncrement}
            disabled={isIncrementDisabled}
            aria-label={`Increase ${label.toLowerCase()}`}
            tabIndex={disabled ? -1 : 0}
          >
            <Plus />
          </Button>
        </div>
      </div>
    );
  }
);
