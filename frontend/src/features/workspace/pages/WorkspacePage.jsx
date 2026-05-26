import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../hooks/useWorkspace.js';
import ChatPanel from '../../chat/components/ChatPanel.jsx';
import PreviewPanel from '../../preview/components/PreviewPanel.jsx';
import TerminalPanel from '../../terminal/components/TerminalPanel.jsx';
import ExplorerPanel from '../../explorer/components/ExplorerPanel.jsx';
import EditorPanel from '../../editor/components/EditorPanel.jsx';
import { X, Play } from 'lucide-react';
import { clsx } from 'clsx';
import logoName from '../../../assets/images/logo-name-v1.png';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

export default function WorkspacePage() {
  const { sandboxId, openFiles, activeFile, setActiveFile, closeFile, exitWorkspace } = useWorkspace();
  const navigate = useNavigate();
  // We need a local state for the active tab since it can be either a file path or 'preview'
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    if (!sandboxId) {
      navigate('/');
    }
  }, [sandboxId, navigate]);

  // When activeFile changes from the explorer, switch to it
  useEffect(() => {
    if (activeFile) {
      setActiveTab(activeFile);
    }
  }, [activeFile]);

  if (!sandboxId) return null;

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden text-slate-300">
      {/* Mobile Overlay */}
      <div className="md:hidden fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center" style={{ fontFamily: 'var(--font-machina)' }}>
        <img src={logoName} alt="Codespace" className="h-10 mb-8 select-none pointer-events-none" draggable="false" />
        <p className="text-[#a0a0a0] text-xl leading-relaxed font-light">
          For the best experience,<br />
          please open Codespace on<br />
          a <span className="text-white font-normal">desktop browser</span>.
        </p>
      </div>

      {/* Header */}
      <header className="h-12 border-b border-border-low-contrast bg-surface flex items-center px-4 shrink-0 justify-between relative">
        <div className="flex items-center gap-3 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="font-medium text-sm text-slate-200">Workspace Active</span>
          </div>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
          <img 
            src={logoName} 
            alt="Logo" 
            className="h-5 object-contain select-none cursor-pointer" 
            draggable="false" 
            onClick={exitWorkspace}
          />
        </div>
      </header>

      {/* Main Layout Grid - Resizable 3 Columns */}
      <main className="flex-1 min-h-0 p-2 bg-background overflow-hidden">
        <Allotment separator={true}>

          {/* Left Sidebar (Explorer) */}
          <Allotment.Pane minSize={120} maxSize={400} preferredSize={240}>
            <div className="h-full pr-1 min-w-0 min-h-0 flex flex-col">
              <div className="h-full panel-container min-w-0 min-h-0">
                <ExplorerPanel />
              </div>
            </div>
          </Allotment.Pane>

          {/* Center Content Area (Preview/Editor + Terminal) */}
          <Allotment.Pane minSize={250}>
            <div className="h-full px-1 min-w-0 min-h-0 flex flex-col">
              <Allotment vertical={true} separator={true}>

              {/* Top Panel (Tabs + Editor/Preview) */}
              <Allotment.Pane minSize={100}>
                <div className="h-full pb-1 min-w-0 min-h-0 flex flex-col">
                  <div className="h-full flex flex-col panel-container bg-[#1E1E1E] min-w-0 min-h-0">
                  {/* Tab Bar */}
                  <div className="flex bg-[#1E1E1E] overflow-x-auto shrink-0 select-none custom-scrollbar">
                    <div
                      onClick={() => { setActiveTab('preview'); setActiveFile(null); }}
                      className={clsx(
                        "flex items-center gap-2 px-4 py-2 border-r border-[#2D2D2D] cursor-pointer min-w-fit text-sm transition-colors relative",
                        activeTab === 'preview'
                          ? "bg-gradient-to-b from-blue-500/10 to-[#1E1E1E] text-white"
                          : "bg-[#2D2D2D] text-slate-400 hover:bg-[#252526]"
                      )}
                    >
                      {activeTab === 'preview' && (
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                      )}
                      <Play size={14} />
                      Preview
                    </div>

                    {openFiles.map(filePath => (
                      <div
                        key={filePath}
                        onClick={() => { setActiveTab(filePath); setActiveFile(filePath); }}
                        className={clsx(
                          "flex items-center gap-2 pl-4 pr-2 py-2 border-r border-[#2D2D2D] cursor-pointer min-w-fit text-sm transition-colors group relative",
                          activeTab === filePath
                            ? "bg-gradient-to-b from-blue-500/10 to-[#1E1E1E] text-white"
                            : "bg-[#2D2D2D] text-slate-400 hover:bg-[#252526]"
                        )}
                      >
                        {activeTab === filePath && (
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                        )}
                        <span className="truncate">{filePath.split('/').pop()}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closeFile(filePath);
                            if (activeTab === filePath) setActiveTab('preview');
                          }}
                          className="p-0.5 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 min-h-0 min-w-0 bg-[#1E1E1E] relative overflow-hidden">
                    <div className={clsx("absolute inset-0", activeTab === 'preview' ? "block" : "hidden")}>
                      <PreviewPanel />
                    </div>
                    <div className={clsx("absolute inset-0", activeTab !== 'preview' ? "block" : "hidden")}>
                      {activeTab !== 'preview' && <EditorPanel />}
                    </div>
                  </div>
                  </div>
                </div>
              </Allotment.Pane>

              {/* Terminal Panel (Bottom) */}
              <Allotment.Pane minSize={80} maxSize={400} preferredSize={200}>
                <div className="h-full pt-1 min-w-0 min-h-0 flex flex-col">
                  <div className="h-full panel-container min-w-0 min-h-0">
                    <TerminalPanel />
                  </div>
                </div>
              </Allotment.Pane>

            </Allotment>
            </div>
          </Allotment.Pane>

          {/* Right Sidebar (Chat) */}
          <Allotment.Pane minSize={200} maxSize={500} preferredSize={300}>
            <div className="h-full pl-1 min-w-0 min-h-0 flex flex-col">
              <div className="h-full panel-container min-w-0 min-h-0">
                <ChatPanel />
              </div>
            </div>
          </Allotment.Pane>

        </Allotment>
      </main>
    </div>
  );
}
