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
import { ChevronDownIcon, ChevronUpIcon, MessageSquareIcon, MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon, Trash2Icon } from "lucide-react";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CommentForm } from "../comment-form";
import { comments } from "@/db/schema";
import { CommentReplies } from "../comment-replies";

interface CommentItemProps{
    comment : CommentsGetManyOutputs["items"][number];
    variant?: "reply" | "comment";
}

export const CommentsItem =({comment, variant='comment'}: CommentItemProps)=>{

    const[isReplyOpen, setIsReplyOpen] = useState(false);
    const[isRepliesOpen, setIsRepliesOpen] = useState(false);

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

    const like = trpc.CommentReaction.like.useMutation({
        onSuccess:()=>{
            utils.comments.getMany.invalidate({valueId: comment.videoId})
        },
        onError:(error)=>{
            toast.error("Something went wrong!");

            if(error.data?.code === "UNAUTHORIZED"){
                clerk.openSignIn();
            }
        }
    })
    const dislike = trpc.CommentReaction.dislike.useMutation({
        onSuccess:()=>{
            utils.comments.getMany.invalidate({valueId: comment.videoId})
        },
        onError:(error)=>{
            toast.error("Something went wrong!");

            if(error.data?.code === "UNAUTHORIZED"){
                clerk.openSignIn();
            }
        }
    })

    return(
        <div>
            <div className="flex gap-4">
                <Link href={`/users/${comment.userId}`}>
                   <UserAvatar
                     size={variant === "comment" ? "lg" : "sm"} 
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
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                        <Button
                          disabled={like.isPending}
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={()=>like.mutate({commentId: comment.id})}
                        >
                            <ThumbsUpIcon className={cn(
                                comment.viewerReaction === "like" && "fill-black"
                            )}/>
                        </Button>
                        <span className="text-xs text-muted-foreground">
                           {comment.likeCount}
                        </span>
                        <Button
                          disabled={dislike.isPending}
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={()=>dislike.mutate({commentId: comment.id})}
                        >
                            <ThumbsDownIcon className={cn(
                                comment.viewerReaction === "dislike" && "fill-black"

                            )}/>
                        </Button>
                        <span className="text-xs text-muted-foreground">
                           {comment.dislikeCount}
                        </span>
                    </div>
                    {variant === "comment" && (
                        <Button 
                           variant="ghost"
                           size="sm"
                           className="h-8"
                           onClick={()=>setIsReplyOpen(true)}
                        >
                            Reply
                        </Button>
                    )}
                </div>
                </div>
                {comment.user.clerk_Id !== userId && variant === "reply" && (

                    <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreVerticalIcon/>
                        </Button>
                        <DropdownMenuContent align="end">
                               <DropdownMenuItem onClick={()=>setIsReplyOpen(true) }>
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
                            ) }
            </div>
            {isReplyOpen && variant === "comment" && (
                <div className="mt-4 pl-14">
                    <CommentForm
                       variant="reply"
                       parentId={comment.id}
                       videoId={comment.videoId}
                       onCancel={()=>setIsReplyOpen(false)}
                       onSuccess={()=>{
                        setIsReplyOpen(false)
                        setIsRepliesOpen(true)
                       }}
                    />
                </div>
            )}
            {comment.replyCount< 0 && variant === "comment" && (
                <div className="pl-14">
                    <Button
                    variant="tertiary"
                      size="sm"
                      onClick={()=>
                        setIsRepliesOpen((current)=>!current)
                      }
                    >
                        {isRepliesOpen ? <ChevronUpIcon/> :<ChevronDownIcon/> }
                        {comment.replyCount} replies
                    </Button>
                </div>
            )}
            {comment.replyCount > 0 &&variant === "comment" && isRepliesOpen&& (
                <CommentReplies
                  parentId={comment.id}
                  videoId={comment.videoId}
                />
            ) } 
        </div>
    )
}