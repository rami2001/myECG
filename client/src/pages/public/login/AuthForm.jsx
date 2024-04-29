import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";
import { auth } from "@/api/userController";
import { authSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ButtonLoading from "@/components/custom_ui/ButtonLoading";

const AuthForm = () => {
  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      id: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { setUser, setCurrentProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { id, password } = values;
    setLoading(true);

    try {
      const response = await auth(id, password);
      setUser(response.data);
      setCurrentProfile(response.data.profiles[0]);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log(error);
      if (!error?.response) {
        toast({
          variant: "destructive",
          title: "Vous n'ête pas connecté à internet.",
          description: "Veuillez réessayer.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.response.data.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">
                Adresse mail ou nom d'utilisateur
              </FormLabel>
              <FormControl>
                <Input placeholder="Identifiant" {...field} />
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mot de passe" {...field} />
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />
        <br />
        <div className="flex flex-col space-y-2">
          {loading ? (
            <ButtonLoading className="w-full lg:w-[initial]">
              Chargement
            </ButtonLoading>
          ) : (
            <Button
              type="submit"
              disabled={loading}
              className="w-full lg:w-[initial]"
            >
              Se connecter
            </Button>
          )}
          <Button
            variant="link"
            disabled={loading}
            className="w-full lg:w-[initial] text-center"
            asChild
          >
            <Link to="/home">&larr; Revenir à l'accueil</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AuthForm;
