import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Bot, Loader2 } from 'lucide-react';
import { useChat } from '../hooks/useChat.js';
import { useWorkspace } from '../../workspace/hooks/useWorkspace.js';
import { cn } from '../../../lib/utils.js';

export default function ChatPanel() {
  const { messages, isStreaming, handleSendMessage } = useChat();
  const { sandboxId } = useWorkspace();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming || !sandboxId) return;
    
    handleSendMessage(input.trim(), sandboxId);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-5 py-4 thin-border-b bg-transparent shrink-0">
        <h2 className="text-sm font-medium text-slate-300 flex items-center gap-2 select-none">
          <img src="/logo-favicon.png" alt="Codespace Agent" className="w-4 h-4 select-none pointer-events-none" draggable="false" />
          Codespace Agent
        </h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 select-none">
            <img src="/logo-favicon.png" alt="Codespace Agent" className="w-10 h-10 opacity-20 grayscale select-none pointer-events-none" draggable="false" />
            <p className="text-sm text-center font-medium opacity-60">I'm ready to code. <br/>What are we building today?</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg.id || idx} className={cn("flex flex-col gap-1 text-sm", msg.role === 'user' ? "items-end" : "items-start")}>
              <div className={cn(
                "px-4 py-2.5 rounded-2xl max-w-[90%]",
                msg.role === 'user' 
                  ? "bg-white/10 text-slate-200 border border-white/5 rounded-br-sm" 
                  : "bg-white/10 text-slate-300 border border-white/5 rounded-bl-sm whitespace-pre-wrap font-mono text-[13px] break-words"
              )}>
                {msg.content || (msg.role === 'ai' && <span className="animate-pulse text-slate-500">...</span>)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-transparent shrink-0 pb-6">
        <form onSubmit={onSubmit} className="relative max-w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell AI what to build..."
            disabled={isStreaming || !sandboxId}
            className="w-full bg-white/5 border border-white/10 text-slate-200 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:border-white/20 disabled:opacity-50 transition-colors placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming || !sandboxId}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-200 hover:bg-white text-black rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <ArrowUp className="w-4 h-4 text-black" strokeWidth={2.5} />}
          </button>
        </form>
      </div>
    </div>
  );
}
