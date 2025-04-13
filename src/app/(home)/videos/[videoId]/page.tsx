import { DEFAULT_VALUE } from "@/costant";
import { comments } from "@/db/schema";
import VideoView from "@/modules/videos/ui/components/views/videosView";
import { HydrateClient, trpc } from "@/trpc/server";
import { comment } from "postcss";

interface PageProps{
    params: Promise<{
        videoId: string;
    }>
}
const Page =  async({params}: PageProps)=>{
    const {videoId} = await params
     void trpc.videos.getOne.prefetch({ id : videoId})
    //  don't forget to prefetchInfinite
     void trpc.comments.getMany.prefetchInfinite({valueId: videoId, limit: DEFAULT_VALUE, parentId: comments.parentId.name})
     void trpc.Suggestion.getMany.prefetchInfinite({videoId, limit: DEFAULT_VALUE})
    return (
        <HydrateClient>
            <VideoView videoId={videoId} />
        </HydrateClient>
    )
}
export default Page;