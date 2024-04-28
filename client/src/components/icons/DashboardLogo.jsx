import { Heart } from "lucide-react";

const DashboardLogo = () => {
  return (
    <div className="group items-center justify-center rounded-full bg-transparent p-2 cursor-pointer hover:bg-primary transition-all duration-150">
      <Heart className="s-5 group-hover:stroke-primary-foreground" />
      <span className="sr-only">myECG</span>
    </div>
  );
};

export default DashboardLogo;
