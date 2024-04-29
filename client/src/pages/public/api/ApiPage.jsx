import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const ApiPage = () => {
  return (
    <section className="text-center h-screen grid place-content-center">
      <h1>Utilisez notre API</h1>
      <h4>Numérisez un ECG à partir d'un graphe grâce à notre IA.</h4>
      <div className="mt-16 space-y-4">
        <h4>Retrouvez le code source ici</h4>
        <Button
          asChild
          variant="link"
          className="hover:no-underline bg-primary/15 text-primary font-dm hover:bg-primary hover:text-primary-foreground"
        >
          <Link to="https://github.com/rami2001/myECG">repository GitHub</Link>
        </Button>
      </div>
    </section>
  );
};

export default ApiPage;
