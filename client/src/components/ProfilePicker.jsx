import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const ProfilePicker = ({ className }) => {
  const { user, currentProfile, setCurrentProfile } = useAuth();

  const handleProfileChange = (value) =>
    setCurrentProfile(user.profiles.find((p) => p.id === value));

  return (
    <Select
      defaultValue={currentProfile.id}
      onValueChange={(value) => handleProfileChange(value)}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Sélectionnez un profile" />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea>
          <SelectGroup>
            <SelectLabel>Profiles</SelectLabel>
            <SelectSeparator />
            {user.profiles.map((profile) => (
              <SelectItem
                key={profile.id}
                value={profile.id}
                className="text-muted-foreground"
              >
                <h4 className="text-lg align-baseline">
                  {profile.pseudonym || profile.username}
                  <span className="text-xs text-muted-foreground ml-2 italic">
                    (@{profile.username})
                  </span>
                </h4>
              </SelectItem>
            ))}
          </SelectGroup>
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export default ProfilePicker;
