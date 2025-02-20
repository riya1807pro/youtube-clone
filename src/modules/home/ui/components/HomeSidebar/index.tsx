"use Client";
import { SidebarContent, Sidebar } from "@/components/ui/sidebar";
import { Main_Section } from "./main-section";
import { Separator } from "@/components/ui/separator";
import { Personal_Section } from "./personal-section copy";

export const HomeSlidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none " collapsible="icon">
      <SidebarContent className="bg-background">
        <Main_Section />
        <Separator/>
        <Personal_Section/>
      </SidebarContent>
    </Sidebar>
  );
};
