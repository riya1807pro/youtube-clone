"use client";
import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-Avatar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export const StudioSidebarHeader = () => {
  const { state } = useSidebar();
  const { user } = useUser();
  if (!user)
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full">
          <div className="flex flex-col mt-2 gap-1.5">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </Skeleton>
      </SidebarHeader>
    );

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="your profile" asChild>
          <Link href="/users/current">
            <UserAvatar
              imageURL={user.imageUrl}
              name={user.fullName ?? "User"}
              size="sm"
            />
            {/* <span className="text-sm ">your profile</span> */}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href="/users/current">
        <UserAvatar
          imageURL={user.imageUrl}
          name={user.fullName ?? "user"}
          className="size-[112] hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="flex flex-col items-center mt-2">
        <p className="text-sm font-medium">your profile</p>
        <p className="text-xs text-muted-foreground">{user.fullName}</p>
      </div>
    </SidebarHeader>
  );
};
