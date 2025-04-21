"use client"

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_VALUE } from "@/costant";
import { useIsMobile } from "@/hooks/use-mobile";
import { VideoGridCard } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";

interface ResultSectionProps{
    query: string| undefined;
    categoryId: string| undefined;
}

export const ResultSection = ({
    query,
    categoryId
}:ResultSectionProps) =>{
    const isMobile = useIsMobile();
    const [Results, ResultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
        {query, categoryId, limit: DEFAULT_VALUE},
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor
        }
    )

    return (
       <>
       {isMobile? (
        <div className="flex flex-col gap-4 gap-y-10">
            {
                Results.pages.flatMap((page)=>page.items).map((video)=>(
                    <VideoGridCard key={video.id} data={video}/>
                ))
            }
        </div>
       ):(
        <div className="flex flex-col gap-4">
             {
                Results.pages.flatMap((page)=>page.items).map((video)=>(
                    <VideoRowCard key={video.id} data={video}/>
                ))
            }
        </div>
       )}
       <InfiniteScroll
         hasNextPage={ResultQuery.hasNextPage}
         isFetchingNextPage={ResultQuery.isFetchingNextPage}
         fetchNextPage={ResultQuery.fetchNextPage}
       />
       </>
    )
}