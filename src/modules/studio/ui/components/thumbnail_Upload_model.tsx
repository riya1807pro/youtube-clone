import { ResponsiveMode } from "@/components/responsive-mode";
import { UploadDropzone } from "@/lib/uploadThings";
import { trpc } from "@/trpc/client";

interface ThumbnailUploadModelProps {
    videoId: string;
    open:boolean;
    onOpenChange:(open:boolean) => void;
}

export const ThumbnailUploadModel= ({
    videoId,
    open,
    onOpenChange
}:ThumbnailUploadModelProps)=>{
    const utils = trpc.useUtils();

    const onUploadComplete = ()=>{
        utils.studio.getMany.invalidate()
        utils.studio.getOne.invalidate({id: videoId})
        onOpenChange(false)
    }
    return(
        <ResponsiveMode
        title="Upload your Thumbnail here"
        open={open}
        onOpenChange={onOpenChange}
        >
 <p>hello</p>
 <UploadDropzone
 endpoint="ThumbnailUploader"
 input={{videoId}}
 onClientUploadComplete={onUploadComplete}
 
 />
        </ResponsiveMode>
    )
}