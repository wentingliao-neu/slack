import { cva, type VariantProps } from "class-variance-authority";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const userItemVariants = cva(
   " flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
   {
      variants: {
         variant: {
            default: "text-[#f9edffcc]",
            active: "text-[#481349] bg-white/90 hover:bg-white/90",
         },
      },
      defaultVariants: {
         variant: "default",
      },
   }
);

type Props = {
   id: Id<"members">;
   label?: string;
   image?: string;
   variant?: VariantProps<typeof userItemVariants>["variant"];
};

export default function UserItem({ id, label, image, variant }: Props) {
   const workspaceId = useWorkspaceId();
   return (
      <Button
         variant="transparent"
         className={cn(userItemVariants({ variant: variant }))}
         size="sm"
         asChild
      >
         <Link href={`/workspace/${workspaceId}/member/${id}`}>
            <Avatar className=" size-5 rounded-md mr-1">
               <AvatarImage src={image} alt={label} className=" rounded-md" />
               <AvatarFallback className=" rounded-md bg-sky-500 text-white text-xs">
                  {label?.charAt(0).toUpperCase()}
               </AvatarFallback>
            </Avatar>
            <span className=" text-sm truncate">{label}</span>
         </Link>
      </Button>
   );
}
