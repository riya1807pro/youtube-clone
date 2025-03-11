"use client";

import {
  SidebarContent,
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { LogOutIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StudioSidebarHeader } from "./studo-header";

export const StudioSidebar = () => {
  const pathName = usePathname();

  return (
    <Sidebar className="pt-16 z-40" collapsible="icon">
      {/* Ensure collapsible uses a boolean */}
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader />
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathName === "/studio"}
                tooltip="Content"
              >
                <Link href="/studio" className="flex items-center gap-2">
                  <VideoIcon className="size-5" />
                  <span className="text-sm">Content</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Exit studio">
                <Link
                  href="/"
                  onClick={() => console.log("exiting studio")}
                  className="flex items-center  gap-2 "
                >
                  <LogOutIcon className="size-5" />
                  <span className="text-sm text-black">Exit Studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
