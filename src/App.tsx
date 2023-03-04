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
import { useChat } from "./hooks/useChat";
import { useMessageStore } from "./hooks/useMessageStore";

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

  return (
    <div className="flex flex-col bg-gray-800 text-gray-300">
      <div className="m-4  min-h-screen">
        <div className="mt-4">
          <input
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
          />
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
