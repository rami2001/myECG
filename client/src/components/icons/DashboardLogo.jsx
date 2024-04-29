import { Heart } from "lucide-react";

const DashboardLogo = () => {
  return (
    <div className="group items-center justify-center rounded-full bg-transparent p-2 cursor-pointer transition-all duration-150">
      <Heart className="s-5 group-hover:stroke-primary" />
      <span className="sr-only">myECG</span>
    </div>
  );
};

export default DashboardLogo;
