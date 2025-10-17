import { FlaskConical, PlusIcon } from "lucide-react";
import useUser from "@/hooks/useUser";
import { Link } from "react-router-dom";
import EcgForm from "@/components/EcgForm";
import getAge from "@/util/getAge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useProfiles from "@/hooks/useProfiles";

const EcgDialog = ({ children }) => {
  const { profiles } = useProfiles();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Soumettre un ECG</DialogTitle>
          <DialogDescription>
            Scannez un ECG et obtenez sa version numérisée.
            <Separator className="my-4" />
          </DialogDescription>
        </DialogHeader>
        <EcgForm profile={profiles[0]} canDisable={false}/>
      </DialogContent>
    </Dialog>
  );
};

const DashboardPage = () => {
  const { user, setUser, loading, error } = useUser();
  const axiosPrivate = useAxiosPrivate();
  const [stats, setStats] = useState({ profileCount: 0, ecgCount: 0 });

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await axiosPrivate.get("/user/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (user) {
      getStats();
    }
  }, [user]);

  return (
    <section className="p-8 sm:p-12 md:p-16 max-w-screen-2xl">
      <h1>Tableau de bord</h1>
      <Separator className="mt-8 mb-3 px-2" />
      <div className="grid grid-cols-1 xl:grid-cols-10 grid-rows-[auto auto 1fr] gap-3 max-h-fit">
        <Card className="md:col-span-10 h-min text-xs muted px-2 sm:px-4 md:px-6 py-3 bg-background">
          <CardDescription className="flex items-center divide-x">
            <FlaskConical
              className={`size-5 mr-4 invisible md:visible ${
                user.isParticipating ? "text-primary rotate-12" : "rotate-0"
              }`}
            />
            <div
              className={`px-4 ${
                user.isParticipating ? "text-foreground" : ""
              }`}
            >
              {user.isParticipating
                ? "Vous pariticipez au progamme de la recherche en partageant vos données."
                : "Vous ne participez pas au programme de recherche."}
            </div>
            <Link
              to="/dashboard/settings"
              className="pl-4 ml-auto text-primary"
            >
              En savoir plus?
            </Link>
          </CardDescription>
        </Card>

        <Card className="md:col-span-8 row-span-3 bg-background relative">
          <div>
            <CardHeader>
              <CardTitle className="text-4xl">
                Bienvenue, {user.pseudonym ? user.pseudonym : user.username}.
              </CardTitle>
              <CardDescription>
                Appuyez n'importe où ici pour soumettre un ECG.
              </CardDescription>
            </CardHeader>
          </div>
          <CardContent>
            <Separator className="mb-6" />
            <EcgDialog>
              <CardFooter className="min-h-96 bg-background rounded-lg border text-muted cursor-pointer hover:bg-card hover:border-card hover:text-card-foreground group transition-all delay-150">
                <div className="max-w-fit m-auto flex flex-col items-center gap-4">
                  <PlusIcon className="size-24" strokeWidth={1}></PlusIcon>
                  <h3 className="text-muted transition delay-150 group-hover:text-card-foreground">
                    Soumettre un ECG
                  </h3>
                </div>
              </CardFooter>
            </EcgDialog>
            <Separator className="my-6" />
            <p className="leading-5 text-sm">
              Merci de signaler les cas d'erreurs lors du scan et de la
              numérisation, vous êtes notre priorité et votre feedback est le
              bienvenu !
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 row-span-1 text-center bg-background py-8 px-4">
          <CardHeader>
            <CardTitle className="text-8xl text-center">
              {getAge(user.dateOfBirth)[0]}
            </CardTitle>
            <CardDescription>{getAge(user.dateOfBirth)[1]}</CardDescription>
          </CardHeader>
          <Separator />
          <Link to="/dashboard/settings">
            <Button className="mt-8 w-full">Modifier</Button>
          </Link>
        </Card>

        <Card className="md:col-span-2 row-span-1 text-center bg-background py-8 px-4">
          <CardHeader>
            <CardTitle className="text-8xl">
              {String(stats.profileCount).padStart(2, "0")}
            </CardTitle>
            <CardDescription>
              {stats.profileCount === 1 ? "profil créé" : "profils créés"}
            </CardDescription>
          </CardHeader>
          <Separator />
          <Link to="/dashboard/profiles">
            <Button className="mt-8 w-full">Gérer</Button>
          </Link>
        </Card>

        <Card className="md:col-span-2 row-span-1 text-center bg-background py-8 px-4">
          <CardHeader>
            <CardTitle className="text-8xl">
              {String(stats.ecgCount).padStart(2, "0")}
            </CardTitle>
            <CardDescription>
              {stats.ecgCount === 1 ? "ECG soumis" : "ECGs soumis"}
            </CardDescription>
          </CardHeader>
          <Separator />
          <Link to="/dashboard/ecg">
            <Button className="mt-8 w-full">Consulter</Button>
          </Link>
        </Card>
      </div>
    </section>
  );
};

export default DashboardPage;
