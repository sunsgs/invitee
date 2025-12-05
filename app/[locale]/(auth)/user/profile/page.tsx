"use client";
import DeleteAccountDialog from "@/components/profile/Delete-account";
import EditProfile from "@/components/profile/edit-profile";
import LanguageSelector from "@/components/profile/Language-selector";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";

export default function AccountSettingsPage() {
  const { data: session } = authClient.useSession();
  const t = useTranslations("PRIVATE.PROFILE");

  return (
    <div className="flex w-full flex-col max-w-4xl mx-auto p-6 space-y-4">
      {/* Header */}
      <h1 className="text-3xl font-bold tracking-tight">{t("TITLE")}</h1>

      <Separator />

      {/* Profile Section */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{t("PROFILE")}</h2>
          <p className="text-sm text-muted-foreground">{t("COPY-PROFILE")}</p>
        </div>
        <EditProfile session={session} />
      </section>

      <Separator />

      {/* Language Section */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{t("LANG-REGION")}</h2>
          <p className="text-sm text-muted-foreground">{t("LANG-COPY")} </p>
        </div>
        <LanguageSelector />
      </section>

      <Separator />

      {/* Danger Zone */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-destructive">
            {t("DANGER")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("DANGER-COPY")}</p>
        </div>
        <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <h3 className="text-base font-semibold"> {t("DELETE")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("DELETE-COPY")}
              </p>
            </div>
            <DeleteAccountDialog session={session} />
          </div>
        </div>
      </section>
    </div>
  );
}
