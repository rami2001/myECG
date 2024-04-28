import { Outlet } from "react-router-dom";

import { cn } from "@/lib/utils";

import Frame from "@/components/custom_ui/Frame";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/pages/private/layout/Header";

const PrivateLayout = ({ className }) => {
  return (
    <div
      id="app--bg"
      className="overflow-hidden h-[100vh] md:py-[8vh] md:px-[3.5vw]"
    >
      <Frame className="flex flex-col lg:flex-row">
        <Header />
        <ScrollArea className="grow">
          <main className={cn("md:h-[70vh] bg-orange-500", className)}>
            ABCD
            <Outlet />
          </main>
        </ScrollArea>
      </Frame>
      <Toaster />
    </div>
  );
};

export default PrivateLayout;
