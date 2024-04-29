import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const Missing = () => {
  return (
    <section className="bg-background h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-primary">Erreur 404</h1>
        <h4 className="text-foreground">Ressource introuvable.</h4>
        <Separator className="mt-2" />
        <Button asChild variant="link">
          <Link to="/home">Aller à l'accueil</Link>
        </Button>
      </div>
    </section>
  );
};

export default Missing;
