import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getYear } from "date-fns";

import useAuth from "@/hooks/useAuth";
import { createProfile } from "@/api/userController";
import { profileSchema } from "@/lib/formSchemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/custom_ui/DatePicker";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ButtonLoading from "@/components/custom_ui/ButtonLoading";

const ProfileForm = () => {
  const currentDate = Date.now();
  const maxYear = getYear(currentDate) - 150;
  const minYear = getYear(currentDate) - 12;

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      pseudonym: "",
      dateOfBirth: "",
      gender: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();
  const { toast } = useToast();

  const onSubmit = async (values) => {
    const { username, pseudonym, dateOfBirth, gender } = values;
    setLoading(true);

    try {
      const response = await createProfile(
        user.id,
        username,
        pseudonym,
        dateOfBirth,
        gender,
        user.accessToken
      );

      toast({
        title: "Bien.",
        description: "Profile ajouté avec succès.",
      });

      setUser({ ...user, profiles: [...user.profiles, response.data] });
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
        <FormField
          control={form.control}
          name="pseudonym"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Pseudonyme</FormLabel>
              <FormControl>
                <Input placeholder="Pseudonyme" {...field} />
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
        <div className="text-right">
          <div className="mt-10">
            {loading ? (
              <ButtonLoading className="w-full lg:w-[initial]">
                Chargement
              </ButtonLoading>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="w-full lg:w-[16ch]"
              >
                Créer
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
