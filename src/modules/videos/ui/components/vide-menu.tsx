import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ListPlusIcon, MoreVerticalIcon, ShareIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { APP_URL } from "../../constant";

interface VideoMenuProps{
    videoId: string;
    variant?: "ghost"|"secondary";
    onRemove?: ()=> void;
}

export const VideoMenu = ({
    videoId,
    variant = "ghost",
    onRemove
}: VideoMenuProps) => {
    const onShare =()=>{
        const fullUrl = `${APP_URL}/videos/${videoId}`;
        navigator.clipboard.writeText(fullUrl);
        toast.success("Link copied to clipboard")
    }
    return(
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={variant} className="rounded-full" size="icon">
                <MoreVerticalIcon/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end"  onClick={(e)=>e.stopPropagation()}>
            <DropdownMenuItem onClick={()=>{

            }}>
                <ShareIcon className="mr-2 size-4"/>
                Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare}>
                <ListPlusIcon className="mr-2 size-4"/>
                Add to playlist
            </DropdownMenuItem>
            {onRemove && (
 
            <DropdownMenuItem onClick={()=>{
                
            }}>
                <Trash2Icon className="mr-2 size-4"/>
                Remove
            </DropdownMenuItem>
            )}
        </DropdownMenuContent>
       </DropdownMenu>
    )
}