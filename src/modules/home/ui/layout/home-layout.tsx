import { SidebarProvider } from "@/components/ui/sidebar";
import HomeNavbar from "../components/home-navbar";
import { HomeSlidebar } from "../components/HomeSidebar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <SidebarProvider className="w-full">
      <HomeNavbar />
      <div className="flex min-h-screen pt-[4rem]">
        <HomeSlidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>{" "}
      </div>
    </SidebarProvider>
  );
};

export default HomeLayout;
