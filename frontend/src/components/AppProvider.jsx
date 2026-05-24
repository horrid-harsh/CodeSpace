import React from 'react';
import { WorkspaceProvider } from '../features/workspace/store/workspace.context.jsx';
import { ChatProvider } from '../features/chat/store/chat.context.jsx';
import { TerminalProvider } from '../features/terminal/store/terminal.context.jsx';

export function AppProvider({ children }) {
  return (
    <WorkspaceProvider>
      <ChatProvider>
        <TerminalProvider>
          {children}
        </TerminalProvider>
      </ChatProvider>
    </WorkspaceProvider>
  );
}
