<<<<<<< HEAD
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
=======
interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
>>>>>>> 9f21a4b (internal structure improvements)
      {children}
    </div>
  );
};

export default Layout;
