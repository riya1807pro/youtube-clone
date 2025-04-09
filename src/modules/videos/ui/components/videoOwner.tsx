import Link from "next/link";
import { VideoGetOneOutput } from "../../types";
import { UserAvatar } from "@/components/user-Avatar";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SubscriptionButton } from "@/modules/subscription/ui/componnent.subscription-button";
import { UserInfo } from "@/modules/user/ui/component/user-info";
import { useSubscription } from "@/modules/subscription/hooks/use-subscription";

interface VideoOwnerProps{
    user: VideoGetOneOutput["users"]    ,
    videoId: string
}

export const VideoOwner = ({user,videoId}:VideoOwnerProps)=>{
    const {userId: clerkUserId,isLoaded} = useAuth();
    const {isPending, onclick} = useSubscription({
        userId: user.id,
        isSubscribed: user.viewerSubscribed,
        fromVideoId: videoId,
    })
    return(
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
            <Link href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
            <UserAvatar size="lg" imageURL={user.imageUrl} name={user.name} />
            <div className="flex flex-col gap-1 min-w-0">
            <UserInfo size="lg" name={user.name}/>
            <span className="text-sm text-muted-foreground line-clamp-1">
                {user.subscriberCount} subscribers
            </span>
            </div>
        </div>
        </Link>
        {clerkUserId === user.clerk_Id} ? (
            <Button variant="secondary" className="rounded-full " asChild> 
                <Link href={`/studio/videos/${videoId}`}>
                Edit video
                </Link>
            </Button>
        ):(
            <SubscriptionButton 
            onClick={onclick}
            disabled={isPending || !isLoaded}
            isSubscribed={user.viewerSubscribed}
            className="flex-none"
            />
        )
        </div>
    )
}