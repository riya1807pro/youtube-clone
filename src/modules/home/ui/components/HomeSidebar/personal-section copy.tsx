"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FlagIcon, HistoryIcon, HomeIcon, ListVideoIcon, PlaySquareIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";

export const items = [
  {
    title: "History",
    url: "/history",
    icon: HistoryIcon,
    auth:true
  },
  {
    title: "Liked",
    url: "/playlists/Liked",
    icon: ThumbsUpIcon,
    auth: true,
  },
  {
    title: "All Playlists",
    url: "/palylists",
    icon: ListVideoIcon,
    auth:true
  },
];

export const Personal_Section = () => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive
                onClick={() => {}}
              >
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon />
                  <span className="text-sm">{item.title} </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
      
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
