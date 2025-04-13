import { ResponsiveMode } from "@/components/responsive-mode";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form"
import {toast} from "sonner"
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { videos } from "@/db/schema";

interface ThumbnailGenerateModelProps {
    videoId: string;
    open:boolean;
    onOpenChange:(open:boolean) => void;
}

const formSchema = z.object({
    prompt: z.string().min(10),
})

export const ThumbnailGenerateModel= ({
    videoId,
    open,
    onOpenChange
}:ThumbnailGenerateModelProps)=>{
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:  zodResolver(formSchema),
        defaultValues:{
            prompt:""
        }
    });

      const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
        onSuccess: () => {
          toast.error("Background Job Started:", {description: "Background job starting....wait"});
          form.reset()
          onOpenChange(false)
        },
        onError: () => {
          toast.success("something went wrong!");

        },
      });
    

    const onSubmit = (values: z.infer<typeof formSchema>)=>{
        generateThumbnail.mutate({
            prompt : values.prompt,
            id: videoId
        })
    }
    return(
        <ResponsiveMode
        title="Upload your Thumbnail here"
        open={open}
        onOpenChange={onOpenChange}
        >
            <form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex  flex-col gap-4"
        >
            <FormField
            control={form.control}
            name="prompt"
            render={({field})=>(
                <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                        <Textarea 
                        {...field}
                        className="resize-none"
                        cols={30}
                        rows={5}
                        placeholder="A description of wanted thumbnail: "
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />
            <div className="justify-end flex">
                <Button
                disabled= {generateThumbnail.isPending}
                type="submit">
                    Generate
                </Button>
            </div>
        </form>
        </form>
        </ResponsiveMode>
    )
}