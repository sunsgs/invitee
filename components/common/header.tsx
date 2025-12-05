"use client";

import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import NavUser from "./nav-user";

export function Header() {
  const t = useTranslations("PRIVATE.NAVBAR");

  const { data: session } = authClient.useSession();
  const isAnonymous = session?.user.isAnonymous;
  return (
    <header className="flex justify-between items-center relative w-full my-4 max-w-7xl mx-auto px-4">
      <div className="shrink-0 font-bagel text-4xl text-primary tracking-tightest">
        <Link href={"/user/invites"}>SMOOU</Link>
      </div>
      <nav className="shrink-0 flex gap-2">
        {!isAnonymous && (
          <>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="underline font-semibold"
                    asChild
                  >
                    <Link href="/user/invites">{t("MYINVITES")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <NavUser />
          </>
        )}
      </nav>
    </header>
  );
}
