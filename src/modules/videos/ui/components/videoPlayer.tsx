import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export const VideoPlayerSkeleton = () => {
  return <div className="aspect-video bg-black rounded-xl"/>
}

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) => {
  if (!playbackId) return null;

  return (
    <MuxPlayer
      playback-id={playbackId} // Corrected prop name
      poster={thumbnailUrl || undefined} // Using "poster" instead of "thumbnailUrl"
      autoPlay={autoPlay}
      className="w-full h-full object-content"
      accentColor="#FF2056"
      onPlay={onPlay}
    />
  );
};
