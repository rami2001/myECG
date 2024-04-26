import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getYear } from "date-fns";

import { register } from "@/api/userController";

import DatePicker from "@/components/custom_ui/DatePicker";
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
import { registerSchema } from "@/lib/formSchemas";
import ButtonLoading from "@/components/custom_ui/ButtonLoading";

const UserForm = ({ user = null }) => {
  const currentDate = Date.now();
  const maxYear = getYear(currentDate) - 150;
  const minYear = getYear(currentDate) - 12;

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      pseudonym: "",
      gender: null,
      dateOfBirth: null,
      password: "",
      confirm: "",
    },
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Adresse e-mail</FormLabel>
              <FormControl>
                <Input placeholder="Adresse mail" {...field} />
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
                <Input placeholder="Nom d'utilisateur" {...field} />
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />
        <div className="lg:flex lg:justify-between lg:gap-12 space-y-4 lg:space-y-0">
          <Select
            className="lg:w-2/5"
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
          <DatePicker
            placeholder="Date de naîssance"
            defaultValue={null}
            fromYear={maxYear}
            toYear={minYear}
            onChange={(date) => {
              if (date) {
                form.setValue("dateOfBirth", date);
              }
            }}
          />
        </div>
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
                S'inscrire
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

export default UserForm;
