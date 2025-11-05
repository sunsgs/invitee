"use client";

import { signOut } from "@/lib/auth-client";
import { LogOut, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function NavUser() {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="mr-4">
        {/* <DropdownMenuLabel>My profile</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem className="cursor-pointer">
          <User2 />
          <a href="/admin/user/profile">My profile</a>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <LogOut />
          <a onClick={handleSignOut}>Signout</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
