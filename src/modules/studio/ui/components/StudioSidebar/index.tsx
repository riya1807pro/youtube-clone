"use client"; 

import { SidebarContent, Sidebar, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup } from "@/components/ui/sidebar";  
import {  LogOutIcon, VideoIcon } from "lucide-react"; 
import Link from "next/link";
import { usePathname } from "next/navigation";  

export const StudioSidebar = () => {   
  const pathName = usePathname();   

  return (     
    <Sidebar className="pt-16 z-40" >{/* Ensure collapsible uses a boolean */}
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={pathName === "/studio"} tooltip="Content">
                <Link href="/studio">
                  <VideoIcon className="size-5" />       
                  <span className="text-lg">Content</span>     
                </Link>   
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Exit studio">
                <Link href="/" onClick={() => console.log("exiting studio")}>
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
