import { Camera } from "lucide-react";

import useUser from "@/hooks/useUser";

import ProfilePictureUploader from "@/components/ProfilePictureUploader";
import EcgForm from "@/components/EcgForm";
import Error from "@/components/Error";

import {
  Card,
  CardDescription,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Banner = ({ user, setUser, loading, error }) => {
  if (loading)
    return (
      <Card className="text-center md:text-start ">
        <CardHeader>
          <span className="sm:flex flex-row items-center gap-8">
            <Skeleton className="size-24 rounded-full mx-auto sm:m-[initial] mb-2" />
            <span>
              <CardTitle>
                <Skeleton className="h-4 w-[60%] md:w-[24ch] mb-2" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-[60%] md:w-[24ch]" />
              </CardDescription>
            </span>
          </span>
        </CardHeader>
      </Card>
    );

  if (error) {
    return (
      <Error message="Veuillez vérifier que vous êtes connecté à internet." />
    );
  }

  return (
    user && (
      <Card className="text-center md:text-start">
        <CardHeader>
          <span className="sm:flex flex-row items-center gap-8">
            <ProfilePictureUploader setUser={setUser}>
              <Avatar className="size-24 mx-auto sm:m-[initial] cursor-pointer group">
                <AvatarImage
                  className="group-hover:brightness-[.35] transition duration-150"
                  src={user.imageURL}
                />
                <AvatarFallback className="group-hover:brightness-[.35] transition duration-150">
                  {user.username}
                </AvatarFallback>
                <Camera className="opacity-0 transition duration-150 group-hover:opacity-100 absolute inset-0 m-auto size-9" />
              </Avatar>
            </ProfilePictureUploader>
            <span>
              <CardTitle className="mt-4 sm:mt-0">
                {user.pseudonym ? user.pseudonym : user.username}
              </CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </span>
          </span>
        </CardHeader>
      </Card>
    )
  );
};

const EcgDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Ajouter un ECG</DialogTitle>
          <DialogDescription>
            Insérez un ECG et obtenez sa version numérisée.
            <Separator className="my-4" />
          </DialogDescription>
        </DialogHeader>
        <EcgForm />
      </DialogContent>
    </Dialog>
  );
};

const DashboardPage = () => {
  const { user, setUser, loading, error } = useUser();

  return (
    <section className="p-8 sm:p-12 md:p-16">
      <h1>Tableau de bord</h1>
      <Separator className="my-8 px-2" />
      <Banner user={user} setUser={setUser} loading={loading} error={error} />
      <Separator className="my-8 px-2" />
      <h2>Ajouter un ECG</h2>
      <EcgDialog />
    </section>
  );
};

export default DashboardPage;
