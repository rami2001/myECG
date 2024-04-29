import { Outlet } from "react-router-dom";

import Header from "@/pages/public/layout/Header";
import Footer from "@/pages/public/layout/Footer";

import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";

const PublicLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  );
};

export default PublicLayout;
