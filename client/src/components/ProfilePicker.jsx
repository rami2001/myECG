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

const ProfilePicker = ({
  profiles,
  currentProfile,
  setCurrentProfile,
  disabled,
}) => {
  const handleProfileChange = (value) => {
    setCurrentProfile(profiles.find((p) => p.id === parseInt(value)));
  };

  return (
    <Select
      disabled={disabled}
      defaultValue={currentProfile?.id?.toString()}
      onValueChange={(value) => handleProfileChange(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sélectionnez un profile" />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea>
          <SelectGroup>
            <SelectLabel>Profiles</SelectLabel>
            <SelectSeparator />
            {profiles.map((profile) => (
              <SelectItem
                key={profile.id}
                value={profile.id.toString()}
                className="text-muted-foreground"
              >
                <>
                  <p className="text-sm align-baseline">
                    {profile.pseudonym ? profile.pseudonym : profile.username}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    (@{profile.username})
                  </span>
                </>
              </SelectItem>
            ))}
          </SelectGroup>
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export default ProfilePicker;
