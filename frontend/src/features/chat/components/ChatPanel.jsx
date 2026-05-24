import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden backdrop-blur-sm">
      <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/80 shrink-0">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          AI Agent
        </h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <Bot className="w-12 h-12 opacity-20" />
            <p className="text-sm text-center">I'm ready to code. <br/>What are we building today?</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg.id || idx} className={cn("flex gap-3 text-sm", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-slate-700 text-slate-300" : "bg-purple-600/20 text-purple-400 border border-purple-500/20"
              )}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={cn(
                "max-w-[85%] rounded-xl px-4 py-2.5",
                msg.role === 'user' 
                  ? "bg-slate-700 text-slate-100 rounded-tr-sm" 
                  : "bg-slate-800/80 text-slate-300 rounded-tl-sm border border-slate-700/50 whitespace-pre-wrap font-mono text-[13px] break-words"
              )}>
                {msg.content || (msg.role === 'ai' && <span className="animate-pulse text-purple-400">...</span>)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-900/80 border-t border-slate-800/80 shrink-0">
        <form onSubmit={onSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message AI..."
            disabled={isStreaming || !sandboxId}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming || !sandboxId}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
