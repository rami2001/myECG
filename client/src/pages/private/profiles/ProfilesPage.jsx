import useProfiles from "@/hooks/useProfiles";

import { Separator } from "@/components/ui/separator";

import ProfileForm from "@/components/ProfileForm";
import ProfileList from "@/components/ProfileList";

import { Card } from "@/components/ui/card";

const ProfilesPage = () => {
  const { profiles, setProfiles } = useProfiles();

  return (
    <section className="p-8 sm:p-12 md:p-16">
      <h1>Mes profils</h1>
      <Separator className="my-8 px-2" />

      <section className="mt-4">
        <h2>Créer un profil</h2>
        <Separator className="my-8 max-w-screen-md" />
        <Card className="max-w-screen-md p-8">
          <ProfileForm profile={null} setProfiles={setProfiles} />
        </Card>
      </section>

      <section className="mt-12">
        <h2>Liste des profils</h2>
        <Separator className="my-8 max-w-screen-md" />
        <ProfileList profiles={profiles} setProfiles={setProfiles} />
      </section>
    </section>
  );
};

export default ProfilesPage;
