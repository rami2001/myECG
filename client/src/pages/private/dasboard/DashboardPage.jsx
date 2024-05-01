import useAuth from "@/hooks/useAuth";

import ProfilePicker from "@/components/ProfilePicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <>
      <section className="p-8 sm:p-12 md:p-16">
        <h1>Tableau de bord</h1>
        <Separator className="my-8 px-2" />
        <Card className="max-w-screen-md p-4">
          <CardHeader>
            <CardTitle>Sélectionner votre profile</CardTitle>
            <CardDescription>Chaque profile est indépendant</CardDescription>
            <Separator />
          </CardHeader>
          <CardContent>{/* <ProfilePicker /> */}</CardContent>
        </Card>
      </section>
    </>
  );
};

export default DashboardPage;
