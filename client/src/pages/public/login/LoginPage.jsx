import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import AuthForm from "../../../components/AuthForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <section className="px-10 grid place-content-center">
      <Card className="my-12 bg-background sm:max-w-screen-md text-center py-12 px-8 sm:px-12">
        <CardTitle>Ravi de vous revoir !</CardTitle>
        <CardDescription>
          Mot de passe oublié?
          <br />
          <Link to="/home/login/reset">
            <Button variant="link">Demandez-un autre.</Button>
          </Link>
        </CardDescription>
        <Separator className="my-6" />
        <CardContent>
          <AuthForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginPage;
