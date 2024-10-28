"use client";

import useGetWorkspace from "@/features/workspaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export default function Page() {
   const workspaceId = useWorkspaceId();
   const { data } = useGetWorkspace({ id: workspaceId });

   return <div></div>;
}
