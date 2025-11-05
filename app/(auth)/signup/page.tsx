"use client";

import { SignupForm } from "@/components/forms/signup-form";
import { signUp } from "@/lib/auth-client";
import { SignupFormData } from "@/validation/schema";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const t = useTranslations("SIGNUP");

  const handleSignup = async (d: SignupFormData) => {
    const { email, password, name } = d;
    console.log(d);
    await signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          router.push("/admin/dashboard");
        },
        onError: (ctx) => {
          console.log(ctx);
          toast.error(t(ctx.error.code));
        },
      }
    );
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm onSubmit={handleSignup} loading={loading} />
      </div>
    </div>
  );
}
