import { useState } from "react";
import { useForm } from "react-hook-form";

import useAuth from "@/hooks/useAuth";
import { createProfile, updateProfile } from "@/api/profileController";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const ProfileForm = ({ profile = null, userId = null }) => {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || "",
      pseudonym: profile?.pseudonym || "",
      dateOfBirth: "",
      gender: profile?.gender || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const { toast } = useToast();

  const axiosPrivate = useAxiosPrivate();

  const onSubmit = async (values) => {
    const { username, pseudonym, dateOfBirth, gender } = values;
    setLoading(true);

    if (!!profile) {
      const profileId = profile.id;

      const response = await axiosPrivate.put("/profile", {
        id: userId,
        profileId: profileId,
        username: username,
        pseudonym: pseudonym,
        gender: gender,
        dateOfBirth: dateOfBirth,
      });

      toast({
        title: "Bien.",
        description: "Profile mis à jour avec succès.",
      });

      const newProfiles = user.profiles;
      newProfiles.filter((p) => p.id !== profileId);
      newProfiles.push(response.data);

      setUser({
        ...user,
        profiles: [...newProfiles],
      });
    } else {
      const response = await axiosPrivate.post(
        "/profile",
        JSON.stringify({ userId, username, pseudonym, dateOfBirth, gender })
      );

      toast({
        title: "Bien.",
        description: "Profile ajouté avec succès.",
      });

      setUser({ ...user, profiles: [...user.profiles, response.data] });
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
        <Select
          className="lg:w-2/5"
          defaultValue={profile?.gender}
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

        <div className="text-right">
          <div className="mt-10">
            <Button
              type="submit"
              className="w-full lg:w-[24ch]"
              disabled={loading}
            >
              {loading && "Chargement"}
              {profile ? "Modifier" : "Créer"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
