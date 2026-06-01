import { useContext, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { TerminalContext } from '../store/terminal.context.jsx';

function getAgentSocketUrl(sandboxId) {
  return `http://${sandboxId}.agent.localhost`;
}

export function useTerminal(sandboxId) {
  const context = useContext(TerminalContext);
  if (!context) throw new Error("useTerminal must be used within TerminalProvider");

  const { socket, setSocket, setIsConnected, ...state } = context;
  const socketRef = useRef(null);
  const lastTerminalOutputRef = useRef(0);
  const TERMINAL_ACTIVE_WINDOW_MS = 10_000;

  useEffect(() => {
    if (!sandboxId) return;

    const nextSocket = io(getAgentSocketUrl(sandboxId), {
      transports: ['websocket', 'polling'],
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    socketRef.current = nextSocket;
    setSocket(nextSocket);

    nextSocket.on('connect', () => {
      setIsConnected(true);
    });

    nextSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    nextSocket.on('connect_error', () => {
      setIsConnected(false);
    });

    // Track terminal activity
    nextSocket.on('terminal-output', () => {
      lastTerminalOutputRef.current = Date.now();
    });

    return () => {
      nextSocket.removeAllListeners();
      nextSocket.disconnect();
      if (socketRef.current === nextSocket) {
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
    };
  }, [sandboxId, setSocket, setIsConnected]);

  const sendCommand = useCallback((input) => {
    if (socket && input) {
      lastTerminalOutputRef.current = Date.now(); // Also count typing as activity
      socket.emit('terminal-input', input);
    }
  }, [socket]);

  const isTerminalBusy = useCallback(() => {
    return Date.now() - lastTerminalOutputRef.current < TERMINAL_ACTIVE_WINDOW_MS;
  }, []);

  return {
    ...state,
    socket,
    sendCommand,
    isTerminalBusy
  };
}
