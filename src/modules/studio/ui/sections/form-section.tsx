"use client";
import { Button } from "@/components/ui/button";
import { videoUpdateSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  //   DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  Loader2Icon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparkleIcon,
  Trash2Icon,
} from "lucide-react";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { toast } from "sonner";
import { VideoPlayer } from "@/modules/videos/ui/components/videoPlayer";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constant";
import { ThumbnailUploadModel } from "../components/thumbnail_Upload_model";
import { ThumbnailGenerateModel } from "../components/thumbnail-generate-model";

interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSkeletonSection />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const FormSkeletonSection = () => {
  return (
    <div>
    <div className="flex items-center justify-between mb-6" >
      <div className="space-y-2" >
      <Skeleton className="h-7 w-32 "/>
  
      <Skeleton className="h-4 w-40"/>
      </div>
      <Skeleton className="h-9 w-24 "/>
  
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="space-y-8 lg:cols-span-3">
        <div className="space-y-2">
          <Skeleton className=" h-5 w-16"/>
          <Skeleton className=" h-[220px] w-full"/>
        </div>
        {/* thumbnaiil  */}
        <div className="space-y-2">
          <Skeleton className=" h-5 w-16"/>
          <Skeleton className=" h-[84px] w-[153px]"/>
        </div>
        {/*category selecton tool  */}
        <div className="space-y-2">
          <Skeleton className=" h-5 w-16"/>
          <Skeleton className=" h-10 w-full"/>
        </div>
      </div>
      <div className="flex flex-cols gap-y-8 lg:cols-span-2">
           <div className="flex flex-col gap-4 bg=[#F9F9F9] rounded-xl overflow-hidden">
            <Skeleton   className="aspect-video"/>
         <div className="px-4 py-4 space-y-6">
          {/* video link */}
            <div className="space-y-2">
              <Skeleton className=" h-4 w-20"/>
              <Skeleton className=" h-5 w-32"/>
            </div>
            {/* video status */}
            <div className="space-y-2">
          <Skeleton className=" h-4 w-24"/>
          <Skeleton className=" h-5 w-32"/>
        </div>
        {/* track status */}
        <div className="space-y-2">
          <Skeleton className=" h-4 w-24"/>
          <Skeleton className=" h-5 w-32"/>
        </div>
        </div>
           </div>
           <div className="space-y-2">
          <Skeleton className=" h-5 w-20"/>
          <Skeleton className=" h-10  w-full"/>
        </div>
      </div>
    </div>
    </div>
  )
};

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const [thumbnailOpenModel, setThumbnailOpenModel] = useState(false);
  const [thumbnailGenerateModel, setThumbnailGenerateModel] = useState(false);

  const router = useRouter();
  const utils = trpc.useUtils();
  const [videoData] = trpc.studio.getOne.useSuspenseQuery({
    id: videoId,
  });
  const video = {
    ...videoData,
    updatedAt: new Date(videoData.updatedAt),
    createdAt: new Date(videoData.createdAt),
  };
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video updated successfully!!");
      router.push("/");
    },
    onError: () => {
      toast.error("something went wrong");
    },
  });
  
  
  const generateDescription = trpc.videos.generateDescription.useMutation({
    onSuccess: () => {
      toast.success("Thumbnail restored");
    },
    onError: () => {
      toast.error("Background Job Started:", {description: "Background job starting....wait"});
    },
  });

  const generateTitle = trpc.videos.generateTitle.useMutation({
    onSuccess: () => {
      toast.success("Thumbnail restored");
    },
    onError: () => {
      toast.error("Background Job Started:", {description: "Background job starting....wait"});
    },
  });




  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Thumbnail restored");
    },
    onError: () => {
      toast.error("something went wrong in restoring thumbnail");
    },
  });

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Video updated successfully!!");
    },
    onError: () => {
      toast.error("something went wrong");
    },
  });

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data);
  };

  const fullUrl = `${process.env.VERCAL_URL || "http://localhost:3000"}/videos/${videoId}`;
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    // <>
    //       <ThumbnailGenerateModel
    //     open={thumbnailGenerateModel}
    //     onOpenChange={setThumbnailGenerateModel}
    //     videoId={videoId}
    //   />
    //   <ThumbnailUploadModel
    //     open={thumbnailOpenModel}
    //     onOpenChange={setThumbnailOpenModel}
    //     videoId={videoId}
    //   />
    //   <Form {...form}>
    //     <form onSubmit={form.handleSubmit(onSubmit)}>
    //       <div className="flex items-center justify-between mb-6">
    //         <div>
    //           <h1 className="text-2xl font bold">video details </h1>
    //           <p className="text-xs text-muted-foreground ">
    //             video description here
    //           </p>
    //         </div>
    //         <div className="flex items-center gap-x-2">
    //           <Button type="submit" disabled={update.isPending}>
    //             Save
    //           </Button>
    //           <DropdownMenu>
    //             <DropdownMenuTrigger asChild>
    //               <Button variant="ghost" size="icon">
    //                 <MoreVerticalIcon />
    //               </Button>
    //             </DropdownMenuTrigger>
    //             <DropdownMenuContent align="end">
    //               <DropdownMenuItem
    //                 onClick={() => remove.mutate({ id: videoId })}
    //               >
    //                 <Trash2Icon className="size-4 mr-2" />
    //                 Delete
    //               </DropdownMenuItem>
    //             </DropdownMenuContent>
    //           </DropdownMenu>
    //         </div>
    //       </div>
    //       <div>
    //         <div>
    //           <FormField
    //             control={form.control}
    //             name="title"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel>
    //                   <div className="flex items-center gap-x-2" >
    //                     Title
    //                     <Button
    //                     size="icon"
    //                     variant="outline"
    //                     type="button"
    //                     className="rounded-full size:6 [&_svg]:size:3"
    //                     disabled={generateTitle.isPending|| !video.muxTrackId}
    //                     onClick={()=> generateTitle.mutate({id: videoId})}
    //                     >
    //                       {generateTitle.isPending ? <Loader2Icon className="animate-spin"/>:       <SparkleIcon />}
                    
    //                     </Button>
    //                   </div>
    //                 </FormLabel>
    //                 <FormControl>
    //                   <Input {...field} placeholder="Enter your title here" />
    //                 </FormControl>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           ></FormField>
    //           <FormField
    //             control={form.control}
    //             name="description"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel>
    //                 <div className="flex items-center gap-x-2" >
    //                     Description
    //                     <Button
    //                     size="icon"
    //                     variant="outline"
    //                     type="button"
    //                     className="rounded-full size:6 [&_svg]:size:3"
    //                     disabled={generateDescription.isPending||!video.muxTrackId}
    //                     onClick={()=> generateDescription.mutate({id: videoId})}
    //                     >
    //                       {generateDescription.isPending ? <Loader2Icon className="animate-spin"/>:       <SparkleIcon />}
                    
    //                     </Button>
    //                   </div>
    //                 </FormLabel>
    //                 <FormControl>
    //                   <Textarea
    //                     {...field}
    //                     rows={10}
    //                     value={field.value ?? ""}
    //                     className="resize-none pr-10"
    //                     placeholder="Enter your description here"
    //                   />
    //                 </FormControl>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           ></FormField>
    //           <FormField
    //             name="thumbnailUrl"
    //             control={form.control}
    //             render={() => (
    //               <FormItem>
    //                 <FormLabel>ThumbNailURL</FormLabel>
    //                 <FormControl>
    //                   <div
    //                     className="p-0.5 border border-dashed border-neutral-400 relative 
    //                         h-[84px] w-[153px] group"
    //                   >
    //                     <Image
    //                       src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
    //                       alt="thumbnailUrl"
    //                       className="object-cover"
    //                       fill
    //                     />
    //                     <DropdownMenu>
    //                       <DropdownMenuTrigger asChild>
    //                         <Button
    //                           type="button"
    //                           size="icon"
    //                           className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 
    //                             rounded-full md:opacity-0 group-hover: opacity-100
    //                             duration-300 size-7"
    //                         >
    //                           <MoreVerticalIcon className="text-white" />
    //                         </Button>
    //                       </DropdownMenuTrigger>
    //                       <DropdownMenuContent>
    //                         <DropdownMenuItem
    //                           onClick={() => setThumbnailOpenModel(true)}
    //                         >
    //                           <ImagePlusIcon className="size-4 mr-1" />
    //                           Change
    //                         </DropdownMenuItem>
    //                         <DropdownMenuItem
    //                         onClick={()=>setThumbnailGenerateModel(true)}
    //                         >
    //                           <SparkleIcon className="size-4 mr-1" />
    //                           Ai-Generated
    //                         </DropdownMenuItem>
    //                         <DropdownMenuItem
    //                           onClick={() =>
    //                             restoreThumbnail.mutate({
    //                               id: videoId,
    //                             })
    //                           }
    //                         >
    //                           <RotateCcwIcon className="size-4 mr-1" />
    //                           Restore
    //                         </DropdownMenuItem>
    //                       </DropdownMenuContent>
    //                     </DropdownMenu>
    //                   </div>
    //                 </FormControl>
    //               </FormItem>
    //             )}
    //           />
    //           <FormField
    //             control={form.control}
    //             name="categoryId"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel>
    //                   description
    //                   {/* add ai generated button */}
    //                 </FormLabel>
    //                 <Select
    //                   onValueChange={field.onChange}
    //                   defaultValue={field.value ?? "undefined"}
    //                 >
    //                   <FormControl>
    //                     <SelectTrigger>
    //                       <SelectValue placeholder="Select a category" />
    //                     </SelectTrigger>
    //                   </FormControl>
    //                   <SelectContent>
    //                     {categories.map((category) => (
    //                       <SelectItem value={category.id} key={category.id}>
    //                         {category.name}
    //                       </SelectItem>
    //                     ))}
    //                   </SelectContent>
    //                 </Select>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           ></FormField>
    //         </div>
    //         <div className="flex flex-col gap-y-8 lg:col-span-2">
    //           <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
    //             <div className="aspect-video overflow-hidden relative">
    //               <VideoPlayer
    //                 playbackId={video.muxPlaybackId}
    //                 thumbnailUrl={video.thumbnailUrl}
    //               />
    //             </div>
    //             <div className="p-4 flex flex-col gap-y-6">
    //               <div className="flex justify-between items-center gap-x-2">
    //                 <div className="flex flex-col gap-y-1">
    //                   <Link href={`/videos/${video.id}`}>
    //                     <p className="line-clamp-1 text-sm text-blue-500">
    //                       {fullUrl}
    //                     </p>
    //                   </Link>
    //                   <Button
    //                     variant="ghost"
    //                     type="button"
    //                     size="icon"
    //                     className="shrink-0"
    //                     onClick={onCopy}
    //                     disabled={isCopied}
    //                   >
    //                     {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
    //                   </Button>
    //                 </div>
    //               </div>
    //             </div>

    //             <div className="flex justify-between items-center">
    //               <div className="fle flex-col gap-y-1">
    //                 <p className="text-muted-foreground text-xs">
    //                   Video Status
    //                 </p>
    //                 <p className="text-sm">
    //                   {snakeCaseToTitle(video.muxStatus || "preparing")}
    //                 </p>
    //               </div>
    //             </div>

    //             <div className="flex justify-between items-center">
    //               <div className="fle flex-col gap-y-1">
    //                 <p className="text-muted-foreground text-xs">
    //                   Subtitles Status
    //                 </p>
    //                 <p className="text-sm">
    //                   {snakeCaseToTitle(video.muxTrackStatus || "no_subtitles")}
    //                 </p>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         <FormField
    //           control={form.control}
    //           name="visibility"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>
    //                 Visibilty
    //                 {/* add ai generated button */}
    //               </FormLabel>
    //               <Select
    //                 onValueChange={field.onChange}
    //                 defaultValue={field.value ?? "undefined"}
    //               >
    //                 <FormControl>
    //                   <SelectTrigger>
    //                     <SelectValue placeholder="Select a category" />
    //                   </SelectTrigger>
    //                 </FormControl>
    //                 <SelectContent>
    //                   <SelectItem value="public">
    //                     <div className="flex items-center">
    //                       <Globe2Icon className="size-4 mr-2" />
    //                       Public
    //                     </div>
    //                   </SelectItem>
    //                   <SelectItem value="private">
    //                     <div className="flex items-center">
    //                       <LockIcon className="size-4 mr-2" />
    //                       private
    //                     </div>
    //                   </SelectItem>
    //                 </SelectContent>
    //               </Select>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         ></FormField>
    //       </div>
    //     </form>
    //   </Form>
    // </>
    <>
        <ThumbnailUploadModel
          open={thumbnailGenerateModel}
          onOpenChange={setThumbnailGenerateModel}
          videoId={video.id}
        />
        <ThumbnailUploadModel
             open={thumbnailOpenModel}
             onOpenChange={setThumbnailOpenModel}
             videoId={videoId}
           />
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
         <div className="flex items-center justify-between mb-6">
           <div>
             <h1 className="text-2xl font bold">video details </h1>
             <p className="text-xs text-muted-foreground ">
               video description here
             </p>
           </div>
           <div className="flex items-center gap-x-2">
             <Button type="submit" disabled={update.isPending}>
               Save
             </Button>
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon">
                   <MoreVerticalIcon />
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                 <DropdownMenuItem
                   onClick={() => remove.mutate({ id: videoId })}
                 >
                   <Trash2Icon className="size-4 mr-2" />
                   Delete
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           </div>
         </div>
         <div>
           <div>
             <FormField
               control={form.control}
               name="title"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>
                     <div className="flex items-center gap-x-2" >
                       Title
                       <Button
                       size="icon"
                       variant="outline"
                       type="button"
                       className="rounded-full size:6 [&_svg]:size:3"
                       disabled={generateTitle.isPending|| !video.muxTrackId}
                       onClick={()=> generateTitle.mutate({id: videoId})}
                       >
                         {generateTitle.isPending ? <Loader2Icon className="animate-spin"/>:       <SparkleIcon />}
            
                       </Button>
                     </div>
                   </FormLabel>
                   <FormControl>
                     <Input {...field} placeholder="Enter your title here" />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             ></FormField>
             <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>
                   <div className="flex items-center gap-x-2" >
                       Description
                       <Button
                       size="icon"
                       variant="outline"
                       type="button"
                       className="rounded-full size:6 [&_svg]:size:3"
                       disabled={generateDescription.isPending||!video.muxTrackId}
                       onClick={()=> generateDescription.mutate({id: videoId})}
                       >
                         {generateDescription.isPending ? <Loader2Icon className="animate-spin"/>:       <SparkleIcon />}
            
                       </Button>
                     </div>
                   </FormLabel>
                   <FormControl>
                     <Textarea
                       {...field}
                       rows={10}
                       value={field.value ?? ""}
                       className="resize-none pr-10"
                       placeholder="Enter your description here"
                     />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             ></FormField>
             <FormField
               name="thumbnailUrl"
               control={form.control}
               render={() => (
                 <FormItem>
                   <FormLabel>ThumbNailURL</FormLabel>
                   <FormControl>
                     <div
                       className="p-0.5 border border-dashed border-neutral-400 relative 
                           h-[84px] w-[153px] group"
                     >
                       <Image
                         src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                         alt="thumbnailUrl"
                         className="object-cover"
                         fill
                       />
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button
                             type="button"
                             size="icon"
                             className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 
                               rounded-full md:opacity-0 group-hover: opacity-100
                               duration-300 size-7"
                           >
                             <MoreVerticalIcon className="text-white" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent>
                           <DropdownMenuItem
                             onClick={() => setThumbnailOpenModel(true)}
                           >
                             <ImagePlusIcon className="size-4 mr-1" />
                             Change
                           </DropdownMenuItem>
                           <DropdownMenuItem
                           onClick={()=>setThumbnailGenerateModel(true)}
                           >
                             <SparkleIcon className="size-4 mr-1" />
                             Ai-Generated
                           </DropdownMenuItem>
                           <DropdownMenuItem
                             onClick={() =>
                               restoreThumbnail.mutate({
                                 id: videoId,
                               })
                             }
                           >
                             <RotateCcwIcon className="size-4 mr-1" />
                             Restore
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </div>
                   </FormControl>
                 </FormItem>
               )}
             />
             <FormField
               control={form.control}
               name="categoryId"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>
                     description
                     {/* add ai generated button */}
                   </FormLabel>
                   <Select
                     onValueChange={field.onChange}
                     defaultValue={field.value ?? "undefined"}
                   >
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select a category" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       {categories.map((category) => (
                         <SelectItem value={category.id} key={category.id}>
                           {category.name}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                   <FormMessage />
                 </FormItem>
               )}
             ></FormField>
           </div>
           <div className="flex flex-col gap-y-8 lg:col-span-2">
             <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
               <div className="aspect-video overflow-hidden relative">
                 <VideoPlayer
                   playbackId={video.muxPlaybackId}
                   thumbnailUrl={video.thumbnailUrl}
                 />
               </div>
               <div className="p-4 flex flex-col gap-y-6">
                 <div className="flex justify-between items-center gap-x-2">
                   <div className="flex flex-col gap-y-1">
                     <Link href={`/videos/${video.id}`}>
                       <p className="line-clamp-1 text-sm text-blue-500">
                         {fullUrl}
                       </p>
                     </Link>
                     <Button
                       variant="ghost"
                       type="button"
                       size="icon"
                       className="shrink-0"
                       onClick={onCopy}
                       disabled={isCopied}
                     >
                       {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                     </Button>
                   </div>
                 </div>
               </div>
               <div className="flex justify-between items-center">
                 <div className="fle flex-col gap-y-1">
                   <p className="text-muted-foreground text-xs">
                     Video Status
                   </p>
                   <p className="text-sm">
                     {snakeCaseToTitle(video.muxStatus || "preparing")}
                   </p>
                 </div>
               </div>
               <div className="flex justify-between items-center">
                 <div className="fle flex-col gap-y-1">
                   <p className="text-muted-foreground text-xs">
                     Subtitles Status
                   </p>
                   <p className="text-sm">
                     {snakeCaseToTitle(video.muxTrackStatus || "no_subtitles")}
                   </p>
                 </div>
               </div>
             </div>
           </div>
           <FormField
             control={form.control}
             name="visibility"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>
                   VisibilIty
                   {/* add ai generated button */}
                 </FormLabel>
                 <Select
                   onValueChange={field.onChange}
                   defaultValue={field.value ?? "undefined"}
                 >
                   <FormControl>
                     <SelectTrigger>
                       <SelectValue placeholder="Select a category" />
                     </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                     <SelectItem value="public">
                       <div className="flex items-center">
                         <Globe2Icon className="size-4 mr-2" />
                         Public
                       </div>
                     </SelectItem>
                     <SelectItem value="private">
                       <div className="flex items-center">
                         <LockIcon className="size-4 mr-2" />
                         private
                       </div>
                     </SelectItem>
                   </SelectContent>
                 </Select>
                 <FormMessage />
               </FormItem>
             )}
           ></FormField>
         </div>
       </form>
     </Form>
       
    </>
  );
};
