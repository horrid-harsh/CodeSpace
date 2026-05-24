import React, { createContext, useMemo, useState } from 'react';

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const value = useMemo(() => ({
    messages,
    isStreaming,
    error,
    setMessages,
    setIsStreaming,
    setError
  }), [messages, isStreaming, error]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
