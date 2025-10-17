import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Separator } from "@/components/ui/separator";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardDescription } from "@/components/ui/card";
import { CircleAlert, CircleHelp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const ECG_NAMES = [
  ["d1", "I"],
  ["d2", "II"],
  ["d3", "III"],
  ["avr", "aVR"],
  ["avl", "aVL"],
  ["avf", "aVF"],
  ["v1", "V1"],
  ["v2", "V2"],
  ["v3", "V3"],
  ["v4", "V4"],
  ["v5", "V5"],
  ["v6", "V6"],
];

const integerTickFormatter = (tick) => tick.toFixed(0);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { x, y } = payload[0].payload;
    return (
      <div className="bg-background shadow-md rounded p-2 space-y-2">
        <p>{`Temps (s): ${x}`}</p>
        <p>{`Voltage (mV): ${y}`}</p>
      </div>
    );
  }
  return null;
};

const ECGChart = ({ data, title }) => {
  const chartConfig = data?.length
    ? {
        desktop: {
          label: "Desktop",
          color: "hsl(var(--chart-1))",
        },
      }
    : {};

  return (
    <ChartContainer
      config={chartConfig}
      className="min-w-full max-h-72 text-center mb-16"
    >
      <h4 className="ml-20 mb-4">{title}</h4>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: 30,
          bottom: 50,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          tickFormatter={integerTickFormatter}
          tickCount={10}
          interval={100}
          label={{ value: "Temps (s)", position: "bottom", offset: 0 }}
        />
        <YAxis
          dataKey="y"
          minTickGap={10}
          label={{
            value: "Voltage (mV)",
            angle: -90,
            position: "left",
            offset: 0,
          }}
          domain={[-4, 4]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="linear"
          dataKey="y"
          stroke="hsl(var(--chart-5))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

const EcgDetailPage = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  const location = useLocation();

  const currentProfile = location.state?.profile;

  const [ecg, setEcg] = useState({});
  const [ecgData, setEcgData] = useState({});
  const [date, setDate] = useState(null);

  useEffect(() => {
    const fetchEcg = async () => {
      try {
        const response = await axiosPrivate.get(`/ecg/${id}`);

        const data = response.data;

        if (data) {
          setEcg(data.ecg);
          setDate(new Date(data.ecg.date));
          setEcgData(data.ecgData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEcg();
  }, [id]);

  const handleReport = async () => {
    try {
      await axiosPrivate.post("/ecg/bad", {
        ecgId: ecg.id,
      });

      setEcg((prevEcg) => ({
        ...prevEcg,
        isBad: !prevEcg.isBad,
      }));

      toast({
        title: "Fait !",
        description: "Signalement enregistré.",
      });
    } catch (error) {
      toast({
        title: "Fait.",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    try {
      const response = await axiosPrivate.get(`/ecg/import/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ecg_${id}.zip`);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Importation réussie !",
        description: "Les données ECG ont été importées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur.",
        description: "L'importation a échoué.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="p-8 sm:p-12 md:p-16">
      <h1>
        ECG de{" "}
        {currentProfile?.pseudonym
          ? currentProfile?.pseudonym
          : currentProfile?.username}{" "}
        <p className="text-xl text-muted-foreground font-thin">
          @{currentProfile?.username} &mdash;{" "}
          <span className="text-primary">
            {date ? format(date, "dd-MM-yyyy") : "00/00/0000"}
          </span>
        </p>
      </h1>
      <Separator className="my-4 px-2" />
      <Card className="h-min muted px-2 sm:px-4 md:px-6 py-3 bg-background">
        <CardDescription className="flex items-center">
          {ecg && ecg.isBad ? (
            <>
              <CircleAlert className="size-4 mr-3 stroke-primary" />
              <p className="px-4 text-primary text-xs">
                Vous avez signalé cet ECG comme étant erroné,{" "}
                <span
                  className="inline-block text-card-foreground hover:underline hover:cursor-pointer"
                  onClick={handleReport}
                >
                  Annuler ?
                </span>
              </p>
            </>
          ) : (
            <>
              <CircleHelp className="size-4 mr-3" />
              <p className="px-4 text-xs">
                La numérisation présente-t-elle des défauts ?{" "}
                <span
                  className="text-primary inline-block hover:underline hover:cursor-pointer"
                  onClick={handleReport}
                >
                  Signalez cet ECG.
                </span>
              </p>
            </>
          )}
          <Button
            variant={ecg.isBad ? "destructive" : "ghost"}
            className="ml-auto text-xs max-h-7"
            onClick={handleImport}
          >
            Importer
          </Button>
        </CardDescription>
      </Card>
      <Card className="h-min text-sm muted px-2 sm:px-4 md:px-6 py-4 bg-background my-3">
        <p
          className={
            ecg?.note
              ? ""
              : "text-muted-foreground italic font-thin text-center"
          }
        >
          {ecg?.note ? ecg.note : "Pas de note écrite fournie pour cet ECG"}
        </p>
      </Card>
      <div className="mt-8 grid md:grid-rows-6 md:grid-flow-col-dense gap-3 max-w-screen-xl">
        {ecg &&
          ecgData &&
          ECG_NAMES.map((key) => {
            const data = ecgData[key[0]]?.map(([x, y]) => ({ x, y }));
            return (
              <ECGChart
                key={key[0]}
                data={data}
                title={`Dérivation ${key[1]}`}
              />
            );
          })}
      </div>
    </section>
  );
};

export default EcgDetailPage;
