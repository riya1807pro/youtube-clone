import { CommentsSection } from "../sections/comment-section"
import { SuggestionSection } from "../sections/suggestion-section"
import VideoSection from "../sections/videoSection"

interface videoViewProps{
    videoId: string
}
const VideoView = ({videoId}: videoViewProps)=>{
    return (
       <div className="flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10">
        <div className="flex flex-cols xl:flex-rows gap-6">
            <div className="flex-1 min-w-0">
                <VideoSection videoId={videoId}/>
                <div className="xl:hidden block mt-4">
                    <SuggestionSection />
                </div>
                <CommentsSection videoId={videoId}/>
                </div>
                <div className="hidden xl:block w-full xl:[380px] 2xl:w-[460px] shrink-1">
                    <SuggestionSection/>
                </div>
            </div>
        </div>
    )
}
export default VideoView