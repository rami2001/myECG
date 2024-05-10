import { LoaderCircle } from "lucide-react";

const Loading = ({ message }) => {
  return (
    <div className="w-full grid place-items-center">
      <h2>Chargement</h2>
      <LoaderCircle className="stroke-primary mt-4 s-16 animate-spin" />
      <p className="text-muted-foreground italic font-thin mt-4">{message}</p>
    </div>
  );
};

export default Loading;
