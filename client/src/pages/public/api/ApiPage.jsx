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

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const MailTo = ({ className, mail, children }) => {
  return (
    <a href={`mailto:${mail}`} className={className}>
      {children}
    </a>
  );
};

const ApiPage = () => {
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
      const response = await axiosPrivate.post("/public/dataset", { email });
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
    <section className="text-center h-[80vh] grid place-content-center">
      <h1>Utilisez notre Dataset</h1>
      <h4 className="text-center mx-auto mt-2 min-w-[50%] max-w-2xl">
        Explorez une collection d'ECGs numériques au format JSON ainsi que leur
        scans partagés par nos utilisateurs.
      </h4>
      <p className="text-muted-foreground mx-auto text-sm italic font-thin min-w-[50%] max-w-xl mt-12 leading-5">
        Si vous voulez obtenir un accès au dataset, veuillez nous contacter à
        notre adresse e-mail{" "}
        <MailTo mail={"my.ecg2024@gmail.com"} className="text-primary underline">my.ecg2024@gmail.com</MailTo>
      </p>
      <div className="mt-6">
        <Form {...form}>
          <Separator className="mb-8" />
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="max-w-[32ch] mx-auto space-y-3"
          >
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
            <Button type="submit" disabled={loading} className="w-full">
              Obtenir un lien
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default ApiPage;
