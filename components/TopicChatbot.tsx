
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Sparkles, Loader2, ChevronDown } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, Topic } from '../types';
import { useParams } from 'react-router-dom';

interface TopicChatbotProps {
  topicName: string;
  isDarkMode: boolean;
}

const TopicChatbot: React.FC<TopicChatbotProps> = ({ topicName, isDarkMode }) => {
  const { topicId } = useParams<{ topicId: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: `Hello! I am Curious Fox 🦊, your ${topicName} expert. How can I help you master this algorithm today?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    
    const newUserMsg: ChatMessage = { role: 'user', content: userMsg, timestamp: Date.now() };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const apiHistory = updatedMessages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const recentHistory = apiHistory.slice(-10, -1);
      const responseText = await sendMessageToGemini(userMsg, recentHistory, topicId || 'kmeans');
      
      setMessages(prev => [...prev, {
        role: 'model',
        content: responseText || "I'm sorry, I'm having trouble processing that right now.",
        timestamp: Date.now()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        content: "I encountered an error connecting to my knowledge base. Please try again later.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    // Basic cleaning to ensure no stray markdown symbols if the model forgets
    const cleanContent = content.replace(/[#*]/g, '');

    return cleanContent.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={i} className="h-2" />;

      if (trimmedLine.startsWith('📌 Takeaway:')) {
        return (
          <div key={i} className="mt-3 p-3 bg-orange-500/10 border-l-4 border-orange-500 text-orange-200 text-xs italic font-medium rounded-r-xl">
            {trimmedLine}
          </div>
        );
      }
      
      if (trimmedLine.startsWith('-')) {
        return (
          <div key={i} className="flex gap-2 ml-1 mb-1 opacity-90 text-sm">
            <span className="text-orange-500">•</span>
            <span>{trimmedLine.substring(1).trim()}</span>
          </div>
        );
      }

      return <p key={i} className="mb-2 last:mb-0 text-sm leading-relaxed">{trimmedLine}</p>;
    });
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-orange-500 text-white shadow-2xl z-[60] flex items-center justify-center orange-glow overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <ChevronDown size={32} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
              <MessageSquare size={32} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                 <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
            className={`fixed bottom-28 right-8 w-[380px] h-[580px] max-w-[calc(100vw-40px)] z-[60] glass-card rounded-[2.5rem] shadow-2xl flex flex-col border border-white/20 overflow-hidden ${
              isDarkMode ? 'bg-black/90' : 'bg-white/95'
            }`}
          >
            <div className="p-6 bg-orange-500 flex items-center justify-between text-white shadow-lg shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest">Dr. Fox 🦊</h3>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">AI Companion</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles size={14} />
                    </div>
                  )}
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-orange-500 text-white rounded-tr-none' 
                      : `${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-orange-50 border border-orange-100 text-slate-800'} rounded-tl-none shadow-md`
                  }`}>
                    {renderMessageContent(msg.content)}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-orange-500 flex items-center justify-center shrink-0 mt-1">
                      <User size={14} />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                    <Loader2 className="animate-spin" size={14} />
                  </div>
                  <div className={`p-4 rounded-2xl rounded-tl-none ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-orange-50'} shadow-md`}>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-black/40">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question about PCA..."
                  className={`flex-grow bg-transparent border-2 ${
                    isDarkMode ? 'border-white/10 focus:border-orange-500' : 'border-orange-100 focus:border-orange-500'
                  } rounded-2xl px-5 py-3 text-sm outline-none transition-all placeholder:opacity-40`}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-30 disabled:grayscale"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[8px] text-center mt-3 font-black uppercase opacity-20 tracking-[0.2em]">
                Secure Neural Link Active
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopicChatbot;
