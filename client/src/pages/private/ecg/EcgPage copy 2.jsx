import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useProfiles from "@/hooks/useProfiles";
import ProfilePicker from "@/components/ProfilePicker";
import { Link } from "react-router-dom";
import { CircleAlert, Plus } from "lucide-react";

const EcgCard = ({ ecg, profile, setCurrentProfile, withProfile = false }) => {
  const getMonthInFrench = (date) => {
    if (date) return format(new Date(date), "MMMM", { locale: fr });
  };
  const getDayPadded = (date) => {
    if (date) return format(new Date(date), "dd");
  };
  const getYear = (date) => {
    if (date) return format(new Date(date), "yyyy");
  };

  const handleClick = () => setCurrentProfile(profile);

  return (
    <Link to={`/dashboard/ecg/${ecg.id}`}>
      <article>
        <Card className="hover:bg-card cursor-pointer transition delay-150 bg-background min-h-48 text-center px-2 py-5">
          <CardHeader>
            <CardDescription className="italic">
              <span className="text-xs text-primary font-thin">#{ecg.id}</span>
              <br />
              <p
                className={cn(
                  "inline-block mt-2 mb-4",
                  ecg.isBad ? "text-primary" : ""
                )}
              >
                ECG {ecg.isBad && "(erroné)"} du :
              </p>
            </CardDescription>
            <CardTitle
              className={cn("text-8xl", ecg.isBad ? "text-primary" : "")}
            >
              {getDayPadded(ecg.date)}
            </CardTitle>
            <div>
              <p className="font-thin text-primary text-xl mt-2 mb-4">
                {getMonthInFrench(ecg.date)}
              </p>
              <p
                className={cn(
                  "text-5xl font-bold",
                  ecg.isBad ? "text-primary" : ""
                )}
              >
                {getYear(ecg.date)}
              </p>
            </div>
          </CardHeader>
          <div className="px-6">
            <Separator className="mb-6" />
          </div>
          <CardContent className="text-center">
            <h3>{profile.pseudonym ? profile.pseudonym : profile.username}</h3>
            <p className="text-sm italic text-muted-foreground">
              @{profile.username}
            </p>

            <Separator className="my-6" />
            {ecg.note ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" className="my-0 py-0">
                    Note
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-96">
                  <p className="text-sm font-thin italic text-left">
                    {ecg.note}
                  </p>
                </HoverCardContent>
              </HoverCard>
            ) : (
              <Button variant="ghost" className="text-muted font-thin italic">
                Pas de note.
              </Button>
            )}
          </CardContent>
        </Card>
      </article>
    </Link>
  );
};

const CreateEcgCard = () => {
  return (
    <Card className="hover:bg-card cursor-pointer transition delay-150 bg-background min-h-48 text-center group">
      <CardHeader>
        <Plus
          className="group-hover:text-card-foreground transition delay-150 mt-36 text-muted mx-auto size-12"
          strokeWidth={1}
        />
      </CardHeader>
      <div className="px-6">
        <Separator className="mb-6" />
      </div>
      <CardContent>
        <Button
          variant="ghost"
          className="group-hover:text-card-foreground transition delay-150 text-muted font-thin italic"
        >
          Soumettre un ECG
        </Button>
      </CardContent>
    </Card>
  );
};

const EcgPage = () => {
  const { profiles, currentProfile, setCurrentProfile } = useProfiles();
  const axiosPrivate = useAxiosPrivate();
  const [ecgs, setEcgs] = useState();
  const [filteredEcgs, setFilteredEcgs] = useState([]);

  const groupBy = (arr, key) => {
    return arr.reduce((grouped, item) => {
      const groupKey = item[key];
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(item);
      return grouped;
    }, {});
  };

  useEffect(() => {
    if (ecgs) {
      if (currentProfile !== 0) {
        const filtered = ecgs.filter(
          (ecg) => ecg.profileId === currentProfile.id
        );
        setFilteredEcgs(filtered);
      } else {
        const groupedEcgs = groupBy(ecgs, "profileId");
        setFilteredEcgs(groupedEcgs);
      }
    }
  }, [currentProfile, ecgs]);

  useEffect(() => {
    const fetchECGs = async () => {
      try {
        const response = await axiosPrivate("/ecg");
        const data = response.data;

        if (data) {
          setEcgs(data);
        }

        setCurrentProfile(0);
      } catch (error) {
        console.log(error);
      }
    };

    fetchECGs();
  }, []);

  return (
    <section className="p-8 sm:p-12 md:p-16">
      <h1>Mes ECGs</h1>
      <Separator className="my-8 px-2" />
      <h5 className="mb-3">Afficher les ECGs de : </h5>
      <ProfilePicker
        profiles={profiles}
        includeAllProfiles={true}
        defaultValue={"0"}
        currentProfile={currentProfile}
        setCurrentProfile={setCurrentProfile}
      />
      <Separator className="my-8 px-2" />
      {currentProfile === 0
        ? filteredEcgs &&
          profiles.map((profile) => (
            <>
              <Accordion
                key={profile.profileId}
                type="single"
                collapsible
                className="max-w-screen-xl"
              >
                <AccordionItem value={profile.id}>
                  <AccordionTrigger>
                    <h3 className="col-span-full space-y-8">
                      ECGs de{" "}
                      {profile.pseudonym ? profile.pseudonym : profile.username}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-between">
                    {filteredEcgs[profile.id]?.map((ecg) => (
                      <EcgCard
                        ecg={ecg}
                        profile={profile}
                        setCurrentProfile={setCurrentProfile}
                        withProfile={true}
                      />
                    ))}
                    <CreateEcgCard />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          ))
        : Array.isArray(filteredEcgs) && (
            <>
              <h2>
                ECGs de{" "}
                {currentProfile.pseudnoym
                  ? currentProfile.pseudonym
                  : currentProfile.username}{" "}
                :{" "}
              </h2>
              <Separator className="my-8" />
              <section className="max-w-screen-xl min-h-96 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-between">
                {filteredEcgs.map((ecg) => (
                  <EcgCard
                    key={ecg.id}
                    ecg={ecg}
                    profile={profiles.find(
                      (profile) => profile.id === ecg.profileId
                    )}
                    setCurrentProfile={setCurrentProfile}
                  />
                ))}
                <CreateEcgCard />
              </section>
            </>
          )}
    </section>
  );
};

export default EcgPage;
