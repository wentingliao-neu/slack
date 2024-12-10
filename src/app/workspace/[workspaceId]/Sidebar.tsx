import UserButton from "@/features/auth/components/UserButton";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import SidebarButton from "./SidebarButton";
import { Bell, Home, MessageSquare, MoreHorizontal } from "lucide-react";

const options = [
   { icon: Home, label: "Home" },
   { icon: MessageSquare, label: "DMs" },
   { icon: Bell, label: "Activity" },
   { icon: MoreHorizontal, label: "More" },
];

export default function Sidebar() {
   return (
      <aside className=" w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-9 pb-4">
         <WorkspaceSwitcher />
         {options.map((option) => (
            <SidebarButton
               key={option.label}
               icon={option.icon}
               label={option.label}
               isActive={false}
            />
         ))}
         {/* <SidebarButton icon={Home} label="Home" isActive /> */}
         <div className=" flex flex-col items-center justify-center mt-auto gap-y-1">
            <UserButton />
         </div>
      </aside>
   );
}
