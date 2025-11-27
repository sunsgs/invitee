"use client";

import { authClient, signOut } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function NavUser() {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };
  const { data: session } = authClient.useSession();

  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          {user?.image && <AvatarImage src={user?.image} alt={user?.name} />}
          <AvatarFallback className="bg-accent rounded-lg text-xs">
            {getInitials(user?.name || "")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 w-[220]" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col py-2 gap-1">
            <p className=" font-semibold leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer py-4 rounded-none font-medium"
            onClick={() => router.push("/user/profile")}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem
          className="cursor-pointer py-4 rounded-none text-primary font-medium"
          onClick={handleSignOut}
        >
          <LogOut className="text-primary mr-2 h-4 w-4" />
          <span>Log out </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
