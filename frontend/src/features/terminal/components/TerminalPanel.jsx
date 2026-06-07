import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import 'xterm/css/xterm.css';
import { useTerminal } from '../hooks/useTerminal.js';
import { Terminal as TerminalIcon, Circle } from 'lucide-react';
import { useWorkspace } from '../../workspace/hooks/useWorkspace.js';

export default function TerminalPanel() {
  const { sandboxId } = useWorkspace();
  const { socket, isConnected, sendCommand } = useTerminal(sandboxId);
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const inputSubscriptionRef = useRef(null);

  useEffect(() => {
    const container = terminalRef.current;
    if (!container || xtermRef.current) return;

    const xterm = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#000000',
        foreground: '#e2e2e2',
        cursor: '#4D8CFF',
        selectionBackground: 'rgba(77, 140, 255, 0.3)',
      },
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.loadAddon(new WebLinksAddon());

    let isOpened = false;

    const fitTerminal = () => {
      if (!container.isConnected || container.clientWidth === 0 || container.clientHeight === 0) {
        return;
      }
      
      try {
        if (!isOpened) {
          xterm.open(container);
          xterm.writeln('\x1b[36mBooting sandbox environment... Please wait.\x1b[0m');
          isOpened = true;
        }
        fitAddon.fit();
      } catch (e) {
        // Safe catch for internal xterm dimension calculation delays
      }
    };

    const animationFrame = requestAnimationFrame(fitTerminal);
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(fitTerminal);
    });

    resizeObserver.observe(container);

    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      inputSubscriptionRef.current?.dispose();
      inputSubscriptionRef.current = null;
      xterm.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, []);

  useEffect(() => {
    const xterm = xtermRef.current;
    if (!xterm || !socket) return;

    inputSubscriptionRef.current?.dispose();
    inputSubscriptionRef.current = xterm.onData((data) => {
      sendCommand(data);
    });

    const outputHandler = (data) => {
      const output = typeof data === 'string' ? data : data?.output;
      if (output) xterm.write(output);
    };

    socket.on('terminal-output', outputHandler);

    return () => {
      inputSubscriptionRef.current?.dispose();
      inputSubscriptionRef.current = null;
      socket.off('terminal-output', outputHandler);
    };
  }, [socket, sendCommand]);

  // Progressive loading messages
  useEffect(() => {
    const xterm = xtermRef.current;
    if (!xterm) return;

    let timeoutIds = [];

    if (!isConnected) {
      timeoutIds.push(setTimeout(() => {
        if (!isConnected) xterm.writeln('\x1b[36mInitializing container network...\x1b[0m');
      }, 1500));
      
      timeoutIds.push(setTimeout(() => {
        if (!isConnected) xterm.writeln('\x1b[36mMounting workspace volumes...\x1b[0m');
      }, 3000));
      
      timeoutIds.push(setTimeout(() => {
        if (!isConnected) xterm.writeln('\x1b[36mStarting development server...\x1b[0m');
      }, 4500));
    } else {
      xterm.writeln('\x1b[32m✓ Connected to sandbox environment.\x1b[0m');
      xterm.writeln(''); // Empty line for spacing
    }

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [isConnected]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 thin-border-b">
        <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
          <TerminalIcon className="w-4 h-4" />
          <span>Console</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">{isConnected ? 'Connected' : 'Disconnected'}</span>
          <Circle className={`w-2 h-2 fill-current ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
        </div>
      </div>
      
      <div className="flex-1 p-3 overflow-hidden relative bg-background">
        <div ref={terminalRef} className="absolute inset-2" />
      </div>
    </div>
  );
}
