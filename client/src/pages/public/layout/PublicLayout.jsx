import { Outlet } from "react-router-dom";

import Header from "@/pages/public/layout/Header";

import Frame from "@/components/custom_ui/Frame";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";

const PublicLayout = ({ className }) => {
  return (
    <div id="app--bg" className="h-[100vh] md:py-[6vh] md:px-[3.5vw]">
      <Frame className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
            <Outlet />
          </ScrollArea>
        </main>
      </Frame>
      <Toaster />
    </div>
  );
};

export default PublicLayout;
