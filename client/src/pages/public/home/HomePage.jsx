import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Atom, Scan, UserRoundPlus, LineChart } from "lucide-react";

const cards = [
  {
    title: "Un seul compte",
    description:
      "Un seul compte pour les ECGs de votre entourage, grâce à l'option de création de profils.",
    icon: (classname) => <UserRoundPlus className={classname} />,
  },
  {
    title: "Scannez",
    description:
      "D'une simple photo, scannez instantanément vos ECGs à partir de photos de votre appareil.",
    icon: (classname) => <Scan className={classname} />,
  },
  {
    title: "Numérisez",
    description:
      "Obtenez vos ECGs sous format numérique directement sur l'application ou téléchargez-les.",
    icon: (classname) => <LineChart className={classname} />,
  },
  {
    title: "Participez",
    description:
      "Partagez vos données anonymement auprès d'entités de confiance afin de faire avancer les recherches scientifiques.",
    icon: (classname) => <Atom className={classname} />,
  },
];

const HomePage = () => {
  return (
    <>
      <section className="bg-background min-h-[50vh] border-b border-muted grid place-content-center">
        <div className="container text-center">
          <h1>Découvrez myECG</h1>
          <h4>Scannez vos ECGs en une photo.</h4>
          <Separator className="px-16 my-8" />
          <section>
            <Button asChild className="px-24 py-6">
              <Link to="api">Utilisez notre Dataset</Link>
            </Button>
            <p className="mt-2 text-muted-foreground text-sm font-thin italic">
              (Gratuitement)
            </p>
          </section>
        </div>
      </section>
      <section className="mt-16 mb-32 px-4 md:px-16 lg:px-24">
        <div className="grid h-auto gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {cards.map((item) => (
            <Card key={item.title}>
              <CardHeader className="flex flex-row justify-between pb-0">
                <CardTitle className="">{item.title}</CardTitle>
                {item.icon("s-5 stroke-card-foreground")}
              </CardHeader>
              <Separator className="my-4" />
              <CardContent className="text-left text-sm text-muted-foreground italic font-thin">
                {item.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
