'use client'
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { error } from "console";

export const StudioUploadModel = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: ()=>{
      toast.success("videp created!!!")
      utils.studio.getMany.invalidate()
    },
    onError : (error)=>{
      toast.error(error.message)
    }
  });

  const handleCreate = () => {
    // Ensure you are passing necessary data, like title
    create.mutate();
  };

  return (
    <Button variant="secondary" onClick={handleCreate} disabled={create.isPaused}>
{      create.isPending? <Loader2Icon className="animate-spin"/>: 
      <PlusIcon />}
      Create
    </Button>
  );
};
