import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <section className="bg-background h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-primary">Chargement</h1>
        <h4 className="text-foreground">Veuillez patienter.</h4>
        <LoaderCircle className="mx-auto stroke-primary size-12 mt-8 animate-spin" />
      </div>
    </section>
  );
};

export default Loading;
