import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { sendChatMessage } from '../api/groqClient';
import { motion } from 'framer-motion';

const ChatPanel = () => {
  const { chatMessages, addChatMessage, apiKey, settings, getRecentTranscript } = useAppStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading || !apiKey) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    
    addChatMessage(userMessage);
    setInput('');
    setIsLoading(true);
    
    try {
      const messages = [...chatMessages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      const transcript = getRecentTranscript(settings.chatContextWindow);
      
      const response = await sendChatMessage(
        messages,
        transcript,
        apiKey,
        settings.chatPrompt
      );
      
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Chat failed:', error);
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.response?.data?.message || error.message || 'Failed to send message'}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-dark-panel">
      <div className="p-4 border-b border-dark-border">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm text-center">Click a suggestion or ask anything</p>
            <p className="text-xs mt-1 text-center">about your conversation</p>
          </div>
        )}
        
        {chatMessages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-accent-primary text-white'
                  : 'bg-dark-bg text-gray-200'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-dark-bg rounded-lg p-3">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 bg-gray-500 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="p-4 border-t border-dark-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about the conversation..."
            disabled={isLoading || !apiKey}
            className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-accent-primary disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !apiKey}
            className="px-4 py-2 bg-accent-primary hover:bg-accent-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-600 text-center">
          Powered by Groq
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
