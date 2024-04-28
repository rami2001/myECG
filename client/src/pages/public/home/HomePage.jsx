import Section from "@/components/custom_ui/Section";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Atom, HeartPulse, Scan, UserRoundPlus } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const HomePage = () => {
  return (
    <>
      <Section className="text-center">
        <Section className="bg-background py-20 w-full">
          <h1>Découvrez myECG</h1>
          <h4>Scannez vos ECGs en une photo.</h4>
          <Section className="my-8">
            <Button asChild className="text-lg w-[28ch]">
              <Link to="api">Utilisez notre API</Link>
            </Button>
            <p className="mt-1 text-muted-foreground text-sm">(Gratuitement)</p>
          </Section>
        </Section>
        <Section className="my-16 px-4 md:px-16 lg:px-24">
          <div className="grid h-auto gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="">Un seul compte</CardTitle>
                <UserRoundPlus className="s-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="text-left text-muted-foreground">
                <Separator className="my-2" />
                Un seul compte pour les ECGs de votre entourage, grâce à
                l'option de création de profiles.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="">Scannez</CardTitle>
                <Scan className="s-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="text-left text-muted-foreground">
                <Separator className="my-2" />
                Grâce à une simple photo, numérisez votre ECG et obtenez un
                graphe mathématique.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="">Votre santé</CardTitle>
                <HeartPulse className="s-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="text-left text-muted-foreground">
                <Separator className="my-2" />
                Obtenez une estimation de votre état cardiaque grâce à
                l'informatique.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="">Participez</CardTitle>
                <Atom className="s-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="text-left text-muted-foreground">
                <Separator className="my-2" />
                Vos données anonymes serviront à faire avancer la science grâce
                à la corrélation de l'ECG avec d'autres maladies via l'IA.
              </CardContent>
            </Card>
          </div>
        </Section>
      </Section>
    </>
  );
};

export default HomePage;
