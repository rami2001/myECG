import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

import UserForm from "../../../components/UserForm";

const RegisterPage = () => {
  return (
    <section className="px-16">
      <Card className="mt-12 text-center container py-12 max-w-screen-lg md:flex justify-center items-center">
        <div className="w-full">
          <h1>Bienvenue !</h1>
          <h5>Vous avez déjà un compte ?</h5>
          <Button asChild variant="link">
            <Link to="/home/login">Connectez-vous.</Link>
          </Button>
        </div>
        <Separator className="my-6 sm:hidden" />
        <div className="w-full">
          <UserForm />
        </div>
      </Card>
    </section>
  );
};

export default RegisterPage;
