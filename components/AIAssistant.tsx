
import React, { useState, useRef, useEffect } from 'react';
import { getTaxGuidance } from '../services/aiService';
import { ChatMessage, UserProfile } from '../types';

interface AIAssistantProps {
  profile: UserProfile | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: profile?.preferredLanguage === 'pidgin' 
        ? 'How far! My name na Skujy, your Groq-powered TaxAssistant. Wetin you wan know about dis 2025 Tax Act?' 
        : 'Hello! I am Skujy, your Groq-powered TaxGuide NG Assistant. How can I help you navigate the 2025 Tax Act today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const response = await getTaxGuidance(currentInput, messages, profile);
    setMessages(prev => [...prev, { role: 'model', text: response || '' }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[75vh] max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-bold text-white relative">
            S
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-300 border-2 border-slate-900 rounded-full animate-pulse"></span>
          </div>
          <div>
            <h3 className="font-bold text-lg">Skujy</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Groq Powered • 2025 Act Expert
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-medium hidden sm:block">
          {profile?.preferredLanguage === 'pidgin' ? 'Active Mode: Pidgin' : 'Active Mode: English'}
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-50/50"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={profile?.preferredLanguage === 'pidgin' ? "Talk to Skujy about your tax..." : "Ask Skujy anything about the 2025 Act..."}
            className="w-full pl-6 pr-14 py-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center hover:bg-orange-700 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
