"use client"

import { DEFAULT_VALUE } from "@/costant";
import { trpc } from "@/trpc/client";
import { VideoRowCard } from "../video-row-card";
import { VideoGridCard } from "../video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface SuggestionSectionProps{
    videoId: string;
    isManual ?: boolean
}

export const SuggestionSection =(
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