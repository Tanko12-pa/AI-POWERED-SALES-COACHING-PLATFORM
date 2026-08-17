import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, User, BookOpen } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatbotDrawerProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
  isLoading: boolean;
  isDarkMode?: boolean;
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  messages,
  onSendMessage,
  onClose,
  isLoading,
  isDarkMode = false
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-96 shadow-2xl border-l z-50 flex flex-col no-print transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Drawer Header */}
      <div className="p-4 bg-[#800000] text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#A8C66C]" />
          <div>
            <h3 className="text-sm font-bold">Gemini AI Sales Coach</h3>
            <p className="text-[10px] text-[#A8C66C] font-semibold">Grounded in Playbooks & CRM</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className={`flex-1 p-4 overflow-y-auto space-y-3 transition-colors ${
        isDarkMode ? 'bg-slate-950/70' : 'bg-slate-50'
      }`}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 text-xs ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'user' ? 'bg-[#800000] text-white' : 'bg-[#A8C66C] text-white'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[80%] p-3 rounded-xl transition-colors ${
                m.sender === 'user'
                  ? 'bg-[#800000] text-white rounded-tr-none'
                  : isDarkMode
                    ? 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              {m.sources && m.sources.length > 0 && (
                <div className={`mt-2 pt-1 border-t text-[10px] flex items-center gap-1 ${
                  isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-400'
                }`}>
                  <BookOpen className="w-3 h-3 text-[#A8C66C]" />
                  <span>Sources: {m.sources.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className={`flex items-center gap-2 text-xs italic p-2 rounded border transition-colors ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <Sparkles className="w-4 h-4 text-[#A8C66C] animate-spin" />
            <span>Gemini AI is evaluating playbook sources...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className={`p-3 border-t flex items-center gap-2 transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask sales coaching advice or playbook rules..."
          className={`flex-1 text-xs p-2.5 border rounded-lg focus:outline-none focus:border-[#A8C66C] transition-colors ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
          }`}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 bg-[#800000] text-white rounded-lg hover:bg-[#600000] disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4 text-[#A8C66C]" />
        </button>
      </form>
    </div>
  );
};
