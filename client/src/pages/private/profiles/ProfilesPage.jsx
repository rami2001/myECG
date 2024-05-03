import { Separator } from "@/components/ui/separator";

import useProfiles from "@/hooks/useProfiles";

import ProfileForm from "@/components/ProfileForm";
import ProfileList from "@/components/ProfileList";

import { Card } from "@/components/ui/card";

const ProfilesPage = () => {
  const { profiles, setProfiles, error, loading } = useProfiles();

  return (
    <section className="p-8 sm:p-12 md:p-16">
      <h1>Mes profiles</h1>
      <Separator className="my-8 px-2" />

      <section className="mt-4">
        <h2>Créer un profile</h2>
        <Separator className="my-8 max-w-screen-md" />
        <Card className="max-w-screen-md p-8">
          <ProfileForm profile={null} setProfiles={setProfiles} />
        </Card>
      </section>

      <section className="mt-12">
        <h2>Mes profiles</h2>
        <Separator className="my-8 max-w-screen-md" />
        <ProfileList
          profiles={profiles}
          setProfiles={setProfiles}
          error={error}
          loading={loading}
        />
      </section>
    </section>
  );
};

export default ProfilesPage;
