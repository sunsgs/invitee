"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { ChangePasswordData, ChangePasswordSchema } from "@/validation/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  title = "Change Password",
  description = "Enter your new password below to update your account credentials.",
}: ConfirmationDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      currentPassword: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset(); // reset form fields on dialog close
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ChangePasswordData) => {
    try {
      await authClient.changePassword({
        newPassword: data.confirmPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: true,
      });
      toast.success("Password updated");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update password");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-lg p-6 bg-white dark:bg-gray-900 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col space-y-4"
          noValidate
        >
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel htmlFor="currentPassword" className="font-medium">
                Current password
              </FieldLabel>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                {...register("currentPassword")}
                aria-invalid={!!errors.currentPassword}
                aria-describedby="currentPassword-error"
                disabled={isSubmitting}
                className="focus:ring-primary-500"
              />
              {errors.currentPassword && (
                <FieldDescription
                  role="alert"
                  id="currentPassword-error"
                  className="text-red-600 mt-1 text-sm"
                >
                  {errors.currentPassword.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className="font-medium">
                New password
              </FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                {...register("password")}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
                disabled={isSubmitting}
                className="focus:ring-primary-500"
              />
              {errors.password && (
                <FieldDescription
                  role="alert"
                  id="password-error"
                  className="text-red-600 mt-1 text-sm"
                >
                  {errors.password.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword" className="font-medium">
                Confirm new password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby="confirmPassword-error"
                disabled={isSubmitting}
                className="focus:ring-primary-500"
              />
              {errors.confirmPassword && (
                <FieldDescription
                  role="alert"
                  id="confirmPassword-error"
                  className="text-red-600 mt-1 text-sm"
                >
                  {errors.confirmPassword.message}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-2"
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
