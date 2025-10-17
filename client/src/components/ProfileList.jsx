import SubProfilePictureUploader from "./SubProfilePictureUploader";

import { PROFILE_ROUTE } from "@/api/routes";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Loading from "./Loading";
import Error from "./Error";
import { Camera, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const Profile = ({ profile, setProfiles }) => {
  const axiosPrivate = useAxiosPrivate();
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axiosPrivate.get(`profile/image/${profile.id}`, {
          responseType: "blob",
        });

        const image = new Blob([response.data], { type: response.data.type });
        const url = URL.createObjectURL(image);

        setImageURL(url);
      } catch (error) {
        //
      }
    };

    fetchImage();
  }, []);

  return (
    <li>
      <Card className="min-h-96 text-center rounded-xl bg-background shadow-md relative">
        <CardHeader>
          <div className="w-full flex justify-center mb-8">
            <SubProfilePictureUploader
              profile={profile}
              setProfiles={setProfiles}
            >
              <Avatar className="size-24 mx-auto sm:m-[initial] cursor-pointer group">
                <AvatarImage
                  className="ml-auto group-hover:brightness-[.35] transition duration-150"
                  src={imageURL}
                />
                <AvatarFallback className="group-hover:brightness-[.35] transition duration-150">
                  {profile?.username || "None"}
                </AvatarFallback>
                <Camera className="opacity-0 transition duration-150 group-hover:opacity-100 absolute inset-0 m-auto size-9" />
              </Avatar>
            </SubProfilePictureUploader>
          </div>
          <CardTitle className="mt-8">
            {profile?.pseudonym
              ? profile?.pseudonym
              : profile?.username || "Profil inconnu"}
          </CardTitle>
          <CardDescription>@{profile?.username || "Inconnu"}</CardDescription>
        </CardHeader>
        <Separator className="max-w-[80%] mx-auto" />
        {!profile.pseudonym && (
          <CardFooter className="grid mt-16">
            <Badge className="mx-auto font-medium mb-4">Profile de base</Badge>
          </CardFooter>
        )}
        {profile?.pseudonym && (
          <>
            <CardFooter className="grid mt-6 gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Editer</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="mb-4">
                      Modifier {profile?.username}
                    </DialogTitle>
                    <DialogDescription>
                      Mettez à jour les informations liées au profil à travers
                      ce formulaire.
                    </DialogDescription>
                  </DialogHeader>
                  <Separator />
                  <ProfileForm profile={profile} setProfiles={setProfiles} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Supprimer</Button>
                </DialogTrigger>
                <DeleteDialog profile={profile} setProfiles={setProfiles} />
              </Dialog>
            </CardFooter>
          </>
        )}
      </Card>
    </li>
  );
};

const DeleteDialog = ({ profile, setProfiles }) => {
  const axiosPrivate = useAxiosPrivate();

  const { toast } = useToast();

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(`profile/image/${id}`);

      await axiosPrivate.delete(PROFILE_ROUTE, {
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

const ProfileList = ({ profiles, setProfiles, error, loading }) => {
  if (loading) return <Loading message={"Chargement des profils"} />;

  if (error) return <Error message={error.message || "Erreur inconnue"} />;

  return (
    <ul className="max-w-screen-xl min-h-96 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-between">
      {profiles &&
        profiles.map((profile) => (
          <Profile
            key={profile?.username}
            profile={profile}
            setProfiles={setProfiles}
          />
        ))}
      <li>
        <Dialog>
          <DialogTrigger asChild>
            <Card className="bg-background cursor-pointer hover:bg-card min-h-96 text-center rounded-xl transition duration-150 group grid place-items-center">
              <CardHeader>
                <div>
                  <Plus
                    className="size-16 group-hover:stroke-card-foreground stroke-muted mx-auto transition duration-150"
                    strokeWidth={1}
                  ></Plus>
                  <p className="group-hover:text-card-foreground text-xs text-muted italic">
                    Créer un nouveau profile
                  </p>
                </div>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-4">
                Créer un nouveau profil
              </DialogTitle>
              <DialogDescription>
                Saisissez les informations du profil que vous souhaitez créer.
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <ProfileForm setProfiles={setProfiles} />
          </DialogContent>
        </Dialog>
      </li>
    </ul>
  );
};

export default ProfileList;
