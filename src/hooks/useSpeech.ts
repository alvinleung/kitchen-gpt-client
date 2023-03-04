import { useEffect, useMemo, useRef, useState } from "react";

interface SpeechHandlers {
  // live transcription
  onTranscriptionUpdate?: (
    transcript: string,
    dropTranscription: () => void
  ) => void;
  // when user pause
  onTranscriptionFinalized?: (transcript: string) => void;
}

export function useSpeech(handlers?: SpeechHandlers) {
  const isRecognizingRef = useRef(false);

  const recognition = useMemo<any>(() => {
    if (!window.hasOwnProperty("webkitSpeechRecognition")) {
      // updgrade
      console.error("your browser doesn't support speech recognition");
    } else {
      console.log("starting speech recognition");

      //@ts-ignore
      let recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en";

      return recognition;
    }
  }, []);

  useEffect(() => {
    if (!recognition) return;

    let final_transcript = "";

    recognition.onresult = function (event: any) {
      let interim_transcript = "";
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
          isFinal = true;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }

      const abortTranscription = () => {
        // reset transcript here
        recognition.abort();
      };

      handlers?.onTranscriptionUpdate?.(interim_transcript, abortTranscription);

      // reset final transcript
      if (isFinal) handlers?.onTranscriptionFinalized?.(final_transcript);
      final_transcript = "";
    };

    recognition.onstart = function () {
      isRecognizingRef.current = true;
    };

    recognition.onend = function () {
      isRecognizingRef.current = false;
    };

    recognition.onerror = function () {
      isRecognizingRef.current = false;
    };
  }, [recognition]);

  const startSpeechRecognition = () => {
    console.log(isRecognizingRef.current);

    if (isRecognizingRef.current) {
      console.log("Speech recognition already started, ignoring request.");
      return;
    }
    // console.log("start recognising");

    try {
      recognition.start();
    } catch (e) {
      console.log(e);
    }
    isRecognizingRef.current = true;
  };
  const stopSpeechRecognition = () => {
    // console.log("stop recognising");
    recognition.stop();
    isRecognizingRef.current = false;
  };

  return {
    startSpeechRecognition,
    stopSpeechRecognition,
  };
}
