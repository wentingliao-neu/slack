import useCurrentMember from "@/features/members/api/useCurrentMember";
import useGetWorkspace from "@/features/workspaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import {
   AlertTriangle,
   HashIcon,
   Loader,
   MessageSquareText,
   SendHorizonal,
} from "lucide-react";
import WorkspaceHeader from "./WorkspaceHeader";
import SidebarItem from "./SidebarItem";
import useGetChannels from "@/features/channels/api/useGetChannels";
import WorkspaceSection from "./WorkspaceSection";
import useGetMembers from "@/features/members/api/useGetMembers";
import UserItem from "./UserItem";

export default function WorkspaceSidebar() {
   const workspaceId = useWorkspaceId();
   const { data: member, isLoading: memberLoading } = useCurrentMember({
      workspaceId,
   });
   const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
      id: workspaceId,
   });
   const { data: channels, isLoading: channelsLoading } = useGetChannels({
      workspaceId,
   });

   const { data: members, isLoading: membersLoading } = useGetMembers({
      workspaceId,
   });

   if (memberLoading || workspaceLoading || channelsLoading || membersLoading)
      return (
         <div className=" flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
            <Loader className=" size-5 text-white animate-spin" />
         </div>
      );
   if (!member || !workspace)
      return (
         <div className=" flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center">
            <AlertTriangle className=" size-5 text-white" />
            <p className=" text-white text-sm">Workspace not found</p>
         </div>
      );

   return (
      <div className=" flex flex-col bg-[#5e2c5f] h-full">
         <WorkspaceHeader
            workspace={workspace}
            isAdmin={member.role === "admin"}
         />
         <div className=" flex flex-col px-2 mt-3">
            <SidebarItem
               label="Threads"
               icon={MessageSquareText}
               id="threads"
               variant="active"
            />
            <SidebarItem
               label="Drafts & Sent"
               icon={SendHorizonal}
               id="drafts"
            />
         </div>
         <WorkspaceSection label="Channels" hint="New channel" onNew={() => {}}>
            {channels?.map((c) => (
               <SidebarItem
                  key={c._id}
                  icon={HashIcon}
                  label={c.name}
                  id={c._id}
               />
            ))}
         </WorkspaceSection>
         <WorkspaceSection
            label="Direct Messages"
            hint="New direct message"
            onNew={() => {}}
         >
            {members?.map((m) => (
               <UserItem
                  key={m?._id}
                  id={m?._id}
                  label={m.user.name}
                  image={m.user.image}
               />
            ))}
         </WorkspaceSection>
      </div>
   );
}
