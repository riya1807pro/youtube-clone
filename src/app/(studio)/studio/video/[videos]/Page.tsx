import { VideoViews } from "@/modules/studio/ui/views/video-views";
import { HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
    params: Promise<{videoId : string}>
}
const dynamic = "force-dynamic"
const Page = async({
    params
}:PageProps)=>{
const {videoId} = await params;

void trpc.studio.getOne.prefetch({ id : videoId })
void trpc.categories.getMany.prefetch()
    return (
   <HydrateClient>
    <VideoViews videoId={videoId} />
   </HydrateClient>
    )
}