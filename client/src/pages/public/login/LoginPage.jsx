import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

import AuthForm from "./AuthForm";

const LoginPage = () => {
  return (
    <section className="py-12">
      <Card className="container lg:max-w-md text-center py-12 px-8">
        <CardTitle>
          <h1>Ravi de vous revoir !</h1>
        </CardTitle>
        <CardDescription>
          <h5>Mot de passe oublié ? </h5>
          <Button variant="link">Demandez-un autre.</Button>
        </CardDescription>
        <Separator className="my-6" />
        <AuthForm />
      </Card>
    </section>
  );
};

export default LoginPage;
