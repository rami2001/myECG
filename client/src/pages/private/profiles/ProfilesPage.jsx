import { format, formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { fr } from "date-fns/locale";
import useAuth from "@/hooks/useAuth";

import { deleteProfile } from "@/api/profileController";

import ProfileForm from "@/components/ProfileForm";

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
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import classNames from "classnames";
import { Badge } from "@/components/ui/badge";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const ProfilesPage = () => {
  const { user, setUser, currentProfile, setCurrentProfile } = useAuth();
  const { toast } = useToast();
  const axiosPrivate = useAxiosPrivate();

  const handleProfileChange = (id) =>
    setCurrentProfile(user.profiles.find((p) => p.id === id));

  const handleDelete = async (id, profileId) => {
    console.log("Deleting");
    try {
      await axiosPrivate.delete("/profile", {
        data: {
          id: id,
          profileId: profileId,
        },
      });

      if (currentProfile.id === profileId) setCurrentProfile(user.profiles[0]);
      setUser({
        ...user,
        profiles: user.profiles.filter((profile) => profile.id !== profileId),
      });

      toast({
        title: "Fait.",
        description: "Profile supprimé avec succès.",
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
    }
  };

  return (
    <>
      <section className="p-8 sm:p-12 md:p-16">
        <h1>Créer un profile</h1>
        <Separator className="my-8 max-w-screen-md" />
        <Card className="md:max-w-screen-md p-6">
          <ProfileForm profile={null} />
        </Card>
      </section>
      <section className="px-8 sm:px-12 md:px-16">
        <h1>Mes profiles</h1>
        <Separator className="my-8 max-w-screen-md" />
        <div className="space-y-6">
          {user.profiles.map((profile) => (
            <Card key={profile.id} className="md:max-w-screen-md">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {profile.pseudonym ? profile.pseudonym : profile.username}
                  {profile.username === user.username && (
                    <Badge className="max-w-fit font-medium">
                      Profile de base
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>@{profile.username}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  {profile.gender === "male" ? "Né" : "Née"} le :
                  {format(new Date(profile.dateOfBirth), " do MMMM yyyy", {
                    locale: fr,
                  })}{" "}
                  (
                  {formatDistanceToNow(new Date(profile.dateOfBirth), {
                    locale: fr,
                  })}
                  )
                </p>
                <p>Sexe : {profile.gender === "male" ? "Homme" : "Femme"}</p>
              </CardContent>
              <Separator className="mb-4" />
              <CardFooter className="flex">
                {profile.username !== user.username && (
                  <>
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
                          <div
                            onClick={() => handleDelete(user.id, profile.id)}
                          >
                            <Button variant="default">Supprimer</Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="ml-auto mr-4">
                          {console.log(profile)}
                          Editer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="mb-4">
                            Modifier {profile.username}
                          </DialogTitle>
                        </DialogHeader>
                        <ProfileForm profile={profile} userId={user.id} />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
                <Button
                  onClick={() => handleProfileChange(profile.id)}
                  className={classNames({
                    "ml-auto mr-0": profile.username === user.username,
                  })}
                  disabled={profile.id === currentProfile.id}
                  variant={
                    profile.id === currentProfile.id ? "ghost" : "default"
                  }
                >
                  {profile.id === currentProfile.id ? "Choisi" : "Choisir"}
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Separator className="my-8 max-w-screen-md" />
        </div>
      </section>
    </>
  );
};

export default ProfilesPage;
