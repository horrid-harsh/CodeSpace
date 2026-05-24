import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../hooks/useWorkspace.js';
import ChatPanel from '../../chat/components/ChatPanel.jsx';
import PreviewPanel from '../../preview/components/PreviewPanel.jsx';
import TerminalPanel from '../../terminal/components/TerminalPanel.jsx';

export default function WorkspacePage() {
  const { sandboxId } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sandboxId) {
      navigate('/');
    }
  }, [sandboxId, navigate]);

  if (!sandboxId) return null;

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-12 border-b border-slate-800/80 bg-slate-900 flex items-center px-4 shrink-0">
        <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          Workspace Active
          <span className="text-slate-600 ml-2 font-mono text-xs">{sandboxId}</span>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-1 flex gap-4 p-4 min-h-0">
        
        {/* Left Sidebar (Chat) */}
        <div className="w-[400px] flex-shrink-0 flex flex-col min-h-0">
          <ChatPanel />
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 min-h-0">
          {/* Preview Panel (Top) */}
          <div className="flex-[2] min-h-0">
            <PreviewPanel />
          </div>

          {/* Terminal Panel (Bottom) */}
          <div className="flex-1 min-h-0">
            <TerminalPanel />
          </div>
        </div>

      </main>
    </div>
  );
}
