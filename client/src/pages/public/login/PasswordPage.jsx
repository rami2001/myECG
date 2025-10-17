import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import PasswordForm from "@/components/PasswordForm";

const PasswordPage = () => {
  const { token } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [validationResult, setValidationResult] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getValidation = async () => {
      try {
        await axiosPrivate.get(`public/reset/password/${token}`);
        setValidationResult(true);
      } catch (error) {
        setValidationResult(false);
      }
    };

    if (token) {
      getValidation();
    }
  }, []);

  return (
    <section className="w-full min-h-[85vh] grid place-items-center">
      {validationResult ? (
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Réinitialisation du mot de passe</CardTitle>
            <CardDescription>
              Veuillez entrer un nouveau mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <PasswordForm forgottenPassword={true} token={token} />
          </CardContent>
        </Card>
      ) : (
        <div className="text-center">
          <h1 className="text-primary">Erreur !</h1>
          <h4>Impossible de réinitialiser le mot de passe.</h4>
          <br />
          <p className="text-muted-foreground text-sm italic">
            Ce lien est expiré ou inéxistant.
          </p>
        </div>
      )}
    </section>
  );
};

export default PasswordPage;
