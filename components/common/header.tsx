"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import NavUser from "./nav-user";

export function Header() {
  const { data: session } = authClient.useSession();
  const isAnonymous = session?.user.isAnonymous;
  return (
    <header className="flex justify-between items-center w-full px-4 py-2 border-b mb-4 bg-background ">
      <div className="shrink-0 font-bagel text-4xl text-primary tracking-tightest">
        <Link href={"/user/invites"}>SMOOU</Link>
      </div>
      <nav className="shrink-0 flex gap-2">
        {!isAnonymous && (
          <>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/user/invites">my invites</Link>
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
