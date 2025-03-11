import { SidebarProvider } from "@/components/ui/sidebar";
import HomeNavbar from "../components/studio-navbar";
import { StudioSidebar } from "../components/StudioSidebar";

interface StudioLayoutProps {
  children: React.ReactNode;
}

const StudioLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider className="w-full">
      <HomeNavbar />
      <div className="flex min-h-screen pt-[4rem]">
        <StudioSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>{" "}
      </div>
    </SidebarProvider>
  );
};

export default StudioLayout;
