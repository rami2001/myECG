import { Link } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MailTo = ({ className, mail, children }) => {
  return (
    <a href={`mailto:${mail}`} className={className}>
      {children}
    </a>
  );
};

const AboutPage = () => {
  return (
    <section className="text-center mb-32">
      <section className="bg-background min-h-[50vh] border-b border-muted grid place-content-center">
        <div className="container max-w-screen-lg px-16">
          <h1>À propos de myECG</h1>
          <h4>
            myECG est une application multi-plateforme développée dans le but
            d'éxploiter les capacités de la science du traitement d'images dans
            la numérisation d'ECGs.
          </h4>
          <p className="text-muted-foreground italic font-thin mt-8 px-16">
            Cette application a été crée dans le cadre d'un mémoire de Master à
            l'unniversité de Abderrahmane MIRA de Béjaïa.
          </p>
        </div>
      </section>
      <section className="my-16 px-4 lg:px-8">
        <h1>Notre équipe</h1>
        <section className="mt-8">
          <div className="grid h-auto gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="">SIDER Abderrahmane</CardTitle>
                <Badge>Encadrant</Badge>
              </CardHeader>
              <CardContent className="text-left font-thin text-sm text-muted-foreground">
                <Separator className="my-2" />
                <MailTo
                  className="text-primary italic"
                  mail="abderrahmane.sider@univ-bejaia.dz"
                >
                  abderrahmane.sider@univ-bejaia.dz
                </MailTo>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="">TITOUN Rami</CardTitle>
                <Badge variant="secondary">Développeur</Badge>
              </CardHeader>
              <CardContent className="text-left font-thin text-sm text-muted-foreground">
                <Separator className="my-2" />
                <MailTo
                  className="text-primary italic"
                  mail="rami.titoun@se.univ-bejaia.dz"
                >
                  rami.titoun@se.univ-bejaia.dz
                </MailTo>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="">BOUNCEUR Mohand</CardTitle>
                <Badge variant="secondary">Développeur</Badge>
              </CardHeader>
              <CardContent className="text-left font-thin text-sm text-muted-foreground">
                <Separator className="my-2" />
                <MailTo
                  className="text-primary italic"
                  mail="mohand.bounceur@se.univ-bejaia.dz"
                >
                  mohand.bounceur@se.univ-bejaia.dz
                </MailTo>
              </CardContent>
            </Card>
          </div>
        </section>
      </section>
    </section>
  );
};

export default AboutPage;
