import { USER_ROUTE } from "@/api/routes";

import { axiosPrivate } from "@/api/axios";

import useUser from "@/hooks/useUser";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useLogout from "@/hooks/useLogout";

import UserForm from "@/components/UserForm";
import PasswordForm from "@/components/PasswordForm";

import { useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const UserDialog = ({ user, setUser }) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Mise à jour du compte</DialogTitle>
        <DialogDescription>Mettez à jour votre compte</DialogDescription>
      </DialogHeader>
        <Separator/>
      <UserForm user={user} setUser={setUser} />
    </DialogContent>
  );
};

const DeleteDialog = ({ setUser }) => {
  const axiosPrivate = useAxiosPrivate();
  const { logout } = useLogout();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete(USER_ROUTE);
      await logout();

      toast({
        title: "Fait.",
        description: "Compte supprimé avec succès",
      });

      setUser({});
      navigate("/home", { replace: true });
    } catch (error) {
      if (!error?.response) {
        toast({
          variant: "destructive",
          title: "Vous n'êtes pas connecté à internet.",
          description: "Veuillez réessayer.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.response.data.message,
        });
      }
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Suppression du compte</DialogTitle>
        <DialogDescription>
          Êtes vous sûr de vouloir supprimer votre compte?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose>
          <DialogFooter className="mt-4 flex-row justify-between">
            <DialogClose asChild>
              <Button variant="ghost">Annuler</Button>
            </DialogClose>
            <div onClick={() => handleDelete()}>
              <Button variant="default">Supprimer</Button>
            </div>
          </DialogFooter>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

const PasswordDialog = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Sécurité</DialogTitle>
        <DialogDescription>Mettez à jour votre mot de passe.</DialogDescription>
      </DialogHeader>
      <Separator/>
      <PasswordForm />
    </DialogContent>
  );
};

const SettingsPage = () => {
  const { toast } = useToast();
  const [isChanging, setIsChanging] = useState(false);
  const { user, setUser, loading, error } = useUser();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(user.isParticipating)
  }, [user]);

  const handleChange = async (event) => {
    try {
      setIsChanging(true);

      await axiosPrivate.get("/participation");

      setUser((prevUser) => ({
        ...prevUser,
        isParticipating: !isChecked,
      }));

      setIsChecked((prev) => !prev);
      toast({
        title: "Bien",
        description: isChecked
          ? "Vous ne participez plus au programme de la recherche."
          : "Vous participez maintenant au programme de la recherche."
      });
    } catch (error) {
      console.log(error);
      if (!error?.response) {
        toast({
          variant: "destructive",
          title: "Vous n'êtes pas connecté à internet.",
          description: "Veuillez réessayer.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.response.data.message,
        });
      }
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <section className="p-8 sm:p-12 md:p-16">
      <h1>Paramètres</h1>
      <Separator className="my-8 px-2" />

      <section className="mt-4 max-w-screen-lg space-y-6">
        <div>
          <h4>Modifier mon compte</h4>
          <CardDescription>
            Appuyez ici pour mettre à jour les informations de votre compte.
          </CardDescription>
          <Dialog>
            <DialogTrigger asChild className="flex mt-4">
              <Button variant="outline" className="ml-auto min-w-[16ch]">
                Modifier
              </Button>
            </DialogTrigger>
            <UserDialog user={user} setUser={setUser} />
          </Dialog>
        </div>
        <div>
          <h4>Sécurité</h4>
          <CardDescription>Mettez à jour votre mot de passe.</CardDescription>
          <Dialog>
            <DialogTrigger asChild className="flex mt-4">
              <Button variant="outline" className="ml-auto min-w-[16ch]">
                Mettre à jour
              </Button>
            </DialogTrigger>
            <PasswordDialog />
          </Dialog>
        </div>
        <div>
          <h4>Partager mes données</h4>
          <CardDescription>
            Partagez anonymement vos informations (ECGs, âge, genre) à des institutions ayant besoin de
            données à la recherche.
          </CardDescription>
          <div className="flex mt-8">
            <Switch
              id="participate"
              className="ml-auto"
              disabled={isChanging}
              checked={isChecked}
              onCheckedChange={handleChange}
            />
            <Label htmlFor="participate" className="sr-only">
              Participer
            </Label>
          </div>
          <Separator className="my-6" />
        </div>
        <div>
          <h4>Supprimer mon compte</h4>
          <CardDescription>
            Supprimez votre compte ainsi que vos ECGs.
          </CardDescription>
          <Dialog>
            <DialogTrigger asChild className="flex mt-4">
              <Button variant="destructive" className="ml-auto min-w-[16ch]">
                Supprimer
              </Button>
            </DialogTrigger>
            <DeleteDialog user={user} setUser={setUser} />
          </Dialog>
        </div>
      </section>
    </section>
  );
};

export default SettingsPage;
