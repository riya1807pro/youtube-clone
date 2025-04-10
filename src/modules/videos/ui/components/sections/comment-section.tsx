'use client'

import { CommentForm } from "@/modules/commnets/ui/comments/comment-form";
import { CommentsItem } from "@/modules/commnets/ui/comments/components/comment-item";
import { trpc } from "@/trpc/client";
import { comment } from "postcss";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentSectionProps{
    videoId: string;
}

export const CommentsSection = ({ videoId }: CommentSectionProps) => {
    return (
        <Suspense fallback={<p>Loading....</p>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <CommentSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
};

const CommentSectionSuspense =({videoId}:CommentSectionProps) =>{
    const [comments] =  trpc.comments.getMany.useSuspenseQuery({valueId: videoId})

    return(
        <div className="mt-6">
            <div className="flex flex-col gap-6">
                <h1>0 comments</h1>
                <CommentForm videoId={videoId}/>
         <div className="flex flex-col mt-2 gap-4">
            {comments.map((comment)=>(
                <CommentsItem
                   key={comment.id}
                   comment={comment}
                />
            ))}
         </div>
            </div>
        </div>
    )
}