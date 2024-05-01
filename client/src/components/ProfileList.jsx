import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

import { LoaderCircle } from "lucide-react";

import useProfiles from "@/hooks/useProfiles";
import useUser from "@/hooks/useUser";

import ProfileForm from "@/components/ProfileForm";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const Profile = ({ profile, setProfiles, user }) => {
  return (
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
      {profile.username !== user.username && (
        <>
          <Separator className="mb-4" />
          <CardFooter className="flex">
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
                <ProfileForm profile={profile} setProfiles={setProfiles} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Supprimer</Button>
              </DialogTrigger>
              <DeleteDialog profile={profile} setProfiles={setProfiles} />
            </Dialog>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

const DeleteDialog = ({ profile, setProfiles }) => {
  const axiosPrivate = useAxiosPrivate();

  const { toast } = useToast();

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete("/profile", {
        data: {
          id: id,
        },
      });

      setProfiles((previous) => {
        return previous.filter((p) => p.id !== id);
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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="mb-4">Supprimer {profile.username}</DialogTitle>
        <DialogDescription>
          Voulez-vous vraiment supprimer le profile {profile.pseudonym} ?
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
  );
};

const LoadingProfile = () => {
  return (
    <div className="max-w-screen-md grid place-items-center">
      <p className="text-muted-foreground italic font-thin mb-2">
        Chargement des profiles
      </p>
      <LoaderCircle className="stroke-primary s-16 animate-spin" />
    </div>
  );
};

const Error = ({ error }) => {
  return (
    <div className="bg-destructive text-destructive-foreground max-w-screen-md text-center py-12 px-4 rounded-2xl">
      <h2>Erreur !</h2>
      <p className="text-muted-foreground italic text-sm mt-6">{error}</p>
    </div>
  );
};

const ProfileList = () => {
  const [profiles, setProfiles, error, loading] = useProfiles();
  const [user, userError, userLoading] = useUser();

  if (loading || userLoading) return <LoadingProfile />;

  if (error || userError) return <Error error={error || userError} />;

  return (
    profiles &&
    profiles.map((profile) => (
      <Profile
        key={profile.id}
        profile={profile}
        setProfiles={setProfiles}
        user={user}
      />
    ))
  );
};

export default ProfileList;
