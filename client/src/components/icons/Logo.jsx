import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

const Logo = ({ className }) => {
  return (
    <div className={cn("isolate flex gap-1 place-items-center", className)}>
      <Heart className="size-8 stroke-primary" />
      <h1 className="z-10 text-2xl text-foreground leading-none">myECG</h1>
    </div>
  );
};

export default Logo;
