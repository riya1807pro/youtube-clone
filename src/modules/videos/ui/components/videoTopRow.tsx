import { useMemo } from "react";
import { VideoGetOneOutput } from "../../types";
import { VideoDescrioption } from "./vide-discription";
import { VideoMenu } from "./vide-menu";
import { VideoReaction } from "./video-reaction";
import { VideoOwner } from "./videoOwner";
import { formatDistanceToNow , format } from "date-fns";

interface VideoTopRow{
    video: VideoGetOneOutput;
}
const VideoTopRow = ({video}: VideoTopRow) =>{
    const compactViews = useMemo(()=>{
        return(Intl.NumberFormat("en",{
            notation: "compact"
        }).format(video.viewCounts))
    },[video.viewCounts])
    const expendedViews = useMemo(()=>{
        return(Intl.NumberFormat("en",{
            notation: "standard"
        }).format(video.viewCounts ))
    },[video.viewCounts])
    const compactDate = useMemo(()=>{
        return formatDistanceToNow(video.createdAt,{addSuffix: true})
    },[video.createdAt])
    const expendedDate = useMemo(()=>{
        return format(video.createdAt,"d MMM yyyy")
    },[video.createdAt])
    return(
        <div className="flex  flex-col gap-4  mt-4">
            <h1 className="text-xl font-semibold">{video.title}</h1>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <VideoOwner user={video.users} videoId={video.id}/>
                <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end
                sm:overflow-visible pb-2 -mb-2 sm:pb-2 sm:mb-0 gap-2">
                    <VideoReaction />
                    <VideoMenu videoId={video.id} variant="secondary" />
                </div>
            </div>
            <VideoDescrioption 
            compactViews={compactViews}
            expendedViews={expendedViews}
            compactDate={compactDate}
            expendedDate={expendedDate}
            description={video.discription}

            />
        </div>
    )
}
export default VideoTopRow;