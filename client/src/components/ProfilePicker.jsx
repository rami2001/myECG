import useAuth from "@/hooks/useAuth";

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
import { Badge } from "./ui/badge";

const ProfilePicker = () => {
  const { user, currentProfile, setCurrentProfile } = useAuth();

  const handleProfileChange = (value) =>
    setCurrentProfile(user.profiles.find((p) => p.id === value));

  return (
    <Select
      defaultValue={currentProfile.id}
      onValueChange={(value) => handleProfileChange(value)}
    >
      <SelectTrigger>
        <SelectValue
          defaultValue={currentProfile.id}
          placeholder="Sélectionnez un profile"
        />
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
                <div>
                  <p className="text-sm align-baseline">
                    {profile.pseudonym ? profile.pseudonym : profile.username}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    (@{profile.username})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export default ProfilePicker;
