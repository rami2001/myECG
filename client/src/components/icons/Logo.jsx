import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

const Logo = ({ className }) => {
  return (
    <div className={cn("isolate flex gap-1 place-items-center", className)}>
      <Heart className="z-0 size-8 fill-primary/5 stroke-primary" />
      <h1 className="z-10 text-foreground bg-transparent text-2xl leading-none">
        myECG
      </h1>
    </div>
  );
};

export default Logo;
