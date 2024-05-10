import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useProfiles from "@/hooks/useProfiles";

import ProfilePicker from "@/components/ProfilePicker";
import Loading from "@/components/Loading";

import { validateDateOfECG } from "@/lib/utils";

import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const EcgForm = () => {
  const { profiles, currentProfile, setCurrentProfile, loading } =
    useProfiles();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const ecgSchema = z.object({
    date: z.coerce
      .date({
        errorMap: (issue, { defaultError }) => ({
          message:
            issue.code === "invalid_date"
              ? "Vous devez avoir entre 1 mois et 150 ans."
              : defaultError,
        }),
      })
      .refine((date) =>
        validateDateOfECG(new Date(date), currentProfile.dateOfBirth)
      ),
    note: z.string(),
    image: z.instanceof(FileList).refine((file) => file.length === 1, {
      message: "Veuillez fournir une seule image de type JPEG ou PNG.",
      path: ["image"],
    }),
  });

  const form = useForm({
    resolver: zodResolver(ecgSchema),
    defaultValues: {
      note: "",
      date: "",
      image: null,
    },
  });

  const axiosPrivate = useAxiosPrivate();

  const onSubmit = async (form) => {
    const data = new FormData();

    data.append("profileId", currentProfile.id);
    data.append("date", form.date);
    data.append("note", form.note);
    data.append("image", form.image[0]);

    try {
      setIsLoading(true);
      await axiosPrivate.post("/ecg", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Fait.",
        description: `ECG de ${currentProfile?.username} soumis avec Succès`,
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
      setIsLoading(false);
    }
  };

  const imageRef = form.register("image");

  if (loading) return <Loading message="Chargement du formulaire" />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <p className="text-muted-foreground text-xs -mt-6 -mb-4">
          Sélectionnez le profil auquel vous voulez attribuer l'ECG.
        </p>
        <ProfilePicker
          profiles={profiles}
          currentProfile={currentProfile}
          setCurrentProfile={setCurrentProfile}
          disabled={isLoading}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Date de l'ECG</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  type="date"
                  placeholder="Date de l'ECG"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Note diverses</FormLabel>
              <FormControl>
                <>
                  <Textarea
                    disabled={isLoading}
                    placeholder="Notes diverses..."
                    {...field}
                  />
                  <p className="text-xs text-muted-foreground">
                    Facultatif, vous pouvez par exemple citer le medecin chez
                    qui vous l'avez fait, la raison de l'ECG ou les maladies que
                    vous aviez durant cet ECG.
                  </p>
                </>
              </FormControl>
              <FormMessage className="font-normal text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="sr-only">Photo de l'ECG</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="file"
                    placeholder="Photo de l'ECG"
                    {...imageRef}
                  />
                </FormControl>
                <FormMessage className="font-normal text-xs" />
              </FormItem>
            );
          }}
        />
        <DialogFooter className="mt-12">
          <Button
            type="submit"
            className="ml-auto w-full lg:w-[initial]"
            disabled={isLoading}
          >
            Créer
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EcgForm;
