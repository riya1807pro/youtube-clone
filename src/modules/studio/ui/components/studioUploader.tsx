import { Button } from "@/components/ui/button";
import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { UploadIcon } from "lucide-react";
interface StudioUploaderProps {
  endPoint?: string | null | undefined;
  onSuccess: () => void;
}

const UPLOADER_ID = "video-uploader";
export const StudioUploader = ({
  endPoint,
  onSuccess,
}: StudioUploaderProps) => {
  console.log("Uploader endpoint:", endPoint);
  if (!endPoint) {
    console.error("Upload endpoint is not provided!");
    return null;
  }
  return (
    <div>
      <MuxUploader
        endpoint={endPoint}
        onSuccess={onSuccess}
        id={UPLOADER_ID}
        className="hidden group/uploader"
      />
      <MuxUploaderDrop muxUploader={UPLOADER_ID} className="group/drop">
        <div slot="heading" className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 justify-center rounded-full bg-muted w-32 h-32">
            <UploadIcon
              className="size-10 text-muted-foreground group/drop-[&[active
   
   ]] :animate-bounce transition-all duration-300"
            />
          </div>
          <div className="flec flex-col text-center gap-2">
            <p className="text-sm">Drag and frop videos to upload</p>
            <p className="text-xs text-muted-foreground">
              your videos will be private until you publish them{" "}
            </p>
          </div>
          <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
            <Button type="button" className="rounded-full">
              select items
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot="seperator" className="hidden" />
        <MuxUploaderStatus muxUploader={UPLOADER_ID} className="text-sm" />
        <MuxUploaderProgress
          muxUploader={UPLOADER_ID}
          className="text-sm"
          type="percentage"
        />
        <MuxUploaderProgress muxUploader={UPLOADER_ID} type="bar" />
      </MuxUploaderDrop>
    </div>
  );
};
