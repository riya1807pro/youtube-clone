<<<<<<< HEAD
import HomeLayout from "@/modules/home/ui/layout/home-layout";

interface layoutProps {
  children: React.ReactNode;
}
//  todo : confirm if needed 
export const dynamic = "force-dynamic";


const Layout = ({ children }: layoutProps) => {
=======
import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
>>>>>>> 9f21a4b (internal structure improvements)
  return <HomeLayout>{children}</HomeLayout>;
};

export default Layout;
