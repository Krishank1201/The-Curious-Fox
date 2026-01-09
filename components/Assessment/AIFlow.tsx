
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { DR_FOX_PROMPT } from '../../services/assessmentService';
import { LEARNING_PROFILES } from '../../constants/assessmentData';
import { ArrowLeft, Send, Sparkles, User, BrainCircuit } from 'lucide-react';
import { AssessmentResult, ChatMessage } from '../../types';

// Helper for exponential backoff on 429s
async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 2000): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      const isRateLimit = error?.message?.includes('429') || error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED');
      if (isRateLimit && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.warn(`Assessment Flow: Rate limit hit. Retrying in ${delay}ms (Attempt ${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Maximum retries reached for AI request.");
}

// Fixed: Added the missing interface AIFlowProps required for the component
interface AIFlowProps {
  onBack: () => void;
  onComplete: (result: AssessmentResult) => void;
  isDarkMode: boolean;
}

const AIFlow: React.FC<AIFlowProps> = ({ onBack, onComplete, isDarkMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingFinal, setIsProcessingFinal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startConversation = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const responseText = await callWithRetry(async () => {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: "Start the assessment conversation as Dr. Fox. Ask one opening question about how the user likes to learn.",
          config: { systemInstruction: DR_FOX_PROMPT }
        });
        return response.text;
      });
      
      setMessages([{ role: 'model', content: responseText || "Hello! Ready to begin?", timestamp: Date.now() }]);
    } catch (e) {
      console.error(e);
      setMessages([{ role: 'model', content: "Dr. Fox is currently busy with another student (Rate limit reached). Please try again in a few moments.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userText, timestamp: Date.now() }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const aiText = await callWithRetry(async () => {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: newMessages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
          config: { systemInstruction: DR_FOX_PROMPT }
        });
        return response.text || "";
      });
      
      const jsonMatch = aiText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        try {
          const resultData = JSON.parse(jsonMatch[1]);
          if (resultData.isComplete) {
            setIsProcessingFinal(true);
            const finalResult: AssessmentResult = {
              id: Math.random().toString(36).substr(2, 9),
              type: 'ai',
              scores: resultData.assessment.scores,
              profileCode: resultData.assessment.profileCode,
              profileLabel: LEARNING_PROFILES[resultData.assessment.profileCode]?.label || "Balanced Learner",
              profileDescription: LEARNING_PROFILES[resultData.assessment.profileCode]?.description || "",
              recommendations: LEARNING_PROFILES[resultData.assessment.profileCode]?.recommendations || [],
              contextInsights: resultData.assessment.contextInsights || [],
              timestamp: Date.now()
            };
            setTimeout(() => onComplete(finalResult), 1500);
            return;
          }
        } catch (e) {
          console.error("Failed to parse AI result JSON", e);
        }
      }

      setMessages(prev => [...prev, { role: 'model', content: aiText.replace(/```json[\s\S]*?```/g, '').trim(), timestamp: Date.now() }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', content: "My cognitive cores are slightly overloaded. Let's pause for a moment and then try continuing our conversation.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[75vh] flex flex-col glass-card rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
      <div className="absolute inset-0 bg-orange-500/5 pointer-events-none"></div>
      
      {/* Header */}
      <div className="p-8 border-b border-white/10 flex items-center justify-between relative z-10 bg-black/20 backdrop-blur-md">
        <button onClick={onBack} className="text-orange-500 font-bold flex items-center gap-2 hover:gap-3 transition-all">
          <ArrowLeft size={18} /> Exit Chat
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
             <div className="font-black text-orange-500">Dr. Fox</div>
             <div className="text-[10px] uppercase font-bold opacity-40">AI Specialist</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
             <BrainCircuit />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-8 space-y-6 relative z-10">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-6 rounded-[2rem] text-lg font-medium shadow-xl ${
              msg.role === 'user' 
                ? 'bg-orange-500 text-white rounded-tr-none' 
                : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-2 p-4">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-white/10 relative z-10 bg-black/20">
        {isProcessingFinal ? (
          <div className="flex flex-col items-center justify-center gap-4 py-4">
             <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
             <div className="font-black text-orange-500 animate-pulse">Finalizing Your Learning Profile...</div>
          </div>
        ) : (
          <div className="flex gap-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tell Dr. Fox about your learning journey..."
              className="flex-grow px-8 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 outline-none transition-all font-medium text-lg"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
            >
              <Send size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFlow;
