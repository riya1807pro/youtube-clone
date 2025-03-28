import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "../../constant";

interface VideoThumbnailProps {
  imageUrl?: string | null;
  previewUrl?: string | null;
  title: string;
  duration: number;
}

export const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) => {
  console.log("imageUrl:", imageUrl);
  console.log("previewUrl:", previewUrl);

  return (
    <div className="relative group">
      {/* Thumbnail wrapper */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={imageUrl ?? THUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="h-full group-hover:opacity-0 object-cover w-full transition-opacity"
        />
        {previewUrl && (
          <Image
            unoptimized
            src={previewUrl}
            alt={title}
            fill
            className="h-full group-hover:opacity-100 opacity-0 object-cover w-full transition-opacity"
          />
        )}
      </div>
      {/* Video duration */}
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-xs text-white font-medium">
        {formatDuration(duration)}
      </div>
    </div>
  );
};
