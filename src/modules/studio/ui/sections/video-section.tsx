'use client'

import { InfiniteScroll } from "@/components/infinite-scroll";
import { Table, TableHeader,TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { DEFAULT_VALUE } from "@/costant";
import { videos } from "@/db/schema";
import { trpc } from "@/trpc/client"
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
                    {video.title}
                </TableCell>
                <TableCell>
              Visibility
                </TableCell>
                <TableCell>
              Status
                </TableCell>
                <TableCell>
              Date
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