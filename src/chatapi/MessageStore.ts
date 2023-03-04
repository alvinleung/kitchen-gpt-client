export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export interface Message {
  role: MessageRole;
  content: string;
}

export const createMessageStore = () => {
  const store: Message[] = [];

  const add = (role: MessageRole, content: string) => {
    store.push({
      role: role,
      content: content,
    });
  };

  const getRecentMessages = () => {
    return store;
  };
  const snapshot = () => JSON.parse(JSON.stringify(store));

  return {
    add,
    snapshot,
    getRecentMessages,
  };
};
