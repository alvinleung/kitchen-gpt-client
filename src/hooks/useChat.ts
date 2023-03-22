import {useCallback, useEffect, useState} from "react";
import {MessageRole} from "../chatapi/MessageStore";
import {useMessageStore} from "./useMessageStore";

export function useChat() {
  const {messages, addMessage, clearMessages} = useMessageStore();
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  const submitPrompt = async (prompt: string) => {
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

    // add to local entry
    addMessage(MessageRole.USER, prompt);

    // prompt chat gpt
    const response = await promptGPTFromServer(prompt);
    console.log(response);
    addMessage(MessageRole.ASSISTANT, response.content);

    // done prompting
    setIsWaitingResponse(false);
  };

  const resetMessages = async () => {
    clearMessages();
    await fetch("/reset", {
      method: "POST",
    });
  };

  useEffect(() => {
    // reset chat session on start
    resetMessages();
  }, []);

  return {
    submitPrompt,
    messages,
    isWaitingResponse,
    clearMessages: resetMessages,
  };
}
