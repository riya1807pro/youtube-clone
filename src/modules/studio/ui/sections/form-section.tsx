<<<<<<< HEAD

"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  Loader2Icon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { trpc } from "@/trpc/client";
import { videoUpdateSchema } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
=======
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
>>>>>>> 9f21a4b (internal structure improvements)
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
<<<<<<< HEAD
import { VideoPlayer } from "@/modules/videos/ui/components/videoPlayer";
import { snakeCaseToTitle } from "@/lib/utils";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constant";
import { ThumbnailGenerateModel } from "../components/thumbnail-generate-model";
import { ThumbnailUploadModel } from "../components/thumbnail_Upload_model";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_URL } from "@/modules/videos/constant";
=======
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  Loader2Icon,
  LockIcon,
  MoreVertical,
  MoreVerticalIcon,
  RotateCcw,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";
import { videoUpdateSchema } from "@/db/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { ThumbnailUploadModal } from "../components/thumbnail-upload-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_URL } from "@/constants";
>>>>>>> 9f21a4b (internal structure improvements)

interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
<<<<<<< HEAD
      <ErrorBoundary fallback={<p>Error</p>}>
=======
      <ErrorBoundary fallback={"Error"}>
>>>>>>> 9f21a4b (internal structure improvements)
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

<<<<<<< HEAD
const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnailGenerateModalOpen, setThumbnailGenerateModalOpen] =
    useState(false);

  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      form.reset(video);
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Video updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video removed");
      router.push("/studio");
    },
    onError: (error) => {
      toast.error(error.message);
=======
const FormSectionSkeleton = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="space-y-8 lg:col-span-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-[220px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-[84px] w-[153px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-y-8 lg:col-span-2">
          <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden">
            <Skeleton className="aspect-video" />
            <div className="px-4 py-4 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const router = useRouter();
  const utils = trpc.useUtils();
  const generateDescription = trpc.videos.generateDescription.useMutation({
    onSuccess: () => {
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Description generated");
      setTimeout(() => {
        router.push("/studio");
      }, 1000);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const generateTitle = trpc.videos.generateTitle.useMutation({
    onSuccess: () => {
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Title generated");
      setTimeout(() => {
        router.push("/studio");
      }, 1000);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Video Updated");
      setTimeout(() => {
        router.push("/studio");
      }, 1000);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();

      toast.success("Video Removed");
      setTimeout(() => {
        router.push("/studio");
      }, 1000);
    },
    onError: () => {
      toast.error("Something went wrong");
>>>>>>> 9f21a4b (internal structure improvements)
    },
  });

  const revalidate = trpc.videos.revalidate.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Video revalidated");
<<<<<<< HEAD
    },
    onError: (error) => {
      toast.error(error.message);
=======
      setTimeout(() => {
        router.push("/studio");
      }, 1000);
    },
    onError: () => {
      toast.error("Something went wrong");
>>>>>>> 9f21a4b (internal structure improvements)
    },
  });

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
<<<<<<< HEAD
      toast.success("Thumbnail restored");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const generateTitle = trpc.videos.generateTitle.useMutation({
    onSuccess: () => {
      toast.success("Background job started", {
        description: "This may take some time",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const generateDescription = trpc.videos.generateDescription.useMutation({
    onSuccess: () => {
      toast.success("Background job started", {
        description: "This may take some time",
      });
    },
    onError: (error) => {
      toast.error(error.message);
=======
      toast.success("Thumbnail Restored");
    },
    onError: () => {
      toast.error("Something went wrong");
>>>>>>> 9f21a4b (internal structure improvements)
    },
  });

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

<<<<<<< HEAD
  const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
    await update.mutateAsync(data);
  };

  const fullUrl = `${APP_URL}/videos/${videoId}`;
=======
  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutateAsync(data);
  };

  const fullUrl = `${APP_URL}/videos/${videoId}`;

>>>>>>> 9f21a4b (internal structure improvements)
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
<<<<<<< HEAD
=======

>>>>>>> 9f21a4b (internal structure improvements)
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
<<<<<<< HEAD

  return (
    <>
      <ThumbnailGenerateModel
        open={thumbnailGenerateModalOpen}
        onOpenChange={setThumbnailGenerateModalOpen}
        videoId={videoId}
      />
      <ThumbnailUploadModel
        open={thumbnailModalOpen}
        onOpenChange={setThumbnailModalOpen}
        videoId={videoId}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Video details</h1>
=======
  return (
    <>
      <ThumbnailUploadModal
        open={thumbnailModalOpen}
        onOpenChange={setThumbnailModalOpen}
        videoId={video.id}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Video Details</h1>
>>>>>>> 9f21a4b (internal structure improvements)
              <p className="text-xs text-muted-foreground">
                Manage your video details
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={update.isPending || !form.formState.isDirty}
              >
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
<<<<<<< HEAD
                  <Button variant="ghost" size="icon">
                    <MoreVerticalIcon />
=======
                  <Button variant={"ghost"} size={"icon"}>
                    <MoreVertical />
>>>>>>> 9f21a4b (internal structure improvements)
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
<<<<<<< HEAD
                    onClick={() => {
                      remove.mutate({ id: videoId });
                    }}
                  >
                    <TrashIcon className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      revalidate.mutate({ id: videoId });
                    }}
                  >
                    <RotateCcwIcon className="mr-2 size-4" />
=======
                    onClick={() => remove.mutate({ id: videoId })}
                  >
                    <TrashIcon className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => revalidate.mutate({ id: videoId })}
                  >
                    <RotateCcw className="size-4 mr-2" />
>>>>>>> 9f21a4b (internal structure improvements)
                    Revalidate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
<<<<<<< HEAD
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="space-y-8 lg:col-span-3">
=======
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="space-y-8 lg:col-span-3 py-5">
>>>>>>> 9f21a4b (internal structure improvements)
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Title
                        <Button
<<<<<<< HEAD
                          type="button"
                          size="icon"
                          variant="outline"
                          className="size-6 rounded-full [&_svg]:size-3"
                          onClick={() => {
                            generateTitle.mutate({ id: videoId });
                          }}
=======
                          size={"icon"}
                          variant={"outline"}
                          type="button"
                          className="rounded-full size-6 [&_svg]:size-3"
                          onClick={() => generateTitle.mutate({ id: videoId })}
>>>>>>> 9f21a4b (internal structure improvements)
                          disabled={
                            generateTitle.isPending || !video.muxTrackId
                          }
                        >
                          {generateTitle.isPending ? (
                            <Loader2Icon className="animate-spin" />
                          ) : (
                            <SparklesIcon />
                          )}
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
<<<<<<< HEAD
                      <Input
                        {...field}
                        placeholder="Add a title to your video"
                      />
=======
                      <Input {...field} placeholder="Add title to your video" />
>>>>>>> 9f21a4b (internal structure improvements)
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
<<<<<<< HEAD
                      <div className="flex items-center gap-x-2">
                        Description
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="size-6 rounded-full [&_svg]:size-3"
                          onClick={() => {
                            generateDescription.mutate({ id: videoId });
                          }}
=======
                      {" "}
                      <div className="flex items-center gap-x-2">
                        Description
                        <Button
                          size={"icon"}
                          variant={"outline"}
                          type="button"
                          className="rounded-full size-6 [&_svg]:size-3"
                          onClick={() =>
                            generateDescription.mutate({ id: videoId })
                          }
>>>>>>> 9f21a4b (internal structure improvements)
                          disabled={
                            generateDescription.isPending || !video.muxTrackId
                          }
                        >
                          {generateDescription.isPending ? (
                            <Loader2Icon className="animate-spin" />
                          ) : (
                            <SparklesIcon />
                          )}
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
<<<<<<< HEAD
                        value={field.value ?? ""}
                        placeholder="Add a description to your video"
=======
                        placeholder="Add a description to your video"
                        value={field.value ?? ""}
>>>>>>> 9f21a4b (internal structure improvements)
                        rows={10}
                        className="resize-none pr-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
<<<<<<< HEAD
                control={form.control}
                name="thumbnailUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="group relative h-[84px] w-[153px] border border-dashed border-neutral-400 p-0.5">
                        <Image
                          src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                          alt="Thumbnail"
                          className="object-cover"
                          fill={true}
                        />
=======
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel> Thumbnail</FormLabel>
                    <FormControl>
                      <div className="p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group">
                        <Image
                          fill
                          alt="thumbnail"
                          src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                        />

>>>>>>> 9f21a4b (internal structure improvements)
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
<<<<<<< HEAD
                              className="absolute right-1 top-1 size-7 rounded-full bg-black/50 opacity-100 duration-300 hover:bg-black/50 group-hover:opacity-100 md:opacity-0"
=======
                              className="duration-300 size-7 bg-black hover:bg-black/50 absolute top-1 right-1 rounded-full opactiy-100 md:opacity-0 group-hover:opacity-100"
>>>>>>> 9f21a4b (internal structure improvements)
                            >
                              <MoreVerticalIcon className="text-white" />
                            </Button>
                          </DropdownMenuTrigger>
<<<<<<< HEAD
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => setThumbnailModalOpen(true)}
                            >
                              <ImagePlusIcon className="mr-1 size-4" />
=======
                          <DropdownMenuContent align="start" side="right">
                            <DropdownMenuItem
                              onClick={() => setThumbnailModalOpen(true)}
                            >
                              <ImagePlusIcon className="size-4 mr-1" />
>>>>>>> 9f21a4b (internal structure improvements)
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
<<<<<<< HEAD
                                setThumbnailGenerateModalOpen(true)
                              }
                            >
                              <SparklesIcon className="mr-1 size-4" />
                              AI-generated
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                restoreThumbnail.mutate({ id: videoId })
                              }
                            >
                              <RotateCcwIcon className="mr-1 size-4" />
