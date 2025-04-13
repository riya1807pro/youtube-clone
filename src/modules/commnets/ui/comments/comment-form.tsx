import { useUser } from "@clerk/nextjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { trpc } from "@/trpc/client";
import { commentInsertSchema } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-Avatar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface CommentFormProps {
  videoId: string;
  onCancel?: ()=> void;
  parentId?: string;
  variant?: "comment" | "reply";
  onSuccess?: () => void;
}

export const CommentForm = ({ 
  videoId,
  onCancel,
  parentId,
  variant = "comment",
   onSuccess,
  
  }: CommentFormProps) => {
  const { user, isSignedIn } = useUser();
  const utils = trpc.useUtils();

  const formSchema = commentInsertSchema.omit({ userId: true });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentId:parentId,
      videoId,
      values: "",
    },
  });
  
  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ valueId: videoId });
      utils.comments.getMany.invalidate({ valueId: videoId , parentId});
      form.reset();
      toast.success("Comment added");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Something went wrong!");
      if (error.data?.code === "UNAUTHORIZED") {
        // You can redirect or ask user to login again here
      }
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form values:", values);
    create.mutate({
      videoId: values.videoId,
      values: values.values, // ✅ match with new form field
      parentId: values.parentId,
    });
    
  };

  const handleCancel = ()=>{
    form.reset();
    onCancel?.()
  }

  if (!isSignedIn) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-4 group"
      >
        <UserAvatar
          imageURL={user?.imageUrl || "/user-placeholder.png"}
          size="lg"
          name={user?.fullName || "User"}
        />
        <div className="flex-1">
          <FormField
            name="values"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === "reply"
                      ? "Reply to this comment...":
                      "Add a comment..."}
                    className="resize-none bg-transparent overflow-hidden min-h-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
          { onCancel&&( 
           <Button 
               variant = "ghost"
               type="button"
               onClick={handleCancel}
            >
              Cancel
            </Button>)}
            <Button disabled={create.isPending} type="submit" size="sm">
             {variant === "reply" ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
