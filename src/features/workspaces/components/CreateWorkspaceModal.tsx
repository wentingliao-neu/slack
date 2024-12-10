"use client";

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import useCreateWorkspaceModal from "../store/useCreateWorkspaceModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useMutateWorkspace from "../api/useMutateWorkspace";

export default function CreateWorkspaceModal() {
   const [open, setOpen] = useCreateWorkspaceModal();
   const [name, setName] = useState("");
   const router = useRouter();
   const { mutate, isPending } = useMutateWorkspace({ mutationType: "create" }); //useCreateWorkspace();
   const handleClose = () => {
      setOpen(false);
      setName("");
   };
   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await mutate(
         { name },
         {
            onSuccess(id) {
               router.push(`/workspace/${id}`);
               toast.success("Workspace created successfully");
            },
            onError: handleClose,
            onSettled: handleClose,
         }
      );
   };
   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Add a workspace</DialogTitle>
            </DialogHeader>
            <form className=" space-y-4" onSubmit={handleSubmit}>
               <Input
                  value={name}
                  disabled={isPending}
                  required
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  minLength={3}
                  placeholder="Workspace name e.g. 'work', 'personal' or 'home'"
               />
               <div className=" flex justify-end">
                  <Button type="submit">Create</Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
