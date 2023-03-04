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
import { useMessageStore } from "./hooks/useMessageStore";

const App: React.FC = () => {
  const [prompt, setPrompt] = useLocalStorage("prompt", "");
  const { messages, addMessage } = useMessageStore();

  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  const submitPrompt = useCallback(() => {
    // const SERVER_URL = `http://${window.location.hostname}:3000`;

    if (isWaitingResponse) return;

    if (prompt === "") {
      setIsWaitingResponse(false);
      return;
    }

    async function promptGPTFromServer(message: string) {
      const requestBody = {
        content: message,
      };

      const response = await fetch("/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        body: JSON.stringify(requestBody),
      });

      return await response.json();
    }

    // start the async prompting process
    setIsWaitingResponse(true);
    (async function () {
      // add to local entry
      addMessage(MessageRole.USER, prompt);

      // prompt chat gpt
      const response = await promptGPTFromServer(prompt);
      addMessage(MessageRole.ASSISTANT, response.content);

      // done prompting
      setIsWaitingResponse(false);
      setPrompt(""); // empty the prompt
    })();
  }, [prompt]);

  return (
    <div className="flex flex-col bg-gray-800 text-gray-300">
      <div className="m-4  min-h-screen">
        <div className="mt-4">
          <input
            disabled={isWaitingResponse}
            name="prompt"
            className="w-full p-4 text-4xl block bg-gray-700 rounded-xl outline-none"
            placeholder="Ask a Question"
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                // submit
                submitPrompt();
                e.preventDefault();
              }
            }}
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
