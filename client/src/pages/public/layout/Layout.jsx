import Header from "@/pages/public/layout/Header";

import Frame from "@/components/custom_ui/Frame";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";

const Layout = ({ children, className }) => {
  return (
    <div className="overflow-hidden h-[100vh] md:py-[8vh] md:px-[3.5vw]">
      <Frame>
        <Header />
        <ScrollArea className="md:h-[75vh]">
          <main className={cn("md:h-[75vh]", className)}>{children}</main>
        </ScrollArea>
        <footer></footer>
      </Frame>
      <Toaster />
    </div>
  );
};

export default Layout;
