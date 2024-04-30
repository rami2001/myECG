import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";

import useAuth from "@/hooks/useAuth";
import { profileSchema } from "@/lib/formSchemas";

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

const ProfileForm = ({ profile }) => {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || "",
      pseudonym: profile?.pseudonym || "",
      dateOfBirth: profile?.dateOfBirth || "",
      gender: profile?.gender || "",
    },
  });

  const axiosPrivate = useAxiosPrivate();
  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (values) => {
    setLoading(true);

    if (profile) await handleUpdate(values);
    else await handleCreate(values);

    setLoading(false);
  };

  const handleUpdate = async ({ username, pseudonym, dateOfBirth, gender }) => {
    const id = profile.id;

    try {
      const response = await axiosPrivate.put("/profile", {
        id,
        username,
        pseudonym,
        dateOfBirth,
        gender,
      });

      console.log("response : ", response.data);

      toast({
        title: "Bien.",
        description: "Profile mis à jour avec succès.",
      });

      const updatedProfile = response.data.updatedProfile;

      setUser((prevUser) => ({
        ...prevUser,
        profiles: prevUser.profiles.map((p) =>
          p.id === updatedProfile.id ? updatedProfile : p
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async ({ username, pseudonym, dateOfBirth, gender }) => {
    try {
      const id = user.id;
      const response = await axiosPrivate.post(
        "/profile",
        JSON.stringify({ id, username, pseudonym, dateOfBirth, gender })
      );

      toast({
        title: "Bien.",
        description: "Profile ajouté avec succès.",
      });

      setUser({ ...user, profiles: [...user.profiles, response.data.profile] });
    } catch (error) {
      toast({
        title: "Erreur.",
        variant: "destructive",
        description: error,
      });
    }
  };

  const defaultDateOfBirth = profile?.dateOfBirth
    ? format(new Date(profile.dateOfBirth), "yyyy-MM-dd")
    : "";

  console.log(defaultDateOfBirth);

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
                <Input
                  type="date"
                  placeholder="Date de naissance"
                  {...field}
                  value={defaultDateOfBirth}
                />
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />
        <Select
          className="lg:w-2/5"
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
