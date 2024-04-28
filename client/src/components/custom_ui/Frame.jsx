import { cn } from "@/lib/utils";

const Frame = ({ children, className }) => {
  return (
    <div
      className={cn(
        "bg-secondary h-[100vh] md:rounded-3xl overflow-hidden md:h-[84vh]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Frame;
