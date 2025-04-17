"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type LapTimeEntry = {
  trackName: string;
  lapTime: number;
  date: Date;
};

const predefinedTracks = [
  "WRT Kapelanka",
  "WRT Nowa Huta",
  "ICF Rzeszów",
  "Reskart Rzeszów",
  "E1 Chorzów",
  "Go Karting Center",
];

export default function Home() {
  const [selectedTrack, setSelectedTrack] = useState("");
  const [newTrackName, setNewTrackName] = useState("");
  const [lapTime, setLapTime] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [lapTimes, setLapTimes] = useState<LapTimeEntry[]>([]);
  const [bestLap, setBestLap] = useState<LapTimeEntry | null>(null);
  const { toast } = useToast();

  const handleTrackNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTrackName(e.target.value);
  };

  const handleLapTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLapTime(isNaN(value) ? undefined : value);
  };

  const handleAddTrack = () => {
    if (newTrackName && !predefinedTracks.includes(newTrackName)) {
      predefinedTracks.push(newTrackName);
      setNewTrackName("");
      toast({
        title: "Sukces",
        description: "Tor dodany do listy.",
      });
    }
     else if (newTrackName && predefinedTracks.includes(newTrackName)) {
       toast({
         title: "Błąd",
         description: "Tor już jest na liście.",
         variant: "destructive",
       });
     }
    else {
      toast({
        title: "Błąd",
        description: "Wprowadź nazwę toru.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    if (!selectedTrack || !lapTime || !date) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie pola.",
        variant: "destructive",
      });
      return;
    }

    const newLapTimeEntry: LapTimeEntry = {
      trackName: selectedTrack,
      lapTime,
      date,
    };

    setLapTimes([...lapTimes, newLapTimeEntry]);

    if (!bestLap || lapTime < bestLap.lapTime) {
      setBestLap(newLapTimeEntry);
      toast({
        title: "Nowy Najlepszy Czas!",
        description: `Nowy najlepszy czas dla ${selectedTrack}: ${lapTime.toFixed(3)}`,
      });
    } else {
      toast({
        title: "Dodano Czas Okrążenia",
        description: `Czas okrążenia dla ${selectedTrack}: ${lapTime.toFixed(3)}`,
      });
    }

    setSelectedTrack("");
    setLapTime(undefined);
    setDate(undefined);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <h1 className="text-3xl font-bold mb-4 text-foreground">MyKart</h1>
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
        <Card className="w-full md:w-1/2 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Dodaj Nowy Czas Okrążenia</CardTitle>
            <CardDescription>Wprowadź nazwę toru, czas okrążenia i datę.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="trackName">Nazwa Toru</Label>
              <Select onValueChange={setSelectedTrack}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz tor" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px] w-[inherit]">
                    {predefinedTracks.map((track) => (
                      <SelectItem key={track} value={track}>
                        {track}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Dodaj Nowy Tor</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2">
                <div className="grid gap-2">
                  <Label htmlFor="newTrackName">Nazwa Toru</Label>
                  <Input
                    id="newTrackName"
                    placeholder="Wprowadź nazwę toru"
                    value={newTrackName}
                    onChange={handleTrackNameChange}
                  />
                  <Button type="button" size="sm" onClick={handleAddTrack}>
                    Dodaj Tor
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="grid gap-2">
              <Label htmlFor="lapTime">Czas Okrążenia (sekundy)</Label>
              <Input
                id="lapTime"
                type="number"
                placeholder="Wprowadź czas okrążenia"
                value={lapTime !== undefined ? lapTime.toString() : ""}
                onChange={handleLapTimeChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Data</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className={cn("rounded-md border")}
              />
              {date ? (
                <p className="text-sm text-muted-foreground">
                  Wybrana data: {format(date, "PPP")}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Wybierz datę.
                </p>
              )}
            </div>
            <Button onClick={handleSubmit}>Dodaj Czas Okrążenia</Button>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/2 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Lista Czasów Okrążeń</CardTitle>
            <CardDescription>Lista Twoich najlepszych czasów okrążeń dla każdego toru.</CardDescription>
          </CardHeader>
          <CardContent>
            {lapTimes.length === 0 ? (
              <p>Brak dodanych czasów okrążeń.</p>
            ) : (
              <ul className="list-none p-0">
                {lapTimes.sort((a, b) => a.date.getTime() - b.date.getTime()).map((entry, index) => (
                  <li key={index} className="mb-2 p-2 rounded-md shadow-sm flex items-center justify-between">
                    <div className="flex items-center">
                      <div>
                        <p className="font-medium">{entry.trackName}</p>
                        <p className="text-sm text-muted-foreground">
                          Czas: {entry.lapTime.toFixed(3)} - {format(entry.date, "PPP")}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
       </div>
  );
}


