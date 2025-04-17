"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const translations = {
  pl: {
    tagline: "Gromadź swoje wszystkie czasy w jednym miejscu!",
    startNow: "Zacznij już teraz!",
    logIn: "Zaloguj się",
    test: "Test",
  },
  en: {
    tagline: "Collect all your lap times in one place!",
    startNow: "Start Now!",
    logIn: "Log In",
    test: "Test",
  },
};

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [language, setLanguage] = useState("pl");
  const [translation, setTranslation] = useState(translations.pl);

  useEffect(() => {
    setTranslation(language === "pl" ? translations.pl : translations.en);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === "pl" ? "en" : "pl"));
  };

  const handleStartNow = () => {
    router.push("/registerform");
  };

  const handleLogIn = () => {
    router.push("/loginform");
  };

    const handleTest = () => {
    router.push("/tracks");
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <h1 className="text-3xl font-bold mb-4 text-foreground">{translation.tagline}</h1>
      <div className="flex flex-col items-center space-y-4">
        <Button size="lg" className="text-lg" onClick={handleStartNow}>
          {translation.startNow}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleLogIn}>
          {translation.logIn}
        </Button>
                <Button variant="secondary" size="sm" onClick={handleTest}>
          {translation.test}
        </Button>
      </div>
      <Button variant="link" className="mt-4" onClick={toggleLanguage}>
        {language === "pl" ? "ENG" : "PL"}
      </Button>
    </div>
  );
}

