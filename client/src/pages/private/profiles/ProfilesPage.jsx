import { Separator } from "@/components/ui/separator";
import useAuth from "@/hooks/useAuth";

import ProfileForm from "@/components/ProfileForm";
import ProfileList from "./ProfileList";
import { Card } from "@/components/ui/card";

const ProfilesPage = () => {
  const { user } = useAuth();

  return (
    <>
      <section className="px-8 sm:p-12 md:p-16">
        <h1>Mes profiles</h1>
      </section>
      <Separator/>
      <section className="px-8 sm:p-12 md:p-16">
        <h2>Créer un profile</h2>
        <Separator className="my-8 max-w-screen-md" />
        <Card className="max-w-screen-md p-8">
          <ProfileForm />
        </Card>
      </section>
      <section className="px-8 sm:px-12 md:px-16 mb-16">
        <h2>Mes profiles</h2>
        <Separator className="my-8 max-w-screen-md" />
        <ProfileList user={user} />
      </section>
    </>
  );
};

export default ProfilesPage;
