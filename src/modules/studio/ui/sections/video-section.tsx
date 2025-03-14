'use client'

import { InfiniteScroll } from "@/components/infinite-scroll";
import { Table, TableHeader,TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { DEFAULT_VALUE } from "@/costant";
import { snakeCaseToTitle } from "@/lib/utils";
import { VideoThumbnail } from "@/modules/videos/ui/components/thumbnial";
import { trpc } from "@/trpc/client"
import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const VideoSection = ()=>{
    return(
        <Suspense fallback={<p>loading...</p>}>
        <ErrorBoundary fallback={<p>Error</p>}>
        <VideoSectionSuspense/>
        </ErrorBoundary>
        </Suspense>
    )
}

const VideoSectionSuspense = ()=>{
    const [videos,query] = trpc.studio.getMany.useSuspenseInfiniteQuery({
        limit: DEFAULT_VALUE
    },{
        getNextPageParam: (lastPage)=> lastPage.next_cursor
    });
    return <div>
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-6 w-[510px]">Video</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                        <TableHead className="text-right">Comments</TableHead>
                        <TableHead className="text-right pr-6">Likes</TableHead>
                    </TableRow>
                </TableHeader>
<TableBody>
    {videos.pages.flatMap((page)=>page.items).map((video)=>(
        <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
            <TableRow className="cursor-pointer">
                <TableCell>
           <div className="flex items-center gap-4">
            <div className="relative aspect-video w-36 shrink-0">
            <VideoThumbnail imageUrl={video.thumbnailUrl} 
            title={video.title}
            previewUrl = {video.previewUrl}
            duration={video.duration || 0}
            />
            </div>
            <div className="flex flex-col overflow-hidden gap-y-1">
                <span className="text-sm line-clamp-1">{video.title}</span>
                <span className="text-xs line-clamp-1 text-foreground-muted">{video.discription||"no discription"}</span>
            </div>
           </div>
                </TableCell>
                <TableCell>
             <div className="flex">
                {video.visibility === "private"?
            <LockIcon className="size-2 mr-2" />:
            <Globe2Icon className="size-2 mr-2"/>    
            }
            {snakeCaseToTitle(video.visibility)}
             </div>
                </TableCell>
                <TableCell className="flex items-center">
        {snakeCaseToTitle(video.muxStatus||"error")}
                </TableCell>
                <TableCell className="text-sm truncated ">
              {format(new Date(video.createdAt),"d MMM yyyy")}
                </TableCell>
                <TableCell>
              Views
                </TableCell>
                <TableCell>
              Comments
                </TableCell>
                <TableCell>
              Likes
                </TableCell>
            </TableRow>
        </Link>
    ))}
</TableBody>
            </Table>    
        </div>
 {
    JSON.stringify(videos)
}
<InfiniteScroll 
isManual
hasNextPage={query.hasNextPage}
isFetchingNextPage={query.isFetchingNextPage}
fetchNextPage={query.fetchNextPage}
/>
    </div>
}