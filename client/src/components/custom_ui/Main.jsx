import { cn } from "@/lib/utils";

const Main = ({ children, className }) => {
  return <main className={cn("flex-1", className)}>{children}</main>;
};

export default Main;
