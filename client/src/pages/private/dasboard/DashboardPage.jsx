import useUser from "@/hooks/useUser";

import { Camera } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Banner = ({ user, loading, error }) => {
  if (loading)
    return (
      <Card className="text-center md:text-start ">
        <CardHeader>
          <div className="sm:flex flex-row items-center gap-8">
            <Skeleton className="size-24 rounded-full mx-auto sm:m-[initial] mb-2" />
            <span>
              <CardTitle>
                <Skeleton className="h-4 w-[60%] md:w-[24ch] mb-2" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-[60%] md:w-[24ch]" />
              </CardDescription>
            </span>
          </div>
        </CardHeader>
      </Card>
    );

  return (
    user && (
      <Card className="text-center md:text-start">
        <CardHeader>
          <div className="sm:flex flex-row items-center gap-8">
            <Avatar className="size-24 mx-auto sm:m-[initial] cursor-pointer group">
              <AvatarImage className="group-hover:brightness-[.35] transition duration-150"></AvatarImage>
              <AvatarFallback className="group-hover:brightness-[.35] transition duration-150">
                Photo
              </AvatarFallback>
              <Camera className="opacity-0 transition duration-150 group-hover:opacity-100 absolute inset-0 m-auto size-9" />
            </Avatar>
            <span>
              <CardTitle>
                {user.pseudonym ? user.pseudonym : user.username}
              </CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </span>
          </div>
          <CardContent>Hello world</CardContent>
        </CardHeader>
      </Card>
    )
  );
};

const DashboardPage = () => {
  const { user, loading, error } = useUser();

  return (
    <section className="p-8 sm:p-12 md:p-16">
      <h1>Tableau de bord</h1>
      <Separator className="my-8 px-2" />
      <Banner user={user} loading={loading} error={error} />
    </section>
  );
};

export default DashboardPage;
