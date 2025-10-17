import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useProfiles from "@/hooks/useProfiles";

import ProfilePicker from "@/components/ProfilePicker";
import Loading from "@/components/Loading";
import { validateDateOfECG } from "@/lib/utils";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Separator } from "./ui/separator";
import { LoaderCircle } from "lucide-react";

const EcgForm = ({ profile, setEcgs = null, canDisable = true }) => {
  const { profiles, setCurrentProfile, loading } = useProfiles();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [selectedProfile, setSelectedProfile] = useState(profile);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImageURL, setSelectedImageURL] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

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
        validateDateOfECG(new Date(date), selectedProfile.dateOfBirth)
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
    data.append("profileId", selectedProfile.id);
    data.append("dateOfBirth", selectedProfile.dateOfBirth);
    data.append("gender", selectedProfile.gender);
    data.append("date", form.date);
    data.append("note", form.note);
    data.append("image", selectedImage);

    try {
      setIsLoading(true);

      toast({
        title: "Veuillez patienter",
        description:
          "Le processus de numérisation ne devrait pas prendre plus d'une minute.",
      });

      const response = await axiosPrivate.post("/ecg", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 90000,
      });

      if (setEcgs) {
        const ecg = {
          id: response.data.ecgId,
          profileId: profile.id,
          date: form.date,
          note: form.note,
        };
        setEcgs((previous) => [...previous, ecg]);
      }

      toast({
        title: "Fait.",
        description: `ECG de ${
          selectedProfile?.pseudonym
            ? selectedProfile.pseudonym
            : selectedProfile.username
        } soumis avec Succès`,
      });
    } catch (error) {
      setError(true);

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

  const handleImageChange = async (e) => {
    setSelectedImageURL(null);

    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);

        const imageFormData = new FormData();
        imageFormData.append("image", file);

        await axiosPrivate.post("/scan", imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        try {
          const response = await axiosPrivate.get("/scan", {
            responseType: "blob",
          });

          const image = new Blob([response.data], {
            type: response.data.type,
          });

          setSelectedImage(image);

          const url = URL.createObjectURL(image);

          setSelectedImageURL(url);

          setDialogOpen(true);
          setOriginalImage(file);
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
              description: "Impossible de scanner l'ECG",
            });
          }
        }
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
    }
  };

  const handleReport = async () => {
    if (!originalImage) return;

    const reportFormData = new FormData();
    reportFormData.append("image", originalImage);

    try {
      setIsLoading(true);

      await axiosPrivate.post("/scan/report", reportFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Fait",
        description:
          "Le mauvais scan a été signalé avec succès ! Merci pour votre feedback.",
      });

      setSelectedImageURL(null);
      setOriginalImage(null);
      setDialogOpen(false);
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

  const handleDownload = () => {
    if (selectedImageURL) {
      const link = document.createElement("a");
      const fileName = `scan_${format(new Date(), "dd_MM_yyyy")}.png`;

      link.href = selectedImageURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFailReport = async () => {
    if (!selectedImage) return;

    const reportFormData = new FormData();
    reportFormData.append("image", selectedImage);

    try {
      setIsLoading(true);

      await axiosPrivate.post("/ecg/report", reportFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Fait",
        description:
          "Cette entrée a été signalée avec succès ! Merci pour votre feedback.",
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
      setError(false);
      setOriginalImage(null);
      setSelectedImage(null);
      setSelectedImageURL(null);
    }
  };

  if (loading) return <Loading message="Chargement du formulaire" />;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <p className="text-muted-foreground text-xs -mt-2 -mb-2">
            Sélectionnez le profil auquel vous voulez attribuer l'ECG.
          </p>
          <ProfilePicker
            profiles={profiles}
            currentProfile={selectedProfile}
            setCurrentProfile={setSelectedProfile}
            disabled={canDisable || isLoading}
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
                      qui vous l'avez fait, la raison de l'ECG ou les maladies
                      que vous aviez durant cet ECG.
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
            render={({ field }) => (
              <FormItem>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="file"
                        placeholder="Photo de l'ECG"
                        {...form.register("image", {
                          onChange: handleImageChange,
                        })}
                      />
                    </FormControl>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Prévisualisation du scan de l'ECG
                      </DialogTitle>
                      <DialogDescription>
                        Veuillez signaler les ECGs mal scannés.
                      </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <div className="flex justify-center">
                      {isLoading ? (
                        <LoaderCircle className="stroke-primary mt-4 size-24 animate-spin" />
                      ) : (
                        <img src={selectedImageURL} className="max-w-full" />
                      )}
                    </div>
                    <DialogFooter className="mt-12 flex space-x-2">
                      <Button
                        className="ml-auto w-full lg:w-[initial]"
                        disabled={isLoading || !selectedImage}
                        variant="outline"
                        onClick={handleReport}
                      >
                        Signaler
                      </Button>
                      <Button
                        className="ml-auto w-full lg:w-[initial]"
                        disabled={isLoading || !selectedImageURL}
                        onClick={handleDownload}
                      >
                        Télécharger
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <FormMessage className="font-normal text-xs" />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-12">
            <Button
              type="submit"
              className="ml-auto w-full lg:w-[initial]"
              disabled={isLoading}
            >
              Numériser
            </Button>
          </DialogFooter>
        </form>
      </Form>
      {error && (
        <>
          <Separator className="mt-2" />
          <p className="text-xs text-muted italic mt-2">
            Si vous estimez que le scan de l'ECG est dans de bonnes conditions
            et que la numérisation a échoué. Veuillez le{" "}
            <a
              className="text-primary underline cursor-pointer"
              onClick={handleFailReport}
            >
              signaler
            </a>
            .
          </p>
        </>
      )}
    </>
  );
};

export default EcgForm;