=======
                                restoreThumbnail.mutate({ id: videoId })
                              }
                            >
                              <RotateCcw className="size-4 mr-1" />
>>>>>>> 9f21a4b (internal structure improvements)
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
<<<<<<< HEAD
                    <FormMessage />
=======
>>>>>>> 9f21a4b (internal structure improvements)
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-y-8 lg:col-span-2">
<<<<<<< HEAD
              <div className="flex h-fit flex-col gap-4 overflow-hidden rounded-xl bg-[#F9F9F9]">
                <div className="relative aspect-video overflow-hidden">
=======
              <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                <div className="aspect-video overflow-hidden relative">
>>>>>>> 9f21a4b (internal structure improvements)
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
<<<<<<< HEAD
                <div className="flex flex-col gap-y-6 p-4">
                  <div className="flex items-center justify-between gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-sm text-muted-foreground">
                        Video link
                      </p>
                      <div className="flex items-center gap-x-2">
                        <Link prefetch href={`/videos/${video.id}`}>
=======
                <div className="p-4 flex flex-col gap-y-6">
                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Video Link
                      </p>
                      <div className="flex items-center gap-x-2">
                        <Link href={`/videos/${video.id}`}>
>>>>>>> 9f21a4b (internal structure improvements)
                          <p className="line-clamp-1 text-sm text-blue-500">
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type="button"
<<<<<<< HEAD
                          variant="ghost"
