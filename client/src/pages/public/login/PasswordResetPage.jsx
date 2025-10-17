import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { emailSchema } from "@/lib/formSchemas";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const PasswordResetPage = () => {
  const axiosPrivate = useAxiosPrivate();

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values) => {
    const { email } = values;
    setLoading(true);

    try {
      const response = await axiosPrivate.post("/public/reset", { email });
      toast({
        title: "Succès !",
        description: response.data.message,
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
    <section className="px-10 grid place-content-center">
      <Card className="my-12 bg-background sm:max-w-screen-md text-center py-12 px-8 sm:px-12">
        <CardTitle>Réinitialisation du mot de passe</CardTitle>
        <CardDescription>
          Entrez l'adresse e-mail avec laquelle vous vous êtes inscrit.
        </CardDescription>
        <Separator className="my-6" />
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Adresse e-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Adresse e-mail"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-normal text-xs" />
                  </FormItem>
                )}
              />
              <br />
              <Button
                type="submit"
                disabled={loading}
                className="w-full lg:w-[initial]"
              >
                Confirmer
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default PasswordResetPage;
