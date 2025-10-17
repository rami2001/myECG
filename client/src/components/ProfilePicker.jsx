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
  includeAllProfiles = false,
  defaultValue = currentProfile?.id?.toString(),
  className,
}) => {
  const handleProfileChange = (value) => {
    if (value === "0") setCurrentProfile(0);
    else setCurrentProfile(profiles.find((p) => p.id === parseInt(value)));
  };

  return (
    <Select
      disabled={disabled}
      defaultValue={defaultValue}
      onValueChange={(value) => handleProfileChange(value)}
      className={className}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sélectionnez un profile" />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea>
          <SelectGroup>
            <SelectLabel>Profiles</SelectLabel>
            <SelectSeparator />
            {includeAllProfiles && (
              <SelectItem value="0">
                <>
                  <p className="text-sm align-baseline">Tous les profils</p>
                </>
              </SelectItem>
            )}
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
