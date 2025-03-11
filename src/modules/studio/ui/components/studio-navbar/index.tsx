import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./searchInput";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { StudioSidebarHeader } from "../StudioSidebar/studo-header";
import { StudioUploadModel } from "@/components/studio-upload-model";

const StudioNavbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md">
      <div className="flex items-center w-full gap-4">
        {/* menu and logo */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link href="/">
            <div className="flex items-center gap-1 p-4">
              <Image src="/youtubeLogo.svg" alt="logo" height={50} width={50} />
              <p className="text-xl font-semibold tracking-tight">Youtube</p>
            </div>
          </Link>
        </div>
        {/* SEARCHBAR */}
        <div className="flex-1 flex justify-center max-w-[729px] mx-auto">
          <SearchInput />
        </div>

        <div className="flex-shrink-0 items-center flex gap-4">
          <StudioUploadModel />
          <AuthButton />
        </div>
      </div>
    </div>
  );
};

export default StudioNavbar;
