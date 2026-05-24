import { useContext, useCallback } from 'react';
import { ChatContext } from '../store/chat.context.jsx';
import { invokeAI } from '../services/ai.api.js';

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");

  const { setMessages, setIsStreaming, setError, messages, ...state } = context;

  const handleSendMessage = useCallback(async (content, projectId) => {
    const userMsg = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);

    const aiMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '' }]);

    setIsStreaming(true);
    setError(null);
    try {
      await invokeAI(content, projectId, (logChunk) => {
        setMessages(prev => prev.map(msg => {
          if (msg.id === aiMsgId) {
            return { ...msg, content: msg.content + logChunk };
          }
          return msg;
        }));
      });
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setIsStreaming(false);
    }
  }, [setMessages, setIsStreaming, setError]);

  return {
    ...state,
    messages,
    handleSendMessage
  };
}
