import { useLocation, Outlet, Navigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";

import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import PrivateLayout from "./private/layout/PrivateLayout";

const ForbiddenPage = () => {
  return (
    <section className="bg-background h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-primary">Erreur 403</h1>
        <h4 className="text-foreground">
          Vous n'avez pas accès à cette ressource.
        </h4>
        <Separator className="mt-4" />
        <Button asChild variant="link">
          <Link to="/home/login">S'authentifier</Link>
        </Button>
      </div>
    </section>
  );
};

const Protected = () => {
  const { user } = useAuth();

  return user?.accessToken ? (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  ) : (
    <ForbiddenPage />
  );
};

export default Protected;
