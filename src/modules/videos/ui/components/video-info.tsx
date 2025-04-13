import { useMemo } from "react"
import { VideoGetManyOutput } from "../../types"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { UserAvatar } from "@/components/user-Avatar"
import { UserIcon } from "lucide-react"
import { UserInfo } from "@/modules/user/ui/component/user-info"
import { VideoMenu } from "./vide-menu"

interface VideoInfoProps {
    data: VideoGetManyOutput["items"][number]
    onRemove?: () => void
}

export const VideoInfo = ({
    data,
    onRemove
}:VideoInfoProps) =>{
        const compactViews = useMemo(()=>{
            return Intl.NumberFormat("en",{
                notation:"compact"
            }).format(data.viewCount)
        },[data.viewCount])
        const compactDate = useMemo(()=>{
            return formatDistanceToNow(data.createdAt, {addSuffix: true})
        },[data.viewCount])

        return(
            <div className="flex gap-3">
                <Link href={`/users/${data.user.id}`}>
                   <UserAvatar imageURL={data.user.imageUrl}  name={data.user.name} />
                </Link>
                <div className="min-w-0 flex-1">
                    <Link href={`/videos/${data.id}`}>
                    <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
                        {data.title}
                    </h3>
                    </Link>
                    <Link href={`/videos/${data.id}`}>
                   <UserInfo name={data.user.name} />
                    </Link>
                    <Link href={`/videos/${data.id}`}>
                    <p className="text-sm text-green-600 line-clamp-1">
                    {compactViews} views • {compactDate}
                    </p>
                    </Link>
                </div>
                <div className="flex-shrink-0">                    
                <VideoMenu videoId={data.id} onRemove={onRemove} />
                </div>
            </div>
        )
    }