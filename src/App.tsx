import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import { useDebounce, useDebouncedCallback } from "use-debounce";
import { useLocalStorage, useDebounce } from "usehooks-ts";
import { createMessageStore, MessageRole } from "./chatapi/MessageStore";
import VoiceInput from "./components/VoiceInput";
import { useChat } from "./hooks/useChat";
import { useMessageStore } from "./hooks/useMessageStore";
import { useSpeech } from "./hooks/useSpeech";
import { useTextToSpeeh } from "./hooks/useTextToSpeech";

const App: React.FC = () => {
  const [prompt, setPrompt] = useLocalStorage("prompt", "");

  const { isWaitingResponse, submitPrompt, messages, clearMessages } =
    useChat();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const promptValue = (e.target as HTMLInputElement).value as string;

      if (promptValue === "reset") {
        clearMessages();
        setPrompt("");
        e.preventDefault();
        return;
      }

      // submit
      submitPrompt(promptValue);
      setPrompt("");
      e.preventDefault();
    }
  };

  const handleSubmit = (prompt: string) => {
    if (prompt === "") return;
    submitPrompt(prompt);
  };

  const { speak, isSpeaking, stopSpeaking } = useTextToSpeeh();
  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];

    const wordcount = latestMessage.content.split(" ").length;

    if (wordcount > 30) {
      speak("my asnwer too fucking long, I am not reading it out.");
      return;
    }
    if (latestMessage.role === MessageRole.ASSISTANT) {
      speak(latestMessage.content);
    }
  }, [messages]);

  return (
    <div className="flex flex-col bg-gray-800 text-gray-300">
      <div className="m-4  min-h-screen">
        <div className="mt-4">
          <VoiceInput
            onStartRecognition={() => {
              stopSpeaking();
            }}
            onStopRecognition={() => {
              stopSpeaking();
            }}
            onSubmit={handleSubmit}
            disabled={isWaitingResponse || isSpeaking}
          />
          {/* <input
            disabled={isWaitingResponse}
            name="prompt"
            style={{
              opacity: isWaitingResponse ? 0.5 : 1,
            }}
            className="w-full p-4 text-4xl block bg-gray-700 rounded-xl outline-none"
            placeholder="Ask a Question"
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            value={prompt}
            onFocus={() => {
              startSpeechRecognition();
            }}
            onBlur={() => {
              stopSpeechRecognition();
            }}
          /> */}
        </div>
        <div className="flex flex-col-reverse">
          {messages.map((message, index) => (
            <div className="pt-4" key={index}>
              <div className="text-normal opacity-50">{message.role}</div>
              <div className="text-2xl">{message.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
