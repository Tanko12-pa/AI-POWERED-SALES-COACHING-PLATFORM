import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Zap,
  Code2,
  Mic,
  Globe,
  ExternalLink,
  ArrowRight,
  Layers,
  Check,
  CheckCircle2,
  BookOpen,
  Database,
  Calendar,
  Send,
  HelpCircle
} from 'lucide-react';

export const CoachingEfficiencyGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'rag' | 'tools' | 'json' | 'audio' | 'search'>('all');
  const [copiedLinkIndex, setCopiedLinkIndex] = useState<number | null>(null);

  const capabilities = [
    {
      id: 'rag',
      title: 'File Search (RAG Grounding)',
      badge: 'Vector RAG Grounding',
      icon: Database,
      pricing: 'Free storage & query embedding (~$0.15 / 1M tokens at indexing)',
      summary: 'This is what keeps coaching from being generic.',
      description: 'It indexes your playbooks, rubrics, and battlecards into a managed vector store, and Gemini retrieves the relevant chunk at query time rather than you stuffing the whole playbook into every prompt.',
      keyDifference: 'This is the difference between "good coaching advice" and "coaching advice that cites your MEDDIC rubric §4.2."',
      docUrl: 'https://ai.google.dev/gemini-api/docs/file-search',
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
    },
    {
      id: 'tools',
      title: 'Function Calling',
      badge: 'Action & System Execution',
      icon: Zap,
      pricing: 'Native multi-tool execution with Gemini 3 Thought Signatures',
      summary: 'This is what makes the platform act instead of just talk.',
      description: 'Gemini decides when a request needs a real system call (log to Salesforce, pull calendar events, check deal risk) and emits structured arguments; your app executes it.',
      keyDifference: 'Gemini 3-series models added "thought signatures" that improve multi-turn reliability here, so a coaching session that spans several tool calls (fetch deal → score call → log activity → create follow-up) stays coherent.',
      docUrl: 'https://ai.google.dev/gemini-api/docs/function-calling',
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/40 text-blue-600 dark:text-blue-400'
    },
    {
      id: 'json',
      title: 'Structured Output',
      badge: 'Consistent Dashboard-Ready JSON',
      icon: Code2,
      pricing: 'Combined Single-Pass Calling in Gemini 3',
      summary: 'This is what makes coaching consistent across reps and weeks.',
      description: 'You define the JSON schema once (score, category breakdown, risk level) and every session returns the same shape, ready to drop into a dashboard or export.',
      keyDifference: 'Gemini 3 models can combine this with File Search and Function Calling in a single call now, so scoring + grounding + logging happens in one pass.',
      docUrl: 'https://ai.google.dev/gemini-api/docs/structured-output',
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'audio',
      title: 'Audio Understanding (Multimodal Input)',
      badge: 'Multimodal Audio Processing',
      icon: Mic,
      pricing: 'Zero Manual Typing Required',
      summary: "Reps don't have to transcribe calls by hand.",
      description: 'You can upload the raw call recording (mp3/wav) directly and Gemini will transcribe, summarize, detect tone, and even pull timestamped segments — which then feeds straight into the coaching-score prompt.',
      keyDifference: 'This is a real efficiency unlock for "Run Sales Coaching Session": paste a transcript or just upload the recording.',
      docUrl: 'https://ai.google.dev/gemini-api/docs/audio',
      color: 'from-[#800000]/20 to-red-600/10 border-[#800000]/40 text-[#800000] dark:text-red-400'
    },
    {
      id: 'search',
      title: 'Grounding with Google Search',
      badge: 'Situational Account Context',
      icon: Globe,
      pricing: 'Optional, Situational Account Research',
      summary: 'Useful for account-context enrichment before a coaching session or call-prep.',
      description: "Retrieves live company updates, press releases, and executive leadership changes (e.g., \"what's changed at this prospect's company recently\").",
      keyDifference: "Note: Gemini currently doesn't let you combine Google Search grounding with function calling in the same call, so if you use this, keep it in a separate \"account research\" step rather than inside the main coaching prompt.",
      docUrl: 'https://ai.google.dev/gemini-api/docs/google-search',
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/40 text-purple-600 dark:text-purple-400'
    }
  ];

  const workflowSteps = [
    {
      step: '1. Upload Call Recording',
      description: 'Rep uploads a call recording instead of typing notes',
      capability: 'Audio Understanding',
      actionTrigger: 'Multimodal transcript & tone extraction',
      icon: Mic,
      color: 'bg-red-100 text-[#800000] border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900'
    },
    {
      step: '2. Playbook Grounding',
      description: 'Coaching draws on your actual rubric, not generic advice',
      capability: 'File Search (RAG)',
      actionTrigger: 'Vector store retrieval (MEDDIC rubric §4.2)',
      icon: Database,
      color: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900'
    },
    {
      step: '3. Fetch Deal Stage',
      description: 'Pulls the live deal stage before scoring',
      capability: 'Function Calling',
      actionTrigger: 'fetch_deal_record(opportunityId)',
      icon: Zap,
      color: 'bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900'
    },
    {
      step: '4. Consistent Scoring',
      description: 'Returns the same score fields every time, dashboard-ready',
      capability: 'Structured Output',
      actionTrigger: 'JSON Schema Validation (Scorecard & Categories)',
      icon: Code2,
      color: 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900'
    },
    {
      step: '5. Auto CRM & Follow-Up',
      description: 'Logs the outcome and books the follow-up automatically',
      capability: 'Function Calling',
      actionTrigger: 'log_activity_to_crm & create_calendar_followup',
      icon: Send,
      color: 'bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900'
    }
  ];

  const filteredCapabilities = activeTab === 'all' 
    ? capabilities 
    : capabilities.filter(c => c.id === activeTab);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#800000] to-slate-900 text-white space-y-2.5 shadow-md border border-[#A8C66C]/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#A8C66C] text-[#800000] font-black shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#A8C66C] block">
                Google AI Studio / Gemini Integration Architecture
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Synthesized Platform Capabilities into Structured Coaching Efficiency Guide
              </h3>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#A8C66C] text-xs font-bold">
            Gemini 3-Series Native Stack
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-4xl pt-1">
          Here's how each native Google AI Studio / Gemini capability maps onto making the Sales Coaching action efficient — not just "available," but actually doing the heavy lifting so the rep isn't typing everything by hand.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mr-1">
          Filter Capability:
        </span>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#800000] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          All 5 Capabilities
        </button>
        {capabilities.map(cap => (
          <button
            key={cap.id}
            onClick={() => setActiveTab(cap.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === cap.id
                ? 'bg-[#800000] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <cap.icon className="w-3.5 h-3.5 text-[#A8C66C]" />
            <span>{cap.title.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Grid of Platform Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCapabilities.map((cap, idx) => (
          <div
            key={cap.id}
            className={`p-5 rounded-2xl bg-gradient-to-br ${cap.color} border shadow-xs space-y-3 flex flex-col justify-between`}
          >
            <div className="space-y-2.5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs shrink-0">
                    <cap.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                      {cap.title}
                    </h4>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-800/80 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                      {cap.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs font-black text-slate-900 dark:text-slate-100">
                {cap.summary}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {cap.description}
              </p>

              {/* Key Difference Highlight */}
              <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#800000] dark:text-red-400 block">
                  Efficiency Unlock & Impact:
                </span>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 italic">
                  "{cap.keyDifference}"
                </p>
              </div>
            </div>

            {/* Footer with Pricing / Note and Official Docs Link */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
                {cap.pricing}
              </span>

              <a
                href={cap.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#800000] text-white hover:bg-[#600000] font-extrabold text-[11px] transition-all shrink-0 shadow-2xs"
              >
                <span>Docs</span>
                <ExternalLink className="w-3 h-3 text-[#A8C66C]" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Concrete Efficiency Stack Workflow Table / Process Flow */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#800000] text-[#A8C66C]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                How They Stack for Efficiency, Concretely
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                End-to-end sales coaching session execution mapped to native Gemini tools
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-[#F3F8EA] text-[#800000] font-extrabold text-xs border border-[#A8C66C]">
            Single-Pass Execution
          </span>
        </div>

        {/* Table View for Desktop / Card Grid for Mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <th className="py-2.5 px-3">Step in a Coaching Session</th>
                <th className="py-2.5 px-3">Tool Doing the Work</th>
                <th className="py-2.5 px-3">System Action Triggered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-700/80 font-medium">
              {workflowSteps.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border shrink-0 ${s.color}`}>
                        <s.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100 block">{s.step}</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{s.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-extrabold text-[11px] inline-block">
                      {s.capability}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#800000] dark:text-red-400 font-bold">
                    {s.actionTrigger}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
