import { VideoViews } from "@/modules/studio/ui/views/video-views";
import { HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
    params: { videoId: string };
}

const dynamic = "force-dynamic";

const Page = async ({ params }: PageProps) => {
    const { videoId } = params; // Extract videoId directly from params
    // Ensure videoId is available
    if (!videoId) {
      return <p>No video ID available</p>;
    }
   

    return (
        <HydrateClient>
            <VideoViews videoId={videoId} />
        </HydrateClient>
    );
};

export default Page;
