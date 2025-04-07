'use client'
import { cn } from "@/lib/utils"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { VideoPlayer } from "../videoPlayer"
import {VideoBanner} from "../video-banner"
import VideoTopRow from "../videoTopRow"
import { useAuth } from "@clerk/nextjs"

interface VideoSectionProps{
    videoId: string
}

export const VideoSection = ({videoId}: VideoSectionProps) => {
    return(
        <Suspense fallback={<p>Loading/....</p>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <VideoSectionSuspense videoId={videoId}/>
            </ErrorBoundary>
        </Suspense>
    )
}

const VideoSectionSuspense = ({videoId}: VideoSectionProps)=>{
    const {isSignedIn} = useAuth()
    const [video] = trpc.videos.getOne.useSuspenseQuery({id:videoId})
    const utils = trpc.useUtils();
    const createView = trpc.VideoViews.create.useMutation({
        onSuccess: ()=>{
            utils.videos.getOne.invalidate({id : videoId})
        }
    });

    const handlePlay =  () => {
        if(!isSignedIn) return;

        createView.mutate({videoId})
    }

   return(
    <>
    <div className={cn(
        "aspect-video bg-black rounded-xl overflow-hidden relative",
        video.muxStatus!=="ready" && "rounded-b-none"
    )}>
       <VideoPlayer 
       autoPlay
       onPlay={()=>{handlePlay}}
       playbackId={video.muxPlaybackId}
       thumbnailUrl={video.thumbnailUrl}
       />
    </div>
    <VideoBanner status={video.muxStatus}/>
    <VideoTopRow video={video}/>
       </>
   )
}
export default VideoSection