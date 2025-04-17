"use client";

import { useState, useEffect } from "react";
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

const translations = {
  pl: {
    title: "Czasy Okrążeń MyKart",
    trackNameLabel: "Nazwa Toru",
    lapTimeLabel: "Czas Okrążenia (sekundy)",
    dateLabel: "Data",
    updateLapTimeButton: "Aktualizuj czas okrążenia",
    noLaps: "Brak okrążeń.",
    bestTime: "Najlepszy czas:",
    date: "Data:",
    difference: "Różnica:",
    addTrack: "Dodaj Tor",
    enterTrackName: "Nazwa toru",
    addTrackButton: "Dodaj Tor",
    success: "Sukces",
    trackAdded: "Tor dodany do listy.",
    error: "Błąd",
    trackExists: "Tor już jest na liście.",
    enterTrackNameError: "Wprowadź nazwę toru.",
    fillAllFields: "Wypełnij wszystkie pola.",
    lapTimeUpdated: "Czas okrążenia zaktualizowany.",
    updateLapTimeFor: (trackName: string) => `Aktualizuj czas okrążenia dla ${trackName}`,
  },
  en: {
    title: "MyKart Lap Times",
    trackNameLabel: "Track Name",
    lapTimeLabel: "Lap Time (seconds)",
    dateLabel: "Date",
    updateLapTimeButton: "Update Lap Time",
    noLaps: "No laps recorded.",
    bestTime: "Best Time:",
    date: "Date:",
    difference: "Difference:",
    addTrack: "Add Track",
    enterTrackName: "Track name",
    addTrackButton: "Add Track",
    success: "Success",
    trackAdded: "Track added to the list.",
    error: "Error",
    trackExists: "Track already exists.",
    enterTrackNameError: "Enter track name.",
    fillAllFields: "Fill all fields.",
    lapTimeUpdated: "Lap time updated.",
    updateLapTimeFor: (trackName: string) => `Update lap time for ${trackName}`,
  },
};

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
  const [language, setLanguage] = useState("pl");
    const [translation, setTranslation] = useState(translations.pl);

      useEffect(() => {
        setTranslation(language === "pl" ? translations.pl : translations.en);
      }, [language]);
    
      const toggleLanguage = () => {
        setLanguage(prev => (prev === "pl" ? "en" : "pl"));
      };


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
        title: translation.success,
        description: translation.trackAdded,
      });
    } else if (newTrackName && tracks.includes(newTrackName)) {
      toast({
        title: translation.error,
        description: translation.trackExists,
        variant: "destructive",
      });
    } else {
      toast({
        title: translation.error,
        description: translation.enterTrackNameError,
        variant: "destructive",
      });
    }
  };

  const handleUpdateLapTime = (trackName: string) => {
    if (!newLapTime || !newDate) {
      toast({
        title: translation.error,
        description: translation.fillAllFields,
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
      title: translation.success,
      description: translation.lapTimeUpdated,
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
                {translation.bestTime} {latestLap.lapTime.toFixed(3)}s
              </p>
              <p className="text-xs text-muted-foreground text-center">
                {translation.date} {format(latestLap.date, "PPP")}
              </p>
              {timeDifference && (
                <p className="text-xs text-muted-foreground text-center">
                  {translation.difference} {timeDifference}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-center">{translation.noLaps}</p>
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
              placeholder={translation.enterTrackName}
              value={newTrackName}
              onChange={handleInputChange}
              className="mb-2 text-black"
              onClick={(e) => e.stopPropagation()}
            />
            <Button onClick={handleAdd} className="w-full" onClick={(e) => e.stopPropagation()}>{translation.addTrackButton}</Button>
          </div>
        ) : (
          <Button variant="ghost" size="lg" onClick={handleClick}>
            <Plus />
            <span>{translation.addTrack}</span>
          </Button>
        )}
      </Card>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
       <Button variant="link" className="mt-4" onClick={toggleLanguage}>
                {language === "pl" ? "ENG" : "PL"}
              </Button>
      <h1 className="text-3xl font-bold mb-4 text-foreground">{translation.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
        {tracks.map((track) => (
          <TrackTile key={track} trackName={track} />
        ))}
        <AddTrackTile />
      </div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translation.updateLapTimeFor(selectedTrack)}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="lapTime">{translation.lapTimeLabel}</Label>
              <Input
                id="lapTime"
                type="number"
                placeholder={translation.lapTimeLabel}
                value={newLapTime !== undefined ? newLapTime.toString() : ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setNewLapTime(isNaN(value) ? undefined : value);
                }}
                className="text-black"
              />
            </div>
            <div className="grid gap-2">
              <Label>{translation.dateLabel}</Label>
              <Calendar
                mode="single"
                selected={newDate}
                onSelect={setNewDate}
                className={cn("rounded-md border")}
              />
            </div>
          </div>
          <Button onClick={() => handleUpdateLapTime(selectedTrack)}>
            {translation.updateLapTimeButton}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
