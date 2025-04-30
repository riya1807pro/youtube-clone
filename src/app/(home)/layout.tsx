import HomeLayout from "@/modules/home/ui/layout/home-layout";

interface layoutProps {
  children: React.ReactNode;
}
//  todo : confirm if needed 
export const dynamic = "force-dynamic";


const Layout = ({ children }: layoutProps) => {
  return <HomeLayout>{children}</HomeLayout>;
};

export default Layout;
