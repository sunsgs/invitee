"use client";

import { LoginForm } from "@/components/forms/login-form";
import { signIn } from "@/lib/auth-client";
import { LoginFormData } from "@/validation/schema";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("LOGIN");

  const handleSignIn = async (d: LoginFormData) => {
    const { email, password } = d;

    await signIn.email(
      { email, password },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          toast.error(t(ctx.error.code));
        },
      }
    );
    setLoading(false);
  };

  return (
    <div className="...">
      <LoginForm onSubmit={handleSignIn} loading={loading} />
    </div>
  );
}
