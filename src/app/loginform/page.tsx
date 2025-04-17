"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <h1 className="text-3xl font-bold mb-4 text-foreground">Login Form</h1>
            <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
    );
}
