"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "./ui/calendar";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { InviteFormData, inviteSchema } from "@/validation/schema";
import { ButtonGroup } from "./ui/button-group";
import { Switch } from "./ui/switch";

interface CreateInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InviteFormData) => void;
}

export function CreateInviteModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateInviteModalProps) {
  const [gpuCount, setGpuCount] = useState(8);

  const [popoverOpen, setPopoverOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
    watch,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      title: "",
      invitee: "",
      datetime: "",
      location: "",
      description: "",
      maxGuests: undefined,
      rsvpRequired: false,
    },
  });

  const datetime = watch("datetime");
  const selectedDate = datetime ? new Date(datetime) : undefined;

  // Reset form on modal close
  useEffect(() => {
    if (!isOpen)
      reset({
        title: "",
        datetime: "",
        location: "",
        invitee: undefined,
        description: undefined,
        maxGuests: undefined,
        rsvpRequired: false,
      });
  }, [isOpen, reset]);

  // Handle date picker change, maintain time if set
  const onDateSelect = (date: Date | undefined) => {
    if (!date) {
      setValue("datetime", "");
      setPopoverOpen(false);
      return;
    }

    let hours = 0,
      minutes = 0;
    if (selectedDate) {
      hours = selectedDate.getHours();
      minutes = selectedDate.getMinutes();
    }
    const updatedDate = new Date(date);
    updatedDate.setHours(hours, minutes, 0, 0);
    setValue("datetime", updatedDate.toISOString(), { shouldValidate: true });
    setPopoverOpen(false);
  };

  // Handle time input change, preserve date portion
  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value; // format "HH:mm"
    if (!timeValue) return;

    const [hours, minutes] = timeValue.split(":").map(Number);
    let baseDate = selectedDate ? new Date(selectedDate) : new Date();

    baseDate.setHours(hours, minutes, 0, 0);
    setValue("datetime", baseDate.toISOString(), { shouldValidate: true });
  };

  const handleGpuAdjustment = useCallback((adjustment: number) => {
    setGpuCount((prevCount) =>
      Math.max(1, Math.min(99, prevCount + adjustment))
    );
  }, []);

  const handleGpuInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 1 && value <= 99) {
        setGpuCount(value);
      }
    },
    []
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-lg p-6 bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle>Create New Invite</DialogTitle>
          <DialogDescription>
            Fill in the info to invite your guests.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 mt-4"
          noValidate
        >
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="title">Title *</FieldLabel>
                  <Input
                    id="title"
                    {...register("title")}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.title}
                    aria-describedby={errors.title ? "title-error" : undefined}
                    required
                  />
                  {errors.title && (
                    <p
                      id="title-error"
                      role="alert"
                      className="text-red-600 text-sm mt-1"
                    >
                      {errors.title.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="invitee">Invitee</FieldLabel>
                  <Input
                    id="invitee"
                    {...register("invitee")}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.invitee}
                    aria-describedby={
                      errors.invitee ? "invitee-error" : undefined
                    }
                  />
                  {errors.invitee && (
                    <p
                      id="invitee-error"
                      role="alert"
                      className="text-red-600 text-sm mt-1"
                    >
                      {errors.invitee.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <FieldLabel>When</FieldLabel>
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="date-picker"
                            className="justify-between font-normal w-full"
                            aria-haspopup="dialog"
                            aria-expanded={popoverOpen}
                          >
                            {selectedDate
                              ? selectedDate.toLocaleDateString()
                              : "Select date"}
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            captionLayout="dropdown"
                            onSelect={onDateSelect}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <FieldLabel htmlFor="time-picker">Time</FieldLabel>
                      <Input
                        id="time-picker"
                        type="time"
                        step={60}
                        defaultValue={
                          selectedDate
                            ? selectedDate.toTimeString().slice(0, 5)
                            : "10:30"
                        }
                        onChange={onTimeChange}
                        disabled={isSubmitting}
                        aria-invalid={!!errors.datetime}
                        aria-describedby={
                          errors.datetime ? "datetime-error" : undefined
                        }
                      />
                      {errors.datetime && (
                        <p
                          id="datetime-error"
                          role="alert"
                          className="text-red-600 text-sm mt-1"
                        >
                          {errors.datetime.message}
                        </p>
                      )}
                    </div>
                  </div>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="location">Location *</FieldLabel>
            <Input
              id="location"
              {...register("location")}
              disabled={isSubmitting}
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? "location-error" : undefined}
              required
            />
            {errors.location && (
              <p
                id="location-error"
                role="alert"
                className="text-red-600 text-sm mt-1"
              >
                {errors.location.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
              id="description"
              {...register("description")}
              disabled={isSubmitting}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
            />
            {errors.description && (
              <p
                id="description-error"
                role="alert"
                className="text-red-600 text-sm mt-1"
              >
                {errors.description.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="maxGuests">Max number of guests</FieldLabel>
            <ButtonGroup>
              <Input
                id="maxGuests"
                value={gpuCount}
                {...register("maxGuests", { valueAsNumber: true })}
                onChange={handleGpuInputChange}
                size={2}
                className="h-8"
                maxLength={2}
              />
              <Button
                variant="outline"
                size="icon-sm"
                type="button"
                aria-label="Decrement"
                onClick={() => handleGpuAdjustment(-1)}
                disabled={gpuCount <= 1}
              >
                <Minus />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                type="button"
                aria-label="Increment"
                onClick={() => handleGpuAdjustment(1)}
                disabled={gpuCount >= 99}
              >
                <Plus />
              </Button>
            </ButtonGroup>
          </Field>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="rsvpRequired">RSVP Required</FieldLabel>
              <Controller
                name="rsvpRequired"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="rsvpRequired"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
            {errors.rsvpRequired && (
              <p
                id="rsvp-error"
                role="alert"
                className="text-red-600 text-sm mt-1"
              >
                {errors.rsvpRequired.message}
              </p>
            )}
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