=======
                          variant={"ghost"}
>>>>>>> 9f21a4b (internal structure improvements)
                          size="icon"
                          className="shrink-0"
                          onClick={onCopy}
                          disabled={isCopied}
                        >
<<<<<<< HEAD
                          {isCopied ? (
                            <CopyCheckIcon className="size-4" />
                          ) : (
                            <CopyIcon className="size-4" />
                          )}
=======
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
>>>>>>> 9f21a4b (internal structure improvements)
                        </Button>
                      </div>
                    </div>
                  </div>
<<<<<<< HEAD

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Video status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitle(video.muxStatus || "preparing")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Subtitles status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitle(
                          video.muxTrackStatus || "no_subtitles",
=======
                  <div className="flex justfiy-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        {" "}
                        Video Status
                      </p>
                      <p>{snakeCaseToTitle(video.muxStatus || "preparing")}</p>
                    </div>
                  </div>
                  <div className="flex justfiy-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        {" "}
                        Subtitle Status
                      </p>
                      <p>
                        {snakeCaseToTitle(
                          video.muxTrackStatus || "No Subtitles",
>>>>>>> 9f21a4b (internal structure improvements)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
<<<<<<< HEAD

=======
>>>>>>> 9f21a4b (internal structure improvements)
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center">
<<<<<<< HEAD
                            <Globe2Icon className="mr-2 size-4" />
=======
                            <Globe2Icon className="size-4 mr-2" />
>>>>>>> 9f21a4b (internal structure improvements)
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center">
<<<<<<< HEAD
                            <LockIcon className="mr-2 size-4" />
=======
                            <LockIcon className="size-4 mr-2" />
>>>>>>> 9f21a4b (internal structure improvements)
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
<<<<<<< HEAD

const FormSectionSkeleton = () => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-[220px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-[84px] w-[153px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-y-8 lg:col-span-2">
          <div className="flex flex-col gap-4 overflow-hidden rounded-xl bg-[#F9F9F9]">
            <Skeleton className="aspect-video" />
            <div className="space-y-6 p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
=======
>>>>>>> 9f21a4b (internal structure improvements)
