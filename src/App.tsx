import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
// import { useDebounce, useDebouncedCallback } from "use-debounce";
import {useLocalStorage, useDebounce} from "usehooks-ts";
import {createMessageStore, Message, MessageRole} from "./chatapi/MessageStore";
import {Ingredients} from "./components/Ingredients";
import Video from "./components/Video";
import VoiceInput from "./components/VoiceInput";
import {useChat} from "./hooks/useChat";
import {useMessageStore} from "./hooks/useMessageStore";
import {useSpeech} from "./hooks/useSpeech";
import {useTextToSpeeh} from "./hooks/useTextToSpeech";

const App: React.FC = () => {
  const [prompt, setPrompt] = useLocalStorage("prompt", "");

  //backend
  const {isWaitingResponse, submitPrompt, messages, clearMessages} = useChat();
  //stop speech
  const {
    startSpeechRecognition,
    abortSpeechRecognition,
    stopSpeechRecognition,
  } = useSpeech();

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

  const DisplayFirst = () => {
    messages.map((message, index) => (
      <div className="pt-4" key={index}>
        <div className="text-normal opacity-50">{message.role}</div>
        <div className="text-2xl">{message.content}</div>
      </div>
    ));
    return;
  };

  const {speak, isSpeaking, stopSpeaking} = useTextToSpeeh();
  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];

    const wordcount = latestMessage.content.split(" ").length;

    const [summarized, expanded] = latestMessage.content.split("~");

    // if it's too long, like 50 words, provide a summary.
    // if (wordcount > 50) {
    //   speak(summarized);
    //   return;
    // }

    if (latestMessage.role === MessageRole.ASSISTANT) {
      speak(summarized);
      return;
    }
  }, [messages]);

  const latestAssistantMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      let currentMessage = messages[i];
      if (currentMessage.role === MessageRole.ASSISTANT)
        return currentMessage.content;
    }
    return "";
  }, [messages]);

  return (
    <>
      <div className="grid grid-cols-2">
        <Video />
        <Ingredients phrase={latestAssistantMessage} />
        <div className="flex flex-colbg-gray-800 text-gray-300 mt-10">
          <button onClick={stopSpeaking}>shutup</button>
          <div className="m-4 mt-4 ">
            <div className="mt-4 top-0 fixed">
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
            </div>
            <div className="flex flex-col-reverse mt-4">
              {messages.map((message, index) => (
                <div className="mt-15" key={index}>
                  <div className="text-normal opacity-50">{message.role}</div>
                  <div className="text-2xl">{message.content}</div>
                </div>
              ))}
            </div>
            {/* <div>
              <button onClick={stopSpeaking}>shutup</button>
              <button onClick={stopSpeechRecognition}>stopspeech</button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
