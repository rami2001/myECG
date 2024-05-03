import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";

import { profileSchema } from "@/lib/formSchemas";

import { PROFILE_ROUTE } from "@/api/routes";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const ProfileForm = ({ profile = null, setProfiles }) => {
  const defaultDateOfBirth = profile?.dateOfBirth
    ? format(new Date(profile.dateOfBirth), "yyyy-MM-dd")
    : "";

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || "",
      pseudonym: profile?.pseudonym || "",
      dateOfBirth: defaultDateOfBirth,
      gender: profile?.gender || "",
    },
  });

  const axiosPrivate = useAxiosPrivate();

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (values) => {
    setLoading(true);

    if (profile) await handleUpdate(values);
    else await handleCreate(values);
  };

  const handleUpdate = async ({ username, pseudonym, dateOfBirth, gender }) => {
    const id = profile.id;

    try {
      const response = await axiosPrivate.put(PROFILE_ROUTE, {
        id,
        username,
        pseudonym,
        dateOfBirth,
        gender,
      });

      let updatedProfile = response.data;

      setProfiles((previous) => {
        const newProfiles = [...previous];

        const profileIndex = newProfiles.findIndex(
          (p) => p.id === updatedProfile.id
        );

        newProfiles[profileIndex] = updatedProfile;

        return newProfiles;
      });

      toast({
        title: "Fait !",
        description: `${profile.username} mis à jour avec succès.`,
      });
    } catch (error) {
      if (!error?.response) {
        toast({
          title: "Erreur.",
          variant: "destructive",
          description: "Vous ne semblez pas connecté à internet !",
        });
      } else {
        toast({
          title: "Erreur.",
          variant: "destructive",
          description: error,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async ({ username, pseudonym, dateOfBirth, gender }) => {
    try {
      const createdProfile = await axiosPrivate.post(
        PROFILE_ROUTE,
        JSON.stringify({ username, pseudonym, dateOfBirth, gender })
      );

      setProfiles((previous) => [...previous, createdProfile.data]);

      toast({
        title: "Bien.",
        description: "Profile ajouté avec succès.",
      });
    } catch (error) {
      if (!error?.response) {
        toast({
          title: "Erreur.",
          variant: "destructive",
          description: "Vous ne semblez pas connecté à internet !",
        });
      } else {
        toast({
          title: "Erreur.",
          variant: "destructive",
          description: error,
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
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Date de naissance</FormLabel>
              <FormControl>
                <Input type="date" placeholder="Date de naissance" {...field} />
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Genre</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => form.setValue("gender", value)}
                  defaultValue={profile?.gender}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />

        <div className="text-right">
          <div className="mt-10">
            <Button
              type="submit"
              className="w-full lg:w-[24ch]"
              disabled={loading}
            >
              {loading ? "Chargement" : profile ? "Modifier" : "Créer"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
