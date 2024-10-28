"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCurrentUser from "../api/useCurrentUser";
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function UserButton() {
   const { data, isLoading } = useCurrentUser();
   const { signOut } = useAuthActions();

   if (isLoading) {
      return <Loader className=" size-4 animate-spin text-muted-foreground" />;
   }
   if (!data) {
      return null;
   }
   const { name, image } = data;

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className=" outline-none relative">
            <Avatar>
               <AvatarImage src={image} />
               <AvatarFallback className=" bg-violet-500 text-white">
                  {name?.[0].toUpperCase()}

                  {/* <User /> */}
               </AvatarFallback>
            </Avatar>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="center" side="right" className=" w-60">
            <DropdownMenuItem onClick={signOut} className=" h-10">
               <LogOut className=" size-4 mr-2" />
               Sign out
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
