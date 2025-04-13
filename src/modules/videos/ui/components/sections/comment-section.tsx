'use client'

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_VALUE } from "@/costant";
import { CommentForm } from "@/modules/commnets/ui/comments/comment-form";
import { CommentsItem } from "@/modules/commnets/ui/comments/components/comment-item";
import { trpc } from "@/trpc/client";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentSectionProps{
    videoId: string;
}

export const CommentsSection = ({ videoId }: CommentSectionProps) => {
    return (
        <Suspense fallback={<CommentSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <CommentSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
};
const CommentSectionSkeleton = ()=>{
    return(
        <div className="mt-6 flex justify-center items-center">
            <Loader2Icon className="text-muted-foreground size-7 animate-spin"/>
        </div>
    )
}

const CommentSectionSuspense =({videoId}:CommentSectionProps) =>{
    const [comments,query] =  trpc.comments.getMany.useSuspenseInfiniteQuery({
        valueId: videoId,
        limit: DEFAULT_VALUE,
        parentId: videoId // Assuming videoId can be used as parentId
    },  {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      })

    return(
        <div className="mt-6">
            <div className="flex flex-col gap-6">
                
            <h1 className="text-xl font-bold">
  {comments.pages[0]?.totalCount ?? 0} comments
</h1>


                <CommentForm videoId={videoId}/>
         <div className="flex flex-col mt-2 gap-4">
       
         {comments.pages
              .flatMap((page) => page.items)
              .map((comment) => (
                  <CommentsItem
                  key={comment.id}
                  comment={comment}
                  />
                ))}
            <InfiniteScroll 
            isManual
               hasNextPage={query.hasNextPage}
               isFetchingNextPage={query.isFetchingNextPage}
               fetchNextPage={query.fetchNextPage}
            />
         </div>
            </div>
        </div>
    )
}