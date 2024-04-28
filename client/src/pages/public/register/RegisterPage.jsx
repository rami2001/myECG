import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

import UserForm from "./UserForm";

const RegisterPage = () => {
  return (
    <section>
      <Card className="my-16 container">
        <CardTitle>
          <h1>Bienvenue !</h1>
        </CardTitle>
        <CardDescription>
          <h5>Vous avez déjà un compte ?</h5>
          <Button asChild variant="link">
            <Link to="/home/login">Connectez-vous.</Link>
          </Button>
        </CardDescription>
        <Separator className="my-6 sm:hidden" />
        <UserForm />
      </Card>
    </section>
  );
};

export default RegisterPage;
