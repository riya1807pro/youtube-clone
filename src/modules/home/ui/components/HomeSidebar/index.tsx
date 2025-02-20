"use Client";
import { SidebarContent, Sidebar } from "@/components/ui/sidebar";
import { Main_Section } from "./main-section";

export const HomeSlidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none ">
      <SidebarContent className="bg-background">
        <Main_Section />
      </SidebarContent>
    </Sidebar>
  );
};
