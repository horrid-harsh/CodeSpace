import React, { createContext, useMemo, useState } from 'react';

export const TerminalContext = createContext(null);

export function TerminalProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  const value = useMemo(() => ({
    isConnected,
    socket,
    setIsConnected,
    setSocket
  }), [isConnected, socket]);

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}
