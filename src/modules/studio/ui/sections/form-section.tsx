'use client'
import { Button } from "@/components/ui/button"
import { videoInsertSchema, videoUpdateSchema } from "@/db/schema"
import { trpc } from "@/trpc/client"

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { CopyCheckIcon, CopyIcon, Globe2Icon, LockIcon, MoreVerticalIcon, Trash2Icon, TrashIcon, Video } from "lucide-react"
import { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Form, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { util, z } from "zod"
import { createUpdateSchema } from "drizzle-zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select"
import { toast } from "sonner"
import { VideoPlayer } from "@/modules/videos/ui/components/videoPlayer"
import Link from "next/link"
import { snakeCaseToTitle } from "@/lib/utils"

interface FormSectionProps{
    videoId : string
}


export const FormSection = ({videoId}:FormSectionProps)=>{
   return ( <Suspense fallback={<FormSkeletonSection/>}>
        <ErrorBoundary fallback={<p>Error</p>}>
            <FormSectionSuspense videoId={videoId}/>
        </ErrorBoundary>
    </Suspense>)
}

export const FormSkeletonSection =()=>{
    return <p>loading....</p>
}

const FormSectionSuspense =({
    videoId
}:FormSectionProps)=>{
    const router = useRouter();
    const utils = trpc.useUtils();
    const [videoData] = trpc.studio.getOne.useSuspenseQuery({
        id: videoId
    })
    const video = {
        ...videoData,
        updatedAt: new Date(videoData.updatedAt),
        createdAt: new Date(videoData.createdAt),
    }
    const [categories] = trpc.categories.getMany.useSuspenseQuery();

    const remove = trpc.videos.remove.useMutation({
        onSuccess:()=>{
           utils.studio.getMany.invalidate();
           toast.success("Video updated suceesfully!!")
           router.push("/studio")
        },
        onError:()=>{
            toast.error("sometung went wrong")
        }
    });

    const update = trpc.videos.update.useMutation({
        onSuccess:()=>{
           utils.studio.getMany.invalidate();
           utils.studio.getOne.invalidate({id:videoId})
           toast.success("Video updated suceesfully!!")
        },
        onError:()=>{
            toast.error("sometung went wrong")
        }
    });
    
    const form = useForm<z.infer<typeof videoUpdateSchema>>({
        resolver: zodResolver(videoUpdateSchema),
        defaultValues: video,
    })
    
    const onSubmit = async ( data: z.infer<typeof videoUpdateSchema>)=>{
       update.mutate(data)
    }

    const fullUrl = `${process.env.VERCAL_URL || "http://localhost:3000"}/videos/${videoId}`
    const [isCopied, setIsCopied] = useState(false);

    const onCopy = ()=>{
        navigator.clipboard.writeText(fullUrl);
        setIsCopied(true);
        setTimeout(()=>{
            setIsCopied(false);
        },2000)
    };

    return (
       <Form {...form }>
        <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6">
<div>
<h1 className="text-2xl font bold">video details </h1>
<p className="text-sm text--muted-foreground ">video discription here</p>
</div>
<div  className="flex items-center gap-x-2">
    <Button type="submit" disabled={update.isPending}>
        Save
    </Button>
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
                <MoreVerticalIcon/>
            </Button>
        </DropdownMenuTrigger>
<DropdownMenuContent align="end">
<DropdownMenuItem onClick={()=>remove.mutate({id: videoId})}>
    <TrashIcon className="size-4 mr-2"/>
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
                render={({field})=>(

                    <FormItem>
                        <FormLabel>

                        </FormLabel>
                        <FormControl>
                            <Input 
                            {...field}
                            placeholder="Enter your title here"
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                >
                </FormField>
                <FormField
                control={form.control}
                name="discription"
                render={({field})=>(
                    
                    <FormItem>
                        <FormLabel>
Discription
{/* add ai generated button */}
                        </FormLabel>
                        <FormControl>
                            <Textarea 
                            {...field}
                            rows={10}
                            value={field.value ?? ""}
                            className="resize-none pr-10"
                            placeholder="Enter your discription here"
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                >
                </FormField>
                    {/* aadd thumbnail here  */}
                    <FormField
                control={form.control}
                name="categoryId"
                render={({field})=>(
                    
                    <FormItem>
                        <FormLabel>
Discription
{/* add ai generated button */}
                        </FormLabel>
                        <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? "undefined"}
                        >
                        <FormControl>
                           <SelectTrigger>
                            <SelectValue placeholder="Select a category"/>
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {categories.map((category)=>(
                                <SelectItem value={category.id} key={category.id}>
                                {category.name}
                            </SelectItem>
    ))}
                        </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
                >
                </FormField>
            </div>
            <div className="flex flex-col gap-y-8 lg:col-span-2">
                <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                    <div className="aspec-video overflow-hidden relative">
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
                                 {isCopied?<CopyCheckIcon/>:   <CopyIcon/>}
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
                render={({field})=>(
                    
                    <FormItem>
                        <FormLabel>
Visibilty
{/* add ai generated button */}
                        </FormLabel>
                        <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? "undefined"}
                        >
                        <FormControl>
                           <SelectTrigger>
                            <SelectValue placeholder="Select a category"/>
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="public">
                        <div className="flex items-center">
                        <Globe2Icon className="size-4 mr-2"/>
                        Public
                        </div>
                           </SelectItem>
                           <SelectItem value="private">
                        <div className="flex items-center">
                        <LockIcon className="size-4 mr-2"/>
                        private
                        </div>
                           </SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
                >
                </FormField>

        </div>
        </form>
       </Form>
    )
}