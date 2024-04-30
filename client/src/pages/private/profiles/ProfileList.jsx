import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import classNames from "classnames";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";

import ProfileForm from "@/components/ProfileForm";

import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProfileList = ({ user }) => {
  const { setUser, currentProfile, setCurrentProfile } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const { toast } = useToast();

  const handleProfileChange = (id) =>
    setCurrentProfile(user.profiles.find((p) => p.id === id));

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete("/profile", {
        data: {
          id: id,
        },
      });

      if (currentProfile.id === id) setCurrentProfile(user.profiles[0]);

      setUser({
        ...user,
        profiles: user.profiles.filter((profile) => profile.id !== id),
      });

      toast({
        title: "Fait.",
        description: "Profile supprimé avec succès",
      });
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
    user &&
    user?.profiles?.map((profile) => (
      <Card key={profile.id} className="md:max-w-screen-md mt-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {profile.pseudonym ? profile.pseudonym : profile.username}
            {profile.username === user.username && (
              <Badge className="max-w-fit font-medium">Profile de base</Badge>
            )}
          </CardTitle>
          <CardDescription>@{profile.username}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {profile.gender === "male" ? "Né" : "Née"} le :{" "}
            {format(profile.dateOfBirth, "do MMMM yyyy", { locale: fr })}
          </p>
          <p>
            Age :{" "}
            {formatDistanceToNow(profile.dateOfBirth, {
              locale: fr,
            })}
          </p>
          <p>Sexe : {profile.gender === "male" ? "Homme" : "Femme"}</p>
        </CardContent>
        <Separator className="mb-4" />
        <CardFooter className="flex">
          {profile.username !== user.username && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mr-auto">
                  Supprimer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="mb-4">
                    Supprimer {profile.username}
                  </DialogTitle>
                  <DialogDescription>
                    Voulez-vous vraiment supprimer le profile{" "}
                    {profile.pseudonym} ?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex-row justify-between">
                  <DialogClose asChild>
                    <Button variant="ghost">Annuler</Button>
                  </DialogClose>
                  <div onClick={() => handleDelete(profile.id)}>
                    <Button variant="default">Supprimer</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {profile.username !== user.username && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="ml-auto mr-4">
                  Editer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-4">
                    Modifier {profile.username}
                  </DialogTitle>
                </DialogHeader>
                <ProfileForm profile={profile} />
              </DialogContent>
            </Dialog>
          )}

          <Button
            onClick={() => handleProfileChange(profile.id)}
            className={classNames({
              "ml-auto mr-0": profile.username === user.username,
            })}
            disabled={profile.id === currentProfile.id}
            variant={profile.id === currentProfile.id ? "ghost" : "default"}
          >
            {profile.id === currentProfile.id ? "Choisi" : "Choisir"}
          </Button>
        </CardFooter>
      </Card>
    ))
  );
};

export default ProfileList;
