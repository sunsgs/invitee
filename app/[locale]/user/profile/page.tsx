import EditProfile from "@/components/profile/edit-profile";
import LanguageSelector from "@/components/profile/Language-selector";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DeleteAccountDialog from "../../../../components/profile/Delete-account";

export default async function AccountSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex w-full flex-col max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Separator />

      {/* Profile Section */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Update your personal information
          </p>
        </div>
        <EditProfile session={session} />
      </section>

      <Separator />

      {/* Language Section */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Language & Region</h2>
          <p className="text-sm text-muted-foreground">
            Choose your preferred language
          </p>
        </div>
        <LanguageSelector />
      </section>

      <Separator />

      {/* Danger Zone */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-destructive">
            Danger Zone
          </h2>
          <p className="text-sm text-muted-foreground">
            Irreversible actions that affect your account
          </p>
        </div>
        <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <h3 className="text-base font-semibold">Delete Account</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <DeleteAccountDialog session={session} />
          </div>
        </div>
      </section>
    </div>
  );
}
