import { Separator } from "@/components/ui/separator";
import useAuth from "@/hooks/useAuth";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <>
      <section className="p-8 sm:p-12 md:p-16">
        <h1>Tableau de bord {user.username}</h1>
        <Separator className="my-8 px-2" />
      </section>
    </>
  );
};

export default DashboardPage;
