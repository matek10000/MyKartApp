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
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";

type LapTimeEntry = {
  trackName: string;
  lapTime: number;
  date: Date;
};

export default function Home() {
  const [trackName, setTrackName] = useState("");
  const [lapTime, setLapTime] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [lapTimes, setLapTimes] = useState<LapTimeEntry[]>([]);
  const [bestLap, setBestLap] = useState<LapTimeEntry | null>(null);
  const { toast } = useToast();

  const handleTrackNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackName(e.target.value);
  };

  const handleLapTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLapTime(isNaN(value) ? undefined : value);
  };

  const handleSubmit = () => {
    if (!trackName || !lapTime || !date) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const newLapTimeEntry: LapTimeEntry = {
      trackName,
      lapTime,
      date,
    };

    setLapTimes([...lapTimes, newLapTimeEntry]);

    if (!bestLap || lapTime < bestLap.lapTime) {
      setBestLap(newLapTimeEntry);
      toast({
        title: "New Best Lap!",
        description: `New best lap time for ${trackName}: ${lapTime.toFixed(3)}`,
      });
    } else {
       toast({
         title: "Lap Time Added",
         description: `Lap time for ${trackName}: ${lapTime.toFixed(3)}`,
       });
    }

    setTrackName("");
    setLapTime(undefined);
    setDate(undefined);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">MyKart</h1>
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Add New Lap Time</CardTitle>
            <CardDescription>Enter the track name, lap time, and date.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="trackName">Track Name</Label>
              <Input
                id="trackName"
                placeholder="Enter track name"
                value={trackName}
                onChange={handleTrackNameChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lapTime">Lap Time (seconds)</Label>
              <Input
                id="lapTime"
                type="number"
                placeholder="Enter lap time"
                value={lapTime !== undefined ? lapTime.toString() : ""}
                onChange={handleLapTimeChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className={cn("rounded-md border")}
              />
              {date ? (
                <p className="text-sm text-muted-foreground">
                  Selected date: {format(date, "PPP")}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Please select a date.
                </p>
              )}
            </div>
            <Button onClick={handleSubmit}>Add Lap Time</Button>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Lap Time List</CardTitle>
            <CardDescription>List of your best lap times for each track.</CardDescription>
          </CardHeader>
          <CardContent>
            {lapTimes.length === 0 ? (
              <p>No lap times added yet.</p>
            ) : (
              <ul className="list-none p-0">
                {lapTimes.sort((a, b) => a.date.getTime() - b.date.getTime()).map((entry, index) => (
                  <li key={index} className="mb-2 p-2 rounded-md shadow-sm flex items-center justify-between">
                    <div className="flex items-center">
                      {/* <Icons.racingFlag className="mr-2 h-4 w-4" /> */}
                      <div>
                        <p className="font-medium">{entry.trackName}</p>
                        <p className="text-sm text-muted-foreground">
                          Lap Time: {entry.lapTime.toFixed(3)} - {format(entry.date, "PPP")}
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
