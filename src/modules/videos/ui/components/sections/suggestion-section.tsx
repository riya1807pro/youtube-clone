"use client"

import { DEFAULT_VALUE } from "@/costant";
import { trpc } from "@/trpc/client";
import { VideoRowCard, VideoRowCardSkeleton } from "../video-row-card";
import { VideoGridCard, VideoGridCardSkeleton } from "../video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SuggestionSectionProps{
    videoId: string;
    isManual ?: boolean
}

export const SuggestionSection = ({
    videoId,
    isManual
}:SuggestionSectionProps) =>{
    return(
        <Suspense fallback={<p>Loading...</p>}>
            <ErrorBoundary fallback={<p>Error.....</p>}>
                <SuggestionSectionSuspense videoId={videoId} isManual={isManual} />
            </ErrorBoundary>
        </Suspense>
    )
}
const SuggestionSectionSkelton = ()=>{
    return(
        <>
            <div className="hide md:block space-y-3">
                 {Array.from({length: 6}).map((_, index)=>(
                     <VideoRowCardSkeleton key={index} size="compact"  />
                    ))}
            </div>
            <div className="hide md:block space-y-3">
                 {Array.from({length: 6}).map((_, index)=>(
                     <VideoGridCardSkeleton key={index} />
                    ))}
            </div>
        </>
    )
}

const SuggestionSectionSuspense =(
    {videoId, isManual}:SuggestionSectionProps
) =>{
    const [Suggestions,query] = trpc.Suggestion.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit: DEFAULT_VALUE,
    },{
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    }) 
    return(
        <>
        <div className="hidden md:block space-y-3">
         {Suggestions.pages.flatMap((page)=>page.items.map((video)=>(
            <VideoRowCard 
              key={video.id}
              data={video}
              size="compact"
            />
        )))}
        </div>
        <div className="block md:hidden space-y-10">
        {Suggestions.pages.flatMap((page)=>page.items.map((video)=>(
            <VideoGridCard
              key={video.id}
              data={video}
            />
        )))}
        </div>
        <InfiniteScroll
        isManual
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          fetchNextPage={query.fetchNextPage}
        />
        </>
    )
}