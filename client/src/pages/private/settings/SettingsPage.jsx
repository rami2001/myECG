import useAuth from "@/hooks/useAuth";

import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  const { user } = useAuth();
  return (
    <>
      <section className="p-8 sm:p-12 md:p-16">
        <h1>Paramètres</h1>
        <Separator className="my-8 px-2" />
      </section>
    </>
  );
};

export default SettingsPage;
