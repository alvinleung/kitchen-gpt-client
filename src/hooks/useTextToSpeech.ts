import {useEffect, useMemo, useState} from "react";

export function useTextToSpeeh() {
  const msg = useMemo(() => new SpeechSynthesisUtterance(), []);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const handleEnd = () => {
      setIsSpeaking(false);
    };

    msg.addEventListener("end", handleEnd);
    return () => {
      msg.removeEventListener("end", handleEnd);
    };
  }, []);

  const speak = (text: string) => {
    msg.text = text;
    window.speechSynthesis.speak(msg);
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    speak,
    isSpeaking,
    stopSpeaking,
  };
}
