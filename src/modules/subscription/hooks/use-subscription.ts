import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

interface useSubscriptionProps{
    userId: string;
    isSubscribed: boolean;
    fromVideoId: string;
}

export const useSubscription = ({
    userId,
    isSubscribed,
    fromVideoId
}:useSubscriptionProps) => {
    const clerk = useClerk();
    const utils = trpc.useUtils();
    const subscribe = trpc.subscriptions.create.useMutation({
        onSuccess:()=>{
            toast.success("Subscribed");
            // reinValidate subscription.getMany, users.getOne

            if(fromVideoId){
                utils.videos.getOne.invalidate({ id : fromVideoId })
            }
        },
            onError:(error)=>{
                toast.error("Something went wrong");
                 if(error.data?.code==="UNAUTHORIZED"){
                    clerk.openSignIn();
                 }
            }
    });
    const unSubscribed = trpc.subscriptions.remove.useMutation({
        onSuccess:()=>{
            toast.success("Subscribed");
            // reinValidate subscription.getMany, users.getOne

            if(fromVideoId){
                utils.videos.getOne.invalidate({ id : fromVideoId })
            }
        },
            onError:(error)=>{
                toast.error("Something went wrong");
                 if(error.data?.code==="UNAUTHORIZED"){
                    clerk.openSignIn();
                 }
            }
    });

    const isPending = subscribe.isPending || unSubscribed.isPending;

    const onclick=(()=>{
        if(isSubscribed){
            unSubscribed.mutate({ userId })
        }
        else{
            subscribe.mutate({ userId })
        }
    })
    return {
        isPending,
        onclick
    }
}