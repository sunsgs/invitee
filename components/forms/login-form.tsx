"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoginFormData, LoginFormSchema } from "@/validation/schema";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Spinner } from "../ui/spinner";
interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading: boolean;
}

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }, // no isSubmitting here
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
  });

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email below to create your account
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                  disabled={loading}
                />
                {errors.email && (
                  <FieldDescription role="alert" className="text-red-600">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              <Field className="grid gap-4">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                    disabled={loading}
                  />
                  {errors.password && (
                    <FieldDescription role="alert" className="text-red-600">
                      {errors.password.message}
                    </FieldDescription>
                  )}
                </Field>
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="flex items-center justify-center gap-2"
                >
                  {loading && <Spinner />}
                  {loading ? "Submitting..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
