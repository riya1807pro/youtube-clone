import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface VideoDescrioptionProps{
    compactViews: string;
    expendedViews : string;
    compactDate: string;
    expendedDate :string;
    description?: string| null;
}
export const VideoDescrioption = ({
    compactViews,
    expendedViews,
    compactDate, 
    expendedDate,
    description
}:VideoDescrioptionProps) =>{
    const [expanded, setExpanded] = useState(false);
    return(
       <div
       onClick={()=>{setExpanded((current)=>(!current))}}
       className="bg-secondary/50 rounded-xl p-3 cursor-pointer hover:bg-secondary/70 transition">
        <div className="flex gap-2 text-sm mb-2">
            <span className="font-medium">
                {expanded? expendedViews: compactViews} views
            </span>
            <span className="font-medium">
                {expanded? expendedDate: compactDate} 
            </span>
        </div>
        <div className="relative">
            <p className={cn(
                "text-sm whitespace-pre-wrap",
                !expanded && "line-clamp-2"
            )}>
                {description|| "No description"}
            </p>
            <div className="flex items-center gap-1 mt-4 text-sm font-medium">
                {expanded ?(
                    <>
                    Show less <ChevronUpIcon className="size-4"/>
                    </>
                ):(
                    <>
                    Show more <ChevronDownIcon className="size-4"/>
                    </>
                )}
            </div>
        </div>
       </div>
    )
}