<<<<<<< HEAD
import { VideoViews } from "@/modules/studio/ui/views/video-views";
import { HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
    params: { videoId: string };
}

const dynamic = "force-dynamic";

const Page = async ({ params }: PageProps) => {
    const { videoId } = await params; // Extract videoId directly from params
    // Ensure videoId is available
    if (!videoId) {
      return <p>No video ID available</p>;
    }
   

    return (
        <HydrateClient>
            <VideoViews videoId={videoId} />
        </HydrateClient>
    );
=======
import { VideoView } from "@/modules/studio/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  void trpc.studio.getOne.prefetch({ id: videoId });
  void trpc.categories.getMany.prefetch();
  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
>>>>>>> 9f21a4b (internal structure improvements)
};

export default Page;
