"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FlagIcon, HomeIcon, PlaySquareIcon } from "lucide-react";
import Link from "next/link";

export const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Subscrition",
    url: "/feed/subscription",
    icon: PlaySquareIcon,
    auth: true,
  },
  {
    title: "Trending",
    url: "/feed/trending",
    icon: FlagIcon,
  },
];

export const Main_Section = () => {
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
          )
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
