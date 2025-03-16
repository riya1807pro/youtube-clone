import { PlaybackIDs } from "@mux/mux-node/resources/video/playback-ids.mjs"
import {MuxPlayer} from "@mux/mux-player-react"

interface VideoPlayerProps {
    playbackId? : string|null| undefined
    thumbnailUrl?: string|null | undefined
    autoPlay? : boolean
    onPlay?: ()=> void
}

export const VideoPlayer = ({
    playbackId,
    thumbnailUrl,
    autoPlay,
    onPlay
}:VideoPlayerProps)=>{
    if(!playbackId) return null ;

    return (
        <MuxPlayer
        playbackId={playbackId}
        thumbnailUrl={thumbnailUrl}
        playerInitTime={0}
        autoPlay={autoPlay}
        thumbnailTime={0}
        className='w-full h-full object-content'
        accentColor="#FF2056"
        onPlay={onPlay}
        />
    )
}