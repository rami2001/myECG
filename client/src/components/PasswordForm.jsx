import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { passwordSchema } from "@/lib/formSchemas";

import { USER_ROUTE_PASSWORD } from "@/api/routes";

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
import { useToast } from "@/components/ui/use-toast";
import Loading from "./Loading";

const PasswordForm = () => {
  const axiosPrivate = useAxiosPrivate();

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const handleSubmit = async (values) => {
    const { password } = values;
    setLoading(true);

    try {
      await axiosPrivate.patch(USER_ROUTE_PASSWORD, { password });

      toast({
        title: "Succès !",
        description: "Votre mot de passe a été mis à jour.",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        <DialogFooter className="mt-4 flex justify-end">
          <Button type="submit" disabled={loading}>
            Soumettre
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default PasswordForm;
