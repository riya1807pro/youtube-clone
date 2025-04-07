import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { string } from "zod";

interface SubscriptionButtonProps{
    onClick: ButtonProps["onClick"];
    disabled: boolean;
    isSubscribed: boolean;
    className?:string;
    size?: ButtonProps["size"]
}

export const SubscriptionButton = ({
    onClick,
    disabled,
    isSubscribed,
    className,
    size
}: SubscriptionButtonProps) => {
    return(
        <Button 
        variant={isSubscribed? "secondary": "default"}
        size={size}
        className={cn("rounded-full", className)}
        onClick={onClick}
        disabled={disabled}
        >
            {isSubscribed? "Unsubscribed" : "Subscribed"}
        </Button>
    )
}