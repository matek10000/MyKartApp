"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type LapTimeEntry = {
  trackName: string;
  lapTime: number;
  date: Date;
};

const initialTracks = [
  "WRT Kapelanka",
  "WRT Nowa Huta",
  "ICF Rzeszów",
  "Reskart Rzeszów",
  "E1 Chorzów",
  "Go Karting Center",
];

export default function Home() {
  const [lapTimes, setLapTimes] = useState<LapTimeEntry[]>([]);
  const [trackLapTimes, setTrackLapTimes] = useState<{
    [trackName: string]: LapTimeEntry[];
  }>({});
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("");
  const [newLapTime, setNewLapTime] = useState<number | undefined>(undefined);
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [tracks, setTracks] = useState<string[]>(initialTracks);
  const [isAddingTrack, setIsAddingTrack] = useState(false);
  const [newTrackName, setNewTrackName] = useState("");

  const handleOpenChange = () => {
    setOpen(!open);
  };

  const handleTrackNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTrackName(e.target.value);
  };

  const handleAddTrack = () => {
    if (newTrackName && !tracks.includes(newTrackName)) {
      setTracks([...tracks, newTrackName]);
      setNewTrackName("");
      setIsAddingTrack(false);
      toast({
        title: "Sukces",
        description: "Tor dodany do listy.",
      });
    } else if (newTrackName && tracks.includes(newTrackName)) {
      toast({
        title: "Błąd",
        description: "Tor już jest na liście.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Błąd",
        description: "Wprowadź nazwę toru.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateLapTime = (trackName: string) => {
    if (!newLapTime || !newDate) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie pola.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: LapTimeEntry = {
      trackName: trackName,
      lapTime: newLapTime,
      date: newDate,
    };

    setTrackLapTimes(prev => {
      const updatedLapTimes = { ...prev };
      if (!updatedLapTimes[trackName]) {
        updatedLapTimes[trackName] = [];
      }
      updatedLapTimes[trackName] = [newEntry, ...updatedLapTimes[trackName]];
      return updatedLapTimes;
    });

    setOpen(false);
    setNewLapTime(undefined);
    setNewDate(undefined);
    toast({
      title: "Sukces",
      description: "Czas okrążenia zaktualizowany.",
    });
  };

  const calculateDifference = (
    currentLapTime: number,
    previousLapTime: number
  ): string => {
    const difference = currentLapTime - previousLapTime;
    const formattedDifference = difference.toFixed(3);
    return `(${difference > 0 ? "+" : ""}${formattedDifference}s)`;
  };

  const TrackTile = ({ trackName }: { trackName: string }) => {
    const latestLap = trackLapTimes[trackName]?.[0];
    const previousLap = trackLapTimes[trackName]?.[1];
    const timeDifference =
      latestLap && previousLap
        ? calculateDifference(latestLap.lapTime, previousLap.lapTime)
        : null;

    return (
      <Card
        className="w-64 h-48 bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center justify-center flex-col"
        onClick={() => {
          setOpen(true);
          setSelectedTrack(trackName);
        }}
      >
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-xl font-bold text-center">{trackName}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {latestLap ? (
            <>
              <p className="text-sm text-center">
                Najlepszy czas: {latestLap.lapTime.toFixed(3)}s
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Data: {format(latestLap.date, "PPP")}
              </p>
              {timeDifference && (
                <p className="text-xs text-muted-foreground text-center">
                  Różnica: {timeDifference}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-center">Brak okrążeń.</p>
          )}
        </CardContent>
      </Card>
    );
  };

  const AddTrackTile = () => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        e.stopPropagation();
        setIsAddingTrack(true);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      handleTrackNameChange(e);
    }

    const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      handleAddTrack();
    }

    return (
      <Card className="w-64 h-48 bg-secondary text-secondary-foreground shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center justify-center"
           onClick={handleClick}>
        {isAddingTrack ? (
          <div className="flex flex-col items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <Input
              type="text"
              placeholder="Nazwa toru"
              value={newTrackName}
              onChange={handleInputChange}
              className="mb-2 text-black"
              onClick={(e) => e.stopPropagation()}
            />
            <Button onClick={handleAdd} className="w-full" onClick={(e) => e.stopPropagation()}>Dodaj Tor</Button>
          </div>
        ) : (
          <Button variant="ghost" size="lg" onClick={handleClick}>
            <Plus />
            <span>Dodaj Tor</span>
          </Button>
        )}
      </Card>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <h1 className="text-3xl font-bold mb-4 text-foreground">MyKart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
        {tracks.map((track) => (
          <TrackTile key={track} trackName={track} />
        ))}
        <AddTrackTile />
      </div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aktualizuj czas okrążenia dla {selectedTrack}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="lapTime">Nowy czas okrążenia (sekundy)</Label>
              <Input
                id="lapTime"
                type="number"
                placeholder="Wprowadź nowy czas okrążenia"
                value={newLapTime !== undefined ? newLapTime.toString() : ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setNewLapTime(isNaN(value) ? undefined : value);
                }}
                className="text-black"
              />
            </div>
            <div className="grid gap-2">
              <Label>Data</Label>
              <Calendar
                mode="single"
                selected={newDate}
                onSelect={setNewDate}
                className={cn("rounded-md border")}
              />
            </div>
          </div>
          <Button onClick={() => handleUpdateLapTime(selectedTrack)}>
            Aktualizuj czas okrążenia
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
