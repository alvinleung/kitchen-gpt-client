import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useSpeech } from "../hooks/useSpeech";
import { useStateRef } from "../hooks/useStateRef";

type Props = {
  onStartRecognition?: () => void;
  onStopRecognition?: () => void;
  onSubmit?: (value: string) => void;
  disabled?: boolean;
};

const WAKE_UP_PHRASE = "hello";
const CANCEL_LISTENING_PHRASE = "stop.";
const CANCEL_LISTENING_PHRASE_ALT = "never mind";

const containsPhrase = (transcript: string, phrase: string) =>
  transcript.toLowerCase().indexOf(phrase) !== -1;

const VoiceInput = ({
  onSubmit,
  disabled,
  onStartRecognition,
  onStopRecognition,
}: Props) => {
  const [transcript, setTranscript] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const isAskingRef = useStateRef(isAsking);
  const disabledRef = useStateRef(disabled);

  const [ambientTranscript, setAmbientTranscript] = useState("");

  const wakeUpRecognizer = useSpeech({
    onTranscriptionUpdate: (transcript) => {
      setAmbientTranscript(transcript);
      if (disabledRef.current) return;
      if (containsPhrase(transcript, WAKE_UP_PHRASE)) {
        setIsAsking(true);
      }
    },
  });

  const { startSpeechRecognition, abortSpeechRecognition } = useSpeech({
    onTranscriptionUpdate: (transcript) => {
      setTranscript(transcript);
    },
    onTranscriptionFinalized: (transcript) => {
      if (
        containsPhrase(transcript, CANCEL_LISTENING_PHRASE) ||
        containsPhrase(transcript, CANCEL_LISTENING_PHRASE_ALT)
      ) {
        setIsAsking(false);
        setTranscript("");
        return;
      }
      onSubmit && onSubmit(transcript);
      setTranscript("");
    },
  });

  useEffect(() => {
    if (isAsking) {
      onStartRecognition?.();
      startSpeechRecognition();
      wakeUpRecognizer.stopSpeechRecognition();
      return;
    }

    onStopRecognition?.();
    abortSpeechRecognition();
    wakeUpRecognizer.startSpeechRecognition();
    setTranscript("");
  }, [isAsking]);

  useEffect(() => {
    if (disabled) {
      abortSpeechRecognition();
      return;
    }

    if (isAskingRef.current) {
      startSpeechRecognition();
    }
  }, [disabled]);

  useEffect(() => {
    wakeUpRecognizer.startSpeechRecognition();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // cancel the voice input
        setIsAsking(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <motion.div
      className="p-4 rounded-lg flex"
      onClick={() => {
        !disabled && setIsAsking(!isAsking);
      }}
      animate={{
        cursor: disabled ? "" : "pointer",
        opacity: disabled ? 0.3 : 1,
        height: disabled ? 0 : "100%",
        backgroundColor: isAsking ? "rgba(55,65,81,1)" : "rgba(55,65,81,.5)",
      }}
    >
      {!isAsking && !disabled && <div>Click here or say "Hello" to begin </div>}
      {isAsking && (
        <div className="opacity-50 ">
          {transcript === "" ? "Listening..." : transcript}
        </div>
      )}
      &nbsp;
    </motion.div>
  );
};

export default VoiceInput;
