import { Avatar } from "@/components/ui/avatar";
import { UserAvatar } from "@/components/user-Avatar";
import { CommentsGetManyOutputs } from "@/modules/commnets/types";
import { trpc } from "@/trpc/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface CommentItemProps{
    comment : CommentsGetManyOutputs["items"][number];
}

export const CommentsItem =({comment}: CommentItemProps)=>{
    const  {userId} = useAuth();
    const utils = trpc.useUtils();
    const clerk = useClerk();

    const remove = trpc.comments.remove.useMutation({
        onSuccess:()=>{
            toast.success("Comment deleted");
            utils.comments.getMany.invalidate({valueId: comment.videoId})
        },
        onError :(error)=>{
            toast.error("Something went wrong!");

            {(error.data?.code === "UNAUTHORIZED")&& clerk.openSignIn()}
        }
    });
    return(
        <div>
            <div className="flex gap-4">
                <Link href={`/users/${comment.userId}`}>
                   <UserAvatar
                     size="lg"
                     imageURL={comment.user.imageUrl}
                     name={comment.user.name}
                   />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/users/${comment.userId}`}>
                     <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm pb-0.5" >
                            {comment.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(comment.createdAt,{
                                addSuffix: true,
                            })}
                        </span>
                     </div>
                  </Link>
                  <p className="text-sm">{comment.values}</p>
                  {/* TODO: REACTIONS */}
                </div>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreVerticalIcon/>
                        </Button>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={()=>{}}>
                                <MessageSquareIcon className="size-4"/>
                                Reply
                            </DropdownMenuItem>
                            {comment.user.clerk_Id === userId && (

                             <DropdownMenuItem onClick={()=>remove.mutate({id: comment.id})}>
                                <Trash2Icon className="size-4"/>
                                Delete
                            </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </div>
        </div>
    )
}