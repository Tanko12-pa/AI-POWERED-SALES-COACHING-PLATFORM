import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, User, BookOpen } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatbotDrawerProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  messages,
  onSendMessage,
  onClose,
  isLoading
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col no-print">
      {/* Drawer Header */}
      <div className="p-4 bg-[#800000] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#A8C66C]" />
          <div>
            <h3 className="text-sm font-bold">Gemini AI Sales Coach</h3>
            <p className="text-[10px] text-[#A8C66C] font-semibold">Grounded in Playbooks & CRM</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
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
              className={`max-w-[80%] p-3 rounded-xl ${
                m.sender === 'user'
                  ? 'bg-[#800000] text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2 pt-1 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#A8C66C]" />
                  <span>Sources: {m.sources.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2 bg-white rounded border border-slate-200">
            <Sparkles className="w-4 h-4 text-[#A8C66C] animate-spin" />
            <span>Gemini AI is evaluating playbook sources...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask sales coaching advice or playbook rules..."
          className="flex-1 text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#A8C66C]"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 bg-[#800000] text-white rounded-lg hover:bg-[#600000] disabled:opacity-50"
        >
          <Send className="w-4 h-4 text-[#A8C66C]" />
        </button>
      </form>
    </div>
  );
};
