"use client";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "../ui/button";

export function InvitesEmptyState() {
  const t = useTranslations("PRIVATE.EMPTY");

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Calendar className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{t("TITLE")}</h3>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
        {t("COPY")}{" "}
      </p>
      <Link href="invites/create">
        <Button className="button-rounded gap-2" variant={"outline"}>
          <span className="text-lg leading-none">+</span>
          <span>{t("CREATE")}</span>
        </Button>
      </Link>
    </div>
  );
}
