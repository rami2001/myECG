import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/api/userController";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { registerSchema } from "@/lib/formSchemas";

const UserForm = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema),
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (values) => {
    const { email, username, gender, dateOfBirth, password } = values;
    setLoading(true);

    try {
      await register(email, username, gender, dateOfBirth, password);

      toast({
        title: "Inscription avec succès !",
        description: "Rendez-vous à la page de connexion.",
      });
    } catch (error) {
      if (!error?.response) {
        toast({
          variant: "destructive",
          title: "Vous n'êtes pas connecté à internet.",
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Adresse e-mail</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  type="email"
                  placeholder="Adresse mail"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Username</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Nom d'utilisateur"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Username</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  type="date"
                  placeholder="Date de naîssance"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />
        <Select
          className="lg:w-2/5"
          disabled={loading}
          onValueChange={(value) => form.setValue("gender", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Homme</SelectItem>
            <SelectItem value="female">Femme</SelectItem>
          </SelectContent>
        </Select>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Mot de passe</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  type="password"
                  placeholder="Mot de passe"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">
                Confirmation du mot de passe
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  disabled={loading}
                  placeholder="Confirmation du mot de passe"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />
        <div>
          <div className="lg:flex lg:flex-row-reverse lg:justify-between lg:align-middle mt-12">
            <Button
              type="submit"
              disabled={loading}
              className="w-full lg:w-[initial]"
            >
              S'inscrire
            </Button>
            <Button
              variant="link"
              disabled={loading}
              className="w-full lg:w-[initial] text-center"
              asChild
            >
              <Link to="/home">&larr; Revenir à l'accueil</Link>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
