import { useState } from "react";
import { useForm } from "react-hook-form";
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
  const { toast } = useToast();

  const onSubmit = async (values) => {
    const { id, password } = values;
    setLoading(true);

    try {
      console.log(await auth(id, password));
      toast({
        title: "Connexion avec succès !",
        description: "Rendez-vous à la page de connexion.",
      });
    } catch (error) {
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-4 md:px-6 md:w-[75%] lg:px-12 py-6 md:py-8 lg:py-12 space-y-4 lg:w-1/2"
      >
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
        <div>
          <div className="lg:flex lg:flex-row-reverse lg:justify-between lg:align-middle mt-12">
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
            >
              &larr; Revenir à l'accueil
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AuthForm;
