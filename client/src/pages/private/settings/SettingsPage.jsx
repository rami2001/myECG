import useUser from "@/hooks/useUser";

import UserForm from "@/components/UserForm";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { USER_ROUTE } from "@/api/routes";
import useLogout from "@/hooks/useLogout";

const UserDialog = ({ user, setUser }) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="mb-4">Mise à jour du compte</DialogTitle>
        <DialogDescription>Mettez à jour votre compte</DialogDescription>
      </DialogHeader>
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

const SettingsPage = () => {
  const { user, setUser, loading, error } = useUser();

  return (
    <section className="p-8 sm:p-12 md:p-16">
      <h1>Paramètres</h1>
      <Separator className="my-8 px-2" />

      <section className="mt-4 space-y-8">
        <h2>Mon compte</h2>
        <Separator className="my-8 max-w-screen-md" />
        <Card className="max-w-screen-md">
          <CardHeader>
            <CardTitle>Modifier mon compte</CardTitle>
            <CardDescription>
              Appuyez ici pour mettre à jour les informations de votre compte.
            </CardDescription>
          </CardHeader>
          <Separator className="mb-6" />
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto">Modifier</Button>
              </DialogTrigger>
              <UserDialog user={user} setUser={setUser} />
            </Dialog>
          </CardFooter>
        </Card>
        <Card className="max-w-screen-md">
          <CardHeader>
            <CardTitle>Supprimer mon compte</CardTitle>
            <CardDescription>
              Supprimez votre compte ainsi que vos ECGs.
            </CardDescription>
          </CardHeader>
          <Separator className="mb-6" />
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto">Supprimer</Button>
              </DialogTrigger>
              <DeleteDialog user={user} setUser={setUser} />
            </Dialog>
          </CardFooter>
        </Card>
      </section>
    </section>
  );
};

export default SettingsPage;
