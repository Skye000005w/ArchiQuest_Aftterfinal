"use client";

import { useEffect, useState } from "react";

import TextToSpeech, { AuraModel } from "./TextToSpeech";

const models = [
  "aura-asteria-en",
  "aura-luna-en",
  "aura-stella-en",
  "aura-athena-en",
  "aura-hera-en",
  "aura-orion-en",
  "aura-arcas-en",
  "aura-perseus-en",
  "aura-angus-en",
  "aura-orpheus-en",
  "aura-helios-en",
  "aura-zeus-en",
];

//This could take a string rather than array and could split in useEffect. Would solve the issue with the re-render and remove the first-line hack
export default function Caption({
  text,
  speed = 5000,
  speech = false,
  onComplete,
}: {
  text: string;
  speed?: number;
  speech?: boolean;
  onComplete?: () => void;
}) {
  const [voices, setVoices] = useState<any>({ Narrator: "aura-helios-en" });
  const [currentVoice, setCurrentVoice] = useState<AuraModel | null>();
  const [spokenText, setSpokenText] = useState<string | null>(null);

  useEffect(() => {
    if (!speech && onComplete) {
      const interval = setInterval(() => {
        onComplete();
      }, speed);
      return () => clearInterval(interval);
    }
  }, [speed, speech]);

  useEffect(() => {
    const speaker = text.split(":")[0];
    const script = text.split(":")[1];

    if (!speaker || !script) setSpokenText(null);

    setSpokenText(script);

    if (voices[speaker]) {
      setCurrentVoice(voices[speaker]);
    } else {
      //get a random model
      const randomModel = models[
        Math.floor(Math.random() * models.length)
      ] as AuraModel;
      setCurrentVoice(randomModel);
      setVoices({ ...voices, [speaker]: randomModel });
    }
  }, [text]);

  return (
    <div className="absolute bottom-0 left-0 w-screen h-auto flex flex-col items-center justify-end pb-4">
      <p className="text-sm bg-black/50 p-2 rounded-lg max-w-lg text-white font-semibold">
        {text}
      </p>
      {speech && spokenText && (
        <TextToSpeech
          text={spokenText}
          showControls={false}
          autoPlay
          handleEnded={onComplete}
          model={currentVoice ?? "aura-helios-en"}
        />
      )}
    </div>
  );
}
