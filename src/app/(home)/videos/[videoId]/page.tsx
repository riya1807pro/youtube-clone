<<<<<<< HEAD
import { DEFAULT_VALUE } from "@/costant";
import { comments } from "@/db/schema";
import VideoView from "@/modules/videos/ui/components/views/videosView";
import { HydrateClient, trpc } from "@/trpc/server";
import { comment } from "postcss";

export const dynamic = "force-dynamic"

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
=======
import { DEFAULT_LIMIT } from "@/constants";
import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  void trpc.videos.getOne.prefetch({ id: videoId });
  void trpc.comments.getMany.prefetchInfinite({
    videoId: videoId,
    limit: DEFAULT_LIMIT,
  });
  void trpc.suggestions.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default Page;
>>>>>>> 9f21a4b (internal structure improvements)
