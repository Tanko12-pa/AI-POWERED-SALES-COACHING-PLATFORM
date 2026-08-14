import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Play,
  Code,
  BookOpen,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  Zap,
  Tag
} from 'lucide-react';
import { ActionTutoringItem } from './ActionPanel';

interface ActionTutorialOverlayProps {
  action: ActionTutoringItem | null;
  onClose: () => void;
  onRunAction: (id: string) => void;
  isLoading?: boolean;
}

export const ActionTutorialOverlay: React.FC<ActionTutorialOverlayProps> = ({
  action,
  onClose,
  onRunAction,
  isLoading = false
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'script' | 'output' | 'learning'>('prompt');

  if (!action) return null;

  const IconComponent = action.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(action.structuredOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Slide-out Side Panel */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l-2 border-[#A8C66C] flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-[#F3F8EA] dark:bg-slate-800/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#800000] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <IconComponent className="w-6 h-6 text-[#A8C66C]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#800000] text-white px-2 py-0.5 rounded-full">
                  Action Module #{action.number}
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Info className="w-3 h-3 text-[#A8C66C]" /> Action Tutorial Guide
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">
                {action.label}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
            title="Close Tutorial Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Section Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 pt-2 gap-1 overflow-x-auto text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'prompt'
                ? 'border-[#800000] text-[#800000] dark:text-red-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#A8C66C]" />
            Tutoring Prompt
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'script'
                ? 'border-[#800000] text-[#800000] dark:text-red-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-[#A8C66C]" />
            Operational Script
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'output'
                ? 'border-[#800000] text-[#800000] dark:text-red-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-[#A8C66C]" />
            Structured Output
          </button>
          <button
            onClick={() => setActiveTab('learning')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'learning'
                ? 'border-[#800000] text-[#800000] dark:text-red-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#A8C66C]" />
            Learning Links
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* TAB 1: TUTORING PROMPT */}
          {(activeTab === 'prompt' || activeTab === undefined) && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-[#F3F8EA] dark:bg-slate-800/90 border-2 border-[#A8C66C] shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-[#800000] dark:text-red-400" />
                  <h4 className="font-extrabold text-[#800000] dark:text-red-400 text-sm uppercase tracking-wider">
                    Tutoring Concept & AI Architecture
                  </h4>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {action.tutoringPrompt}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#A8C66C]" /> Key Educational Takeaways
                </h5>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A8C66C] shrink-0 mt-0.5" />
                    <span><strong>Grounding Context:</strong> Uses Gemini 3.6 Flash to anchor responses in live CRM data, calendar meetings, and sales playbooks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A8C66C] shrink-0 mt-0.5" />
                    <span><strong>Predictable Contracts:</strong> Outputs rigid JSON schemas so frontends render structured action items seamlessly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A8C66C] shrink-0 mt-0.5" />
                    <span><strong>Workflow Automation:</strong> Bridges conversational AI with real operational sales workflows.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: OPERATIONAL SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <span className="text-xs font-extrabold text-[#A8C66C] uppercase tracking-wider flex items-center gap-1.5">
                    <Play className="w-4 h-4" /> Operational Script Specification
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    Exec: Gemini 3.6
                  </span>
                </div>

                <p className="text-sm font-bold text-emerald-300 mb-3">
                  "{action.operationalScriptTitle}"
                </p>

                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Execution Pipeline Steps:
                  </span>
                  <ol className="space-y-2">
                    {action.operationalScriptSteps.map((step, idx) => (
                      <li key={idx} className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center gap-3 text-xs text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-[#800000] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STRUCTURED OUTPUT */}
          {activeTab === 'output' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 shadow-xs font-mono">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#A8C66C]">
                    <Code className="w-4 h-4" /> JSON Schema Interface
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-sans text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
                  </button>
                </div>

                <pre className="p-3 bg-slate-900 rounded-lg text-xs text-emerald-300 overflow-x-auto leading-relaxed border border-slate-800">
                  {action.structuredOutput}
                </pre>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F3F8EA] dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-[#A8C66C]">
                <strong className="text-[#800000] dark:text-red-400 block mb-1">
                  Why Structured Output Matters
                </strong>
                By requiring Gemini to return data matching this exact JSON structure, the application UI can render tables, cards, metrics, and action buttons without risk of parsing failures or unpredictable markdown formatting.
              </div>
            </div>
          )}

          {/* TAB 4: LEARNING LINKS */}
          {activeTab === 'learning' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Architectural Topics & Learning Documentation
              </h4>

              {action.learningLinks && action.learningLinks.length > 0 ? (
                action.learningLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-[#A8C66C] transition-all space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#800000] dark:text-red-400 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#A8C66C]" /> {link.name}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F3F8EA] text-[#8BA854] dark:bg-slate-900 dark:text-[#A8C66C] border border-[#A8C66C]">
                        {link.topic}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No learning links assigned for this module.</p>
              )}
            </div>
          )}

          {/* Bottom All-In-One Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A8C66C]" /> Full Tutoring Contents Summary
            </h5>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <p><strong>Script:</strong> {action.operationalScriptTitle}</p>
              <p><strong>Steps Count:</strong> {action.operationalScriptSteps.length} automated steps</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>

          <button
            onClick={() => {
              onRunAction(action.id);
              onClose();
            }}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#800000] text-white hover:bg-[#600000] transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#A8C66C]" />
            <span>{isLoading ? 'Executing...' : `Run ${action.label}`}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
