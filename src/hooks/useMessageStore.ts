import { useMemo, useState } from "react";
import {
  createMessageStore,
  Message,
  MessageRole,
} from "../chatapi/MessageStore";

export function useMessageStore() {
  const messageStore = useMemo(() => createMessageStore(), []);

  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (role: MessageRole, content: string) => {
    messageStore.add(role, content);
    setMessages([...messageStore.getRecentMessages()]);
  };

  const clearMessages = () => {
    messageStore.clear();
  };
  return {
    messages,
    addMessage,
    clearMessages,
  };
}
