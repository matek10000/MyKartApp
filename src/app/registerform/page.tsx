"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <h1 className="text-3xl font-bold mb-4 text-foreground">Register Form</h1>
            <div className="flex flex-col space-y-4 w-full max-w-sm">
                <div>
                    <Label htmlFor="firstName" className="text-white">Imię</Label>
                    <Input id="firstName" type="text" placeholder="Imię" className="text-black"/>
                </div>
                <div>
                    <Label htmlFor="lastName" className="text-white">Nazwisko</Label>
                    <Input id="lastName" type="text" placeholder="Nazwisko" className="text-black"/>
                </div>
                <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input id="email" type="email" placeholder="Email" className="text-black"/>
                </div>
                <div>
                    <Label htmlFor="password" className="text-white">Hasło</Label>
                    <Input id="password" type="password" placeholder="Hasło" className="text-black"/>
                </div>
                <div>
                    <Label htmlFor="confirmPassword" className="text-white">Potwierdź Hasło</Label>
                    <Input id="confirmPassword" type="password" placeholder="Potwierdź Hasło" className="text-black"/>
                </div>
                <Button onClick={() => router.push("/")}>Back to Home</Button>
            </div>
        </div>
    );
}

