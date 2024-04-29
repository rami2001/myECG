import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import Header from "@/pages/private/layout/Header";

const PrivateLayout = ({ className }) => {
  return (
    <>
      <Header />
      <main className="lg:px-16 h-screen">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
};

export default PrivateLayout;
