import useProfiles from "@/hooks/useProfiles";

import { Separator } from "@/components/ui/separator";

import ProfileList from "@/components/ProfileList";

const ProfilesPage = () => {
  const { profiles, setProfiles, error, loading } = useProfiles();

  return (
    <section className="p-8 sm:p-12 md:p-16">
      <h1>Mes profils</h1>
      <Separator className="my-8 px-2" />
      <section className="mt-12">
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
