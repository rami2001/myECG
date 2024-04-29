import { Link } from "react-router-dom";

import Section from "@/components/custom_ui/Section";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  return (
    <section className="text-center mb-32">
      <section className="bg-background min-h-[50vh] border-b border-muted grid place-content-center">
        <div className="container max-w-screen-lg px-16">
          <h1>A propos de myECG</h1>
          <h4>
            myECG est une application multi-plateforme développée dans le but
            d'éxploiter les capacités de l'IA dans la numérisation d'images
            (Computer Vision) et le traîtement de données.
          </h4>
          <p className="text-muted-foreground italic font-thin mt-8">
            Cette application a été crée dans le cadre d'une thèse de Master à
            l'unniversité de Béjaïa.
          </p>
        </div>
      </section>
      <section className="my-16 px-4 lg:px-8">
        <h1>Notre équipe</h1>
        <Section className="mt-8">
          <div className="grid h-auto gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="">SIDER Abderrahmane</CardTitle>
                <Badge>Encadrant</Badge>
              </CardHeader>
              <CardContent className="text-left font-thin text-sm text-muted-foreground">
                <Separator className="my-2" />
                abderrahmane.sider@univ-bejaia.dz
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="">TITOUN Rami</CardTitle>
                <Badge variant="secondary">Développeur</Badge>
              </CardHeader>
              <CardContent className="text-left font-thin text-sm text-muted-foreground">
                <Separator className="my-2" />
                rami.titoun@se.univ-bejaia.dz
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="">BOUNCEUR Mohand</CardTitle>
                <Badge variant="secondary">Développeur</Badge>
              </CardHeader>
              <CardContent className="text-left font-thin text-sm text-muted-foreground">
                <Separator className="my-2" />
                mohand.bounceur@se.univ-bejaia.dz
              </CardContent>
            </Card>
          </div>
        </Section>
      </section>
    </section>
  );
};

export default AboutPage;
