import { useState } from "react";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "./ui/use-toast";

export function ProfilePictureUploader({ children, setUser }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const axiosPrivate = useAxiosPrivate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await axiosPrivate.post("/user/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const response = await axiosPrivate.get("/user/image", {
        responseType: "blob",
      });

      const image = new Blob([response.data], {
        type: response.data.type,
      });

      const url = URL.createObjectURL(image);

      setUser((user) => ({
        ...user,
        imageURL: url,
      }));

      setError("");

      toast({
        title: "Photo de profile.",
        description: "Photo de profile mise à jour avec succès.",
      });
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Une erreur est survenue lors du chargement de l'image.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Photo de profile</DialogTitle>
          <DialogDescription>
            Selectionnez une photo de profile depuis votre ordinateur et
            personnalisez votre compte.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input type="file" onChange={handleFileChange} />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <DialogFooter className="mt-8">
            <Button
              type="submit"
              className="ml-auto"
              variant="outline"
              disabled={loading}
            >
              Envoyer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProfilePictureUploader;
