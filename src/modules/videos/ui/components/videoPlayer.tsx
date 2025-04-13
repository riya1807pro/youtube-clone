import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export const VideoPlayerSkeleton = () => {
  return <div className="aspect-video bg-black rounded-xl" />;
};

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) => {
  if (!playbackId) return null;

  return (
<MuxPlayer
  playbackId={playbackId}
  poster={thumbnailUrl || undefined}
  autoPlay={autoPlay}
  muted
  className="w-full h-full object-content"
  accentColor="#FF2056"
  onPlay={onPlay}
/>
  );
};
