import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { registerSchema, updateUserSchema } from "@/lib/formSchemas";
import { axiosPrivate } from "@/api/axios";

import { USER_ROUTE, REGISTER_ROUTE } from "@/api/routes";

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

const UserForm = ({ user = null, setUser }) => {
  const defaultDateOfBirth = user?.dateOfBirth
    ? format(new Date(user.dateOfBirth), "yyyy-MM-dd")
    : "";

  const schema = user ? updateUserSchema : registerSchema;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email || "",
      username: user?.username || "",
      gender: user?.gender || "",
      dateOfBirth: defaultDateOfBirth || "",
      password: "",
      confirm: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (values) => {
    setLoading(true);
    if (user) await handleUpdate(values);
    else await handleCreate(values);
  };

  const handleUpdate = async (values) => {
    const { email, username, gender, dateOfBirth, password } = values;

    setLoading(true);

    try {
      const response = await axiosPrivate.patch(USER_ROUTE, {
        email,
        username,
        dateOfBirth,
        gender,
        password,
      });

      const data = response.data;
      setUser((user) => {
        return { ...user, data };
      });

      toast({
        title: "Succès !",
        description: "Votre compte a été mis à jour.",
      });
    } catch (error) {
      console.log(error);
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

  const handleCreate = async (values) => {
    const { email, username, gender, dateOfBirth, password } = values;
    setLoading(true);

    try {
      await axiosPrivate.post(
        REGISTER_ROUTE,
        JSON.stringify({ email, username, gender, password, dateOfBirth })
      );

      toast({
        title: "Inscription avec succès !",
        description: "Rendez-vous à la page de connexion.",
      });
    } catch (error) {
      console.log(error);
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              <FormLabel className="sr-only">Nom d'utilisateur</FormLabel>
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
              <FormLabel className="sr-only">Date de naîssance</FormLabel>
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
          defaultValue={user?.gender}
        >
          <SelectTrigger>
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Homme</SelectItem>
            <SelectItem value="female">Femme</SelectItem>
          </SelectContent>
        </Select>
        {!user && (
          <>
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
          </>
        )}
        <div>
          <div className="lg:flex lg:flex-row-reverse lg:justify-between lg:align-middle mt-12">
            <Button
              type="submit"
              disabled={loading}
              className="w-full lg:w-[initial]"
            >
              {user ? "Confirmer" : "S'inscrire"}
            </Button>
            <Button
              variant="link"
              disabled={loading}
              className="w-full lg:w-[initial] text-center"
              asChild
            >
              {!user && <Link to="/home">&larr; Revenir à l'accueil</Link>}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
