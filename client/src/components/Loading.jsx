import { LoaderCircle } from "lucide-react";

const Loading = ({ message }) => {
  return (
    <div className="max-w-screen-md grid place-items-center">
      <h2>Chargement</h2>
      <LoaderCircle className="stroke-primary s-16 animate-spin" />
      <p className="text-muted-foreground italic font-thin mt-4">{message}</p>
    </div>
  );
};

export default Loading;
