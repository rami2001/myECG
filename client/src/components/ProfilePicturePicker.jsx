import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ProfilePicturePicker = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Photo de profile</DialogTitle>
          <DialogDescription>
            Personnalisez votre compte avec une photo de profile.
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="link" className="sr-only">
          Link
        </Label>
        <Input
          id="link"
          defaultValue="https://ui.shadcn.com/docs/installation"
          readOnly
        />
        <Button type="submit" size="sm" className="px-3"></Button>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Annuler
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePicturePicker;
