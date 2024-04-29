import { format, formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { fr } from "date-fns/locale";
import useAuth from "@/hooks/useAuth";

import ProfileForm from "@/components/ProfileForm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import classNames from "classnames";
import { Badge } from "@/components/ui/badge";

const ProfilesPage = () => {
  const { user, currentProfile, setCurrentProfile } = useAuth();

  const handleProfileChange = (id) =>
    setCurrentProfile(user.profiles.find((p) => p.id === id));

  return (
    <>
      <section className="p-8 sm:p-12 md:p-16">
        <h1>Créer un profile</h1>
        <Separator className="my-8 max-w-screen-md" />
        <Card className="md:max-w-screen-md p-6">
          <ProfileForm />
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
                    <Button variant="outline" className="mr-auto">
                      Supprimer
                    </Button>
                    <Button variant="ghost" className="ml-auto mr-4">
                      Editer
                    </Button>
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
