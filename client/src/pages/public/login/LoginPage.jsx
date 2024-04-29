import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import AuthForm from "./AuthForm";

const LoginPage = () => {
  return (
    <section className="px-10 grid place-content-center">
      <Card className="my-12 sm:max-w-screen-md text-center py-12 px-8 sm:px-12">
        <CardTitle>Ravi de vous revoir !</CardTitle>
        <CardDescription>
          Mot de passe oublié?
          <br />
          <Button variant="link">Demandez-un autre.</Button>
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
