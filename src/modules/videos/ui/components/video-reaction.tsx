import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { VideoGetOneOutput } from "../../types"
import { trpc } from "@/trpc/client"
import { useClerk } from "@clerk/nextjs"
import { toast } from "sonner"

interface VideoReactionProps{
    videoId: string,
    likes: number,
    dislike: number,
    viewerReaction: VideoGetOneOutput["ViewerReaction"]
}
// properly implement video reactions
export const VideoReaction = ({
    videoId,
    likes,
    dislike,
    viewerReaction
}:VideoReactionProps) => {
    const clerk = useClerk();
    const utils = trpc.useUtils();
    const like = trpc.VideoReaction.like.useMutation({
        onSuccess : ()=> {
            utils.videos.getOne.invalidate({id: videoId})
            // todo : invalidate " liked" playlist
        },
        onError: (error) =>{
            toast.error("Something went wrong");
            if (error.data?.code === "UNAUTHORIZED") {
                toast.error("You are not authorized to perform this action.");
            }
        }
    })
    const dislikes = trpc.VideoReaction.dislike.useMutation()
    return(
        <div className="flex items-center flex-none">
            <Button 
            className="rounded-l-full rounded-r-none gap-2 pr-4"
            variant="secondary"
            disabled={like.isPending|| dislikes.isPending }
            onClick={()=>{like.mutate({videoId})}}
            >
                <ThumbsUpIcon className={cn("size-5 ", viewerReaction === "like" && "fill-black")}/>
              {likes}
            </Button>
            <Separator orientation="vertical" className="h-7"/>
            <Button 
            className="rounded-l-full rounded-r-none gap-2 pr-4"
            variant="secondary"
            disabled={like.isPending|| dislikes.isPending }
            onClick={()=>{dislikes.mutate({videoId})}}
            >
                <ThumbsDownIcon className={cn("size-5 ", viewerReaction === "dislike" && "fill-black")}/>
                {dislike}
            </Button>
        </div>
    )
}