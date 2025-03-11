
import StudioLayout from "@/modules/studio/ui/layout/studio-layout";

interface layoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: layoutProps) => {
  return <StudioLayout>{children}</StudioLayout>;
};

export default Layout;
