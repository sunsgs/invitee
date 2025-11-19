"use client";

import { authClient, useSession } from "@/lib/auth-client";
import { profileSchema, ProfileSchema } from "@/validation/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";

export default function EditProfile(props: { session?: any }) {
  const { data, isPending } = useSession();
  const session = data || props.session;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
    },
  });

  const onSubmit = async (formData: ProfileSchema) => {
    try {
      await authClient.updateUser({
        name: formData.name || undefined,
        fetchOptions: {
          onSuccess: () => {
            toast.success("User updated successfully");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Update error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex flex-col space-y-4"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder={session?.user?.name || "Enter your name"}
          {...register("name")}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isPending}
        className="w-fit"
      >
        {isSubmitting ? <Spinner /> : "Save"}
      </Button>
    </form>
  );
}
