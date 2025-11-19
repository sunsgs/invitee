"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import NavUser from "./nav-user";

export function Header() {
  return (
    <header className="flex justify-between items-center w-full px-4 py-2 border-b mb-8 bg-card ">
      <div className="shrink-0 font-bagel text-4xl text-primary tracking-tightest">
        <Link href={"/user/invites"}>SMOOU</Link>
      </div>
      <nav className="shrink-0 flex gap-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="#">my invites</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavUser />
      </nav>
    </header>
  );
}
