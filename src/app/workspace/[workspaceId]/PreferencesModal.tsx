import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useMutateWorkspace from "@/features/workspaces/api/useMutateWorkspace";
import useConfirm from "@/hooks/useConfirm";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
   open: boolean;
   setOpen: (open: boolean) => void;
   initialValue: string;
}
export default function PreferencesModal({
   open,
   setOpen,
   initialValue,
}: Props) {
   const workspaceId = useWorkspaceId();
   const router = useRouter();
   const [value, setValue] = useState(initialValue);
   const [editOpen, setEditOpen] = useState(false);

   const [ConfirmDialog, confirm] = useConfirm(
      "Delete workspace",
      "Are you sure you want to delete this workspace?"
   );
   const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
      useMutateWorkspace({ mutationType: "update" });
   //useUpdateWorkspace();

   const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
      useMutateWorkspace({ mutationType: "remove" });
   //useRemoveWorkspace();

   const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await updateWorkspace(
         { id: workspaceId, name: value },
         {
            onSuccess: () => {
               toast.success("Workspace updated successfully");
               setEditOpen(false);
            },
            onError: () => {
               toast.error("Failed to update workspace");
            },
         }
      );
      setEditOpen(false);
   };

   async function handleRemove() {
      const confirmed = await confirm();
      if (!confirmed) return;
      removeWorkspace(
         { id: workspaceId, name: value },
         {
            onSuccess: () => {
               router.replace("/");
               toast.success("Workspace removed successfully");
               setOpen(false);
            },
            onError: () => {
               toast.error("Failed to remove workspace");
            },
         }
      );
   }
   return (
      <>
         <ConfirmDialog />
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className=" p-0 bg-gray-50 overflow-hidden">
               <DialogHeader className=" p-4 border-b bg-white">
                  <DialogTitle>{value}</DialogTitle>
               </DialogHeader>
               <div className=" px-4 pb-4 flex flex-col gap-y-2">
                  <Dialog open={editOpen} onOpenChange={setEditOpen}>
                     <DialogTrigger asChild>
                        <div className=" px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                           <div className=" flex items-center justify-between">
                              <p className=" text-sm font-semibold">
                                 Workspace name
                              </p>
                              <p className=" text-sm text-[#1264a3] hover:underline font-semibold">
                                 Edit
                              </p>
                           </div>
                           <p className=" text-sm">{value}</p>
                        </div>
                     </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Rename this workspace</DialogTitle>
                        </DialogHeader>
                        <form className=" space-y-4" onSubmit={handleEdit}>
                           <Input
                              value={value}
                              disabled={isUpdatingWorkspace}
                              onChange={(e) => setValue(e.target.value)}
                              required
                              autoFocus
                              minLength={3}
                              maxLength={80}
                              placeholder="Workspace name"
                           />
                           <DialogFooter>
                              <DialogClose asChild>
                                 <Button
                                    variant="outline"
                                    disabled={isUpdatingWorkspace}
                                 >
                                    Cancel
                                 </Button>
                              </DialogClose>{" "}
                              <Button disabled={isUpdatingWorkspace}>
                                 Save
                              </Button>
                           </DialogFooter>
                        </form>
                     </DialogContent>
                  </Dialog>
                  <button
                     disabled={isRemovingWorkspace}
                     onClick={handleRemove}
                     className=" flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
                  >
                     <TrashIcon className=" size-4 " />
                     <p className=" text-sm font-semibold">Delete workspace</p>
                  </button>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
