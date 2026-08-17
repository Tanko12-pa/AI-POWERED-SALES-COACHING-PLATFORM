import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  BarChart3,
  Megaphone,
  Wand2,
  Target,
  Activity,
  RefreshCw,
  UploadCloud,
  FileSpreadsheet,
  Settings,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Code,
  CheckCircle2,
  ExternalLink,
  X,
  Play,
  Copy,
  Check,
  GraduationCap,
  Search,
  Info,
  Filter
} from 'lucide-react';
import { ActionTutorialOverlay } from './ActionTutorialOverlay';

export interface ActionTutoringItem {
  id: string;
  number: number;
  label: string;
  icon: React.ElementType;
  tutoringPrompt: string;
  operationalScriptTitle: string;
  operationalScriptSteps: string[];
  structuredOutput: string;
  learningLinks?: { name: string; description: string; topic: string }[];
  tags?: string[];
}

export const TUTORING_ACTIONS: ActionTutoringItem[] = [
  {
    id: 'coaching',
    number: 1,
    label: 'Run Sales Coaching Session',
    icon: Sparkles,
    tags: ['Coaching', 'CRM', 'Playbooks', 'AI', 'Analysis'],
    tutoringPrompt:
      'You are learning how an AI-powered coaching session works. A coaching session analyzes your CRM records, calendar events, Slack/text conversations, and sales playbooks to produce actionable insights. Gemini 3.6 Flash uses File Search to ground its coaching in your uploaded playbooks, ensuring recommendations match your company’s sales methodology. The goal is to help you manage time, improve deal momentum, and follow best practices.',
    operationalScriptTitle: 'Run a full sales coaching session.',
    operationalScriptSteps: [
      'Fetch CRM opportunities',
      'Fetch calendar events',
      'Fetch Slack/text threads',
      'Search sales playbooks for relevant sections',
      'Produce coaching insights grounded in playbooks',
      'Return structured output'
    ],
    structuredOutput: `{
  "summary": "",
  "priority_actions": [],
  "risk_deals": [],
  "time_management_score": 0,
  "playbook_refs": [],
  "next_best_steps": []
}`,
    learningLinks: [
      { name: 'Gemini Function Calling', topic: 'Function Calling', description: 'Enables Gemini to call backend APIs to retrieve live CRM records and calendar data dynamically.' },
      { name: 'File Search', topic: 'Grounding', description: 'Indexes company sales playbooks so coaching advice strictly adheres to internal methodology.' },
      { name: 'Structured Output', topic: 'JSON Schema', description: 'Enforces strictly formatted JSON schemas for predictable frontend UI rendering.' }
    ]
  },
  {
    id: 'analyze',
    number: 2,
    label: 'Analyze Today’s Sales Activity',
    icon: BarChart3,
    tags: ['CRM', 'Reporting', 'Analytics', 'Activity', 'Slack'],
    tutoringPrompt:
      'This feature teaches you how daily activity analysis works. Gemini 3.6 Flash reviews your meetings, emails, Slack threads, and CRM updates. It identifies missed follow-ups, bottlenecks, and time drains. Playbooks are used to evaluate whether your actions match recommended sales behaviors.',
    operationalScriptTitle: 'Analyze today’s sales activity using CRM, calendar, Slack, and playbooks.',
    operationalScriptSteps: [
      'Parse today’s calendar meetings and duration',
      'Inspect email & Slack thread timestamps for response delays',
      'Compare activities against playbook milestone SLAs',
      'Identify bottlenecks and missed follow-ups',
      'Formulate immediate high-priority recovery steps'
    ],
    structuredOutput: `{
  "activity_summary": "",
  "meetings": [],
  "emails": [],
  "slack_threads": [],
  "missed_followups": [],
  "bottlenecks": [],
  "recommended_actions": []
}`,
    learningLinks: [
      { name: 'Activity Analysis Pattern', topic: 'Telemetry', description: 'How AI aggregates multi-channel sales communication streams into a single timeline.' },
      { name: 'SLA Evaluation', topic: 'Sales Operations', description: 'Automated evaluation of follow-up speed against target SLA boundaries.' }
    ]
  },
  {
    id: 'generate_copy',
    number: 3,
    label: 'Generate High-Performing Marketing Copy',
    icon: Megaphone,
    tags: ['Marketing', 'Copywriting', 'Campaign', 'Generation'],
    tutoringPrompt:
      'This module teaches how AI generates high-performing marketing copy. Gemini 3.6 Flash uses natural language generation to create multiple variants tailored to industries like retail, travel, health, finance, and e-commerce. You’ll learn how tone, structure, and emotional triggers affect conversion.',
    operationalScriptTitle: 'Generate multiple marketing copy variants tailored to the target industry and persona.',
    operationalScriptSteps: [
      'Analyze target industry characteristics and buyer persona pain points',
      'Apply persuasive copywriting frameworks (PAS, AIDA)',
      'Generate headline, body, and CTA variants',
      'Provide tone guidelines and A/B test suggestions'
    ],
    structuredOutput: `{
  "variants": [],
  "tone_guidelines": "",
  "ab_test_plan": "",
  "optimization_notes": ""
}`,
    learningLinks: [
      { name: 'Natural Language Generation', topic: 'LLM Copywriting', description: 'Techniques for controlling tone, length, and call-to-action urgency in generated variants.' },
      { name: 'A/B Testing Methodology', topic: 'CRO', description: 'Designing controlled variant tests to determine top-performing headline angles.' }
    ]
  },
  {
    id: 'optimize_copy',
    number: 4,
    label: 'Optimize Existing Campaign Copy',
    icon: Wand2,
    tags: ['Marketing', 'Optimization', 'Copywriting', 'Conversion'],
    tutoringPrompt:
      'This teaches how AI improves existing marketing copy. Gemini 3.6 Flash evaluates clarity, persuasion, tone, and conversion potential. You’ll learn how small changes in wording can dramatically improve performance.',
    operationalScriptTitle: 'Optimize the provided marketing copy. Produce improved variants, readability scores, and conversion insights.',
    operationalScriptSteps: [
      'Evaluate source copy readability and clarity',
      'Identify weak value propositions or jargon barriers',
      'Rewrite variants focusing on benefit-driven outcomes',
      'Calculate expected conversion boost and readability index'
    ],
    structuredOutput: `{
  "original_copy": "",
  "optimized_variants": [],
  "readability_score": 0,
  "conversion_boost_estimate": "",
  "ab_test_plan": ""
}`,
    learningLinks: [
      { name: 'Copy Critique Engine', topic: 'Conversion Rate', description: 'Automated linguistic scoring for grade-level readability and emotional resonance.' }
    ]
  },
  {
    id: 'targeting',
    number: 5,
    label: 'Design Data-Driven Audience Targeting Plan',
    icon: Target,
    tags: ['Marketing', 'Audience', 'Targeting', 'Strategy'],
    tutoringPrompt:
      'This module teaches how AI builds audience targeting strategies. Gemini 3.6 Flash analyzes open internet behavior to identify audience segments, channels, placements, and bidding strategies. You’ll learn how data-driven targeting improves reach and reduces cost.',
    operationalScriptTitle: 'Create an audience targeting plan with segments, channels, placements, and bidding strategy.',
    operationalScriptSteps: [
      'Define high-value ICP (Ideal Customer Profile) demographic and firmographic traits',
      'Identify optimal ad network channels and placement inventory',
      'Formulate cost-efficient bidding strategies (tCPA, tROAS)',
      'Produce live campaign optimization tips'
    ],
    structuredOutput: `{
  "segments": [],
  "channels": [],
  "placements": [],
  "bidding_strategy": "",
  "live_optimization_tips": []
}`,
    learningLinks: [
      { name: 'Audience Segmentation', topic: 'AdTech', description: 'Grouping prospects by firmographics, intent signals, and digital footprints.' }
    ]
  },
  {
    id: 'review_campaign',
    number: 6,
    label: 'Review Live Campaign Performance',
    icon: Activity,
    tags: ['Marketing', 'Reporting', 'Campaign', 'Performance', 'Analytics'],
    tutoringPrompt:
      'This teaches how AI evaluates live campaign performance. Gemini 3.6 Flash reviews impressions, clicks, conversions, cost efficiency, and audience behavior. You’ll learn how to interpret performance metrics and optimize campaigns in real time.',
    operationalScriptTitle: 'Review live campaign performance and provide optimization suggestions.',
    operationalScriptSteps: [
      'Ingest impressions, CTR, CPC, and conversion rate metrics',
      'Detect audience fatigue or decaying ad placements',
      'Highlight top-performing ad copy variants',
      'Suggest real-time budget reallocations and bid tweaks'
    ],
    structuredOutput: `{
  "campaign_summary": "",
  "performance_metrics": {},
  "audience_behavior": {},
  "issues_detected": [],
  "recommended_optimizations": []
}`,
    learningLinks: [
      { name: 'Performance Analytics', topic: 'Campaign Optimization', description: 'Real-time detection of CPA spikes, audience saturation, and ad fatigue.' }
    ]
  },
  {
    id: 'sync_crm',
    number: 7,
    label: 'Sync CRM & Calendar Data',
    icon: RefreshCw,
    tags: ['CRM', 'Sync', 'Calendar', 'Integrations'],
    tutoringPrompt:
      'This module teaches how CRM and calendar syncing works. Gemini 3.6 Flash uses function calling to fetch CRM records and calendar events. You’ll learn how syncing ensures coaching insights are accurate and up-to-date.',
    operationalScriptTitle: 'Sync CRM records and calendar events. Identify missing data and propose updates.',
    operationalScriptSteps: [
      'Initiate bidirectional sync with CRM endpoint',
      'Match upcoming calendar meetings with CRM opportunity IDs',
      'Flag missing contact roles or outdated deal stage dates',
      'Propose automated field updates for sales rep approval'
    ],
    structuredOutput: `{
  "crm_records_synced": [],
  "calendar_events_synced": [],
  "missing_data": [],
  "recommended_updates": []
}`,
    learningLinks: [
      { name: 'Gemini Function Calling', topic: 'Bi-directional Sync', description: 'Executing function tools to synchronize remote calendar APIs with database state.' }
    ]
  },
  {
    id: 'upload_docs',
    number: 8,
    label: 'Upload / Refresh Sales Playbooks & Product Docs',
    icon: UploadCloud,
    tags: ['Playbooks', 'RAG', 'File Search', 'Grounding', 'Docs'],
    tutoringPrompt:
      'This teaches how File Search grounding works. Gemini 3.6 Flash indexes your playbooks, product sheets, pricing guides, and objection-handling documents. You’ll learn how grounding ensures coaching advice follows your company’s methodology.',
    operationalScriptTitle: 'Index uploaded documents and tag them by type.',
    operationalScriptSteps: [
      'Parse uploaded PDFs, Markdown, and text files',
      'Generate vector embeddings for semantic document search',
      'Assign document tags (Objection Handling, Pricing, Competitor Matrix)',
      'Mark documents active for File Search grounding'
    ],
    structuredOutput: `{
  "indexed_documents": [],
  "tags": [],
  "status": "complete"
}`,
    learningLinks: [
      { name: 'File Search', topic: 'RAG Architecture', description: 'Retrieval Augmented Generation for vector-grounded enterprise AI responses.' }
    ]
  },
  {
    id: 'export_report',
    number: 9,
    label: 'Export Coaching Report (PDF/CSV)',
    icon: FileSpreadsheet,
    tags: ['Reporting', 'Export', 'PDF', 'CSV', 'Coaching'],
    tutoringPrompt:
      'This module teaches how structured coaching reports are generated. Gemini 3.6 Flash compiles coaching insights, activity analysis, deal risks, and playbook references. You’ll learn how structured data enables clean PDF/CSV export.',
    operationalScriptTitle: 'Generate a structured coaching report summarizing today’s insights.',
    operationalScriptSteps: [
      'Aggregate coaching session outcomes and risk deals',
      'Format data into structured tabular JSON payload',
      'Compile executive summary and playbook reference citations',
      'Trigger browser PDF document rendering and CSV file download'
    ],
    structuredOutput: `{
  "report_title": "",
  "date": "",
  "coaching_summary": "",
  "priority_actions": [],
  "deal_risks": [],
  "time_management_score": 0,
  "playbook_refs": []
}`,
    learningLinks: [
      { name: 'Structured Output', topic: 'Export Engineering', description: 'Generating clean schema outputs for seamless PDF canvas and CSV file rendering.' }
    ]
  },
  {
    id: 'call_scorecard',
    number: 10,
    label: 'Key Sales Coaching Tools - Call QA & Scorecard Analyzer',
    icon: GraduationCap,
    tags: ['MEDDPICC', 'B2B Scorecard', 'QA Analyst', 'Talk-Listen Ratio', 'Evidence Quotes'],
    tutoringPrompt:
      'This tool executes an objective B2B sales call evaluation using expert Enterprise Sales Coach guidelines. Gemini 3.6 Flash evaluates transcripts across Discovery, Value Fit, Objection Handling, Next Steps, Talk-to-Listen ratio, and MEDDPICC criteria with timestamped/quoted evidence.',
    operationalScriptTitle: 'Evaluate B2B sales call transcript against MEDDPICC, BANT, and Value Selling criteria.',
    operationalScriptSteps: [
      'Ingest raw call transcript or audio notes',
      'Evaluate Objectivity based strictly on explicit evidence from transcript',
      'Assess Talk-to-Listen balance (ideal rep share 40-50%)',
      'Evaluate MEDDPICC qualification checklist (Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Implicated Pain, Champion)',
      'Produce Category Scores (0-10) with Strengths, Areas for Improvement, and Evidence Quotes',
      'Formulate Top 3 High-Priority Coaching Action Items'
    ],
    structuredOutput: `{
  "call_summary": "",
  "overall_score": 0,
  "talk_listen_ratio": { "rep_percentage": 0, "prospect_percentage": 0, "assessment": "" },
  "evaluation_categories": [
    { "category_name": "", "score": 0, "strengths": [], "areas_for_improvement": [], "evidence_quotes": [] }
  ],
  "meddpicc_checklist": {
    "metrics_identified": false,
    "economic_buyer_uncovered": false,
    "decision_criteria_clear": false,
    "decision_process_known": false,
    "paper_process_discussed": false,
    "implicated_pain_found": false,
    "champion_identified": false
  },
  "key_action_items": []
}`,
    learningLinks: [
      { name: 'MEDDPICC Framework', topic: 'B2B Sales Methodology', description: 'Enterprise sales qualification framework for high-value B2B opportunities.' },
      { name: 'Talk-Listen Ratio', topic: 'Conversation Intelligence', description: 'Measuring rep conversation share against optimal 40-50% listening benchmark.' },
      { name: 'Structured QA Evaluation', topic: 'JSON Schema', description: 'Strict Response Schema for objective, evidence-grounded performance scorecards.' }
    ]
  },
  {
    id: 'settings',
    number: 10,
    label: 'Settings & Integrations',
    icon: Settings,
    tags: ['Settings', 'Integrations', 'CRM', 'Slack', 'OAuth'],
    tutoringPrompt:
      'This teaches how integrations work. Gemini 3.6 Flash can connect to CRM, calendar, Slack, email, and file storage systems. You’ll learn how integrations improve automation and data accuracy.',
    operationalScriptTitle: 'Display and manage integrations. Provide connection status and recommended settings.',
    operationalScriptSteps: [
      'Inspect authorization tokens and API key connectivity',
      'Validate webhooks for real-time Slack/Text event listeners',
      'Configure auto-sync intervals and notification dispatch rules',
      'Return current status and recommended optimization settings'
    ],
    structuredOutput: `{
  "integrations": [],
  "connection_status": {},
  "recommended_settings": []
}`,
    learningLinks: [
      { name: 'Enterprise Integrations', topic: 'OAuth & Webhooks', description: 'Connecting multi-tenant CRM and messaging platforms securely.' }
    ]
  }
];

interface ActionPanelProps {
  onRunCoaching: () => void;
  onAnalyzeToday: () => void;
  onGenerateCopy: () => void;
  onOptimizeCopy: () => void;
  onDesignTargeting: () => void;
  onReviewPerformance: () => void;
  onSyncCrmCalendar: () => void;
  onUploadDocs: () => void;
  onExportReport: () => void;
  onOpenSettings: () => void;
  loadingAction: string | null;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  onRunCoaching,
  onAnalyzeToday,
  onGenerateCopy,
  onOptimizeCopy,
  onDesignTargeting,
  onReviewPerformance,
  onSyncCrmCalendar,
  onUploadDocs,
  onExportReport,
  onOpenSettings,
  loadingAction
}) => {
  const [selectedTutorialAction, setSelectedTutorialAction] = useState<ActionTutoringItem | null>(null);
  const [expandedAccordionId, setExpandedAccordionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const QUICK_TAGS = ['All', 'Marketing', 'CRM', 'Reporting', 'Coaching', 'Playbooks'];

  const getClickHandler = (id: string) => {
    switch (id) {
      case 'coaching': return onRunCoaching;
      case 'analyze': return onAnalyzeToday;
      case 'generate_copy': return onGenerateCopy;
      case 'optimize_copy': return onOptimizeCopy;
      case 'targeting': return onDesignTargeting;
      case 'review_campaign': return onReviewPerformance;
      case 'sync_crm': return onSyncCrmCalendar;
      case 'upload_docs': return onUploadDocs;
      case 'export_report': return onExportReport;
      case 'settings': return onOpenSettings;
      default: return () => {};
    }
  };

  // Filter actions by searchQuery & selectedTag
  const filteredActions = useMemo(() => {
    return TUTORING_ACTIONS.filter(action => {
      // Filter by category tag
      if (selectedTag !== 'All') {
        const matchesTag = action.tags?.some(t => t.toLowerCase() === selectedTag.toLowerCase());
        if (!matchesTag) return false;
      }

      // Filter by search text query
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase().trim();
      const matchLabel = action.label.toLowerCase().includes(query);
      const matchNumber = action.number.toString().includes(query);
      const matchPrompt = action.tutoringPrompt.toLowerCase().includes(query);
      const matchScript = action.operationalScriptTitle.toLowerCase().includes(query);
      const matchSteps = action.operationalScriptSteps.some(s => s.toLowerCase().includes(query));
      const matchTags = action.tags?.some(t => t.toLowerCase().includes(query));
      const matchLinks = action.learningLinks?.some(l =>
        l.name.toLowerCase().includes(query) ||
        l.topic.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query)
      );

      return matchLabel || matchNumber || matchPrompt || matchScript || matchSteps || matchTags || matchLinks;
    });
  }, [searchQuery, selectedTag]);

  const toggleAccordion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedAccordionId(prev => prev === id ? null : id);
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <aside id="action-panel" className="bg-white dark:bg-slate-900 rounded-xl border-2 border-[#A8C66C] shadow-lg p-4 flex flex-col h-full sticky top-20 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#A8C66C]/40">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#800000] animate-pulse"></div>
          <div>
            <h2 className="text-lg font-black text-[#800000] dark:text-red-400">Action Panel</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Control Center & Interactive AI Tutoring Labs</p>
          </div>
        </div>
        <span className="text-[10px] bg-[#F3F8EA] text-[#8BA854] dark:bg-slate-800 dark:text-[#A8C66C] font-extrabold px-2 py-0.5 rounded-full border border-[#A8C66C]">
          {filteredActions.length} / 10 Actions
        </span>
      </div>

      {/* Accessibility Keyword Search Bar */}
      <div className="space-y-2 mb-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            id="action-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actions ('Marketing', 'CRM', 'Reporting')..."
            className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#800000] dark:focus:border-red-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Tag Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 text-[10px]">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2 py-0.5 rounded-md font-bold transition-all border ${
                selectedTag === tag
                  ? 'bg-[#800000] text-white border-[#800000]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-[#F3F8EA] hover:border-[#A8C66C]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Action List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 max-h-[calc(100vh-280px)]">
        {filteredActions.length > 0 ? (
          filteredActions.map((act) => {
            const IconComponent = act.icon;
            const isLoading = loadingAction === act.id;
            const isExpanded = expandedAccordionId === act.id;
            const runAction = getClickHandler(act.id);

            return (
              <div
                key={act.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-[#800000] dark:border-red-500 bg-[#F3F8EA]/40 dark:bg-slate-800/80 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#A8C66C]'
                }`}
              >
                {/* Button Bar */}
                <div className="p-2.5 flex items-center justify-between gap-1.5">
                  <button
                    id={`action-btn-${act.number}`}
                    onClick={runAction}
                    disabled={loadingAction !== null}
                    title={`Action #${act.number}: ${act.operationalScriptTitle} (${act.tags?.join(', ') || ''}) — Click to run`}
                    className="flex-1 flex items-center gap-2.5 text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-[#800000] dark:hover:text-red-400 transition-colors disabled:opacity-50 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#A8C66C] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <IconComponent className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    </div>
                    <span className="leading-snug">
                      {isLoading ? 'Executing with Gemini...' : `⭐ ${act.number}. ${act.label}`}
                    </span>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Action Tutorial Side-Panel Overlay Trigger (Info Icon) */}
                    <button
                      id={`info-tutorial-btn-${act.number}`}
                      onClick={() => setSelectedTutorialAction(act)}
                      className="p-1.5 rounded-lg text-[#800000] dark:text-red-400 hover:bg-[#F3F8EA] dark:hover:bg-slate-800 border border-[#A8C66C]/60 hover:border-[#A8C66C] transition-all"
                      title={`Open Action Tutorial for Module #${act.number}`}
                    >
                      <Info className="w-3.5 h-3.5 text-[#800000] dark:text-red-400" />
                    </button>

                    {/* Quick Inline Accordion Toggle */}
                    <button
                      onClick={(e) => toggleAccordion(act.id, e)}
                      className={`px-1.5 py-1 rounded-md text-[10px] font-extrabold flex items-center gap-0.5 transition-colors ${
                        isExpanded
                          ? 'bg-[#800000] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#A8C66C] hover:text-white'
                      }`}
                      title="Toggle Inline Tutoring Preview"
                    >
                      <GraduationCap className="w-3 h-3" />
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Inline Accordion Content */}
                {isExpanded && (
                  <div className="p-3 border-t border-[#A8C66C]/40 bg-white dark:bg-slate-900 space-y-3 text-xs">
                    {/* Tutoring Prompt Card */}
                    <div className="p-3 rounded-lg bg-[#F3F8EA] dark:bg-slate-800/90 border border-[#A8C66C] text-slate-800 dark:text-slate-200">
                      <div className="font-extrabold text-[#800000] dark:text-red-400 flex items-center justify-between gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-[#A8C66C]" />
                          Tutoring Prompt
                        </span>
                        <button
                          onClick={() => setSelectedTutorialAction(act)}
                          className="text-[10px] text-[#800000] dark:text-red-400 underline font-bold"
                        >
                          Full Side Panel
                        </button>
                      </div>
                      <p className="text-[11px] leading-relaxed font-medium">
                        {act.tutoringPrompt}
                      </p>
                    </div>

                    {/* Operational Script */}
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-1.5 text-[11px] uppercase tracking-wider">
                        <Play className="w-3 h-3 text-[#A8C66C]" />
                        Operational Script
                      </div>
                      <p className="text-[11px] font-bold text-[#800000] dark:text-red-400 mb-1.5">
                        {act.operationalScriptTitle}
                      </p>
                      <ul className="space-y-1 pl-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {act.operationalScriptSteps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#A8C66C] font-black">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Structured Output Preview */}
                    <div className="p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-[10px] relative">
                      <div className="flex justify-between items-center mb-1 text-slate-400 border-b border-slate-800 pb-1">
                        <span className="flex items-center gap-1 text-[10px]">
                          <Code className="w-3 h-3 text-[#A8C66C]" /> Structured Output (JSON)
                        </span>
                        <button
                          onClick={() => handleCopyCode(act.structuredOutput, act.id)}
                          className="hover:text-white flex items-center gap-0.5 text-[10px]"
                        >
                          {copiedId === act.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedId === act.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="overflow-x-auto text-emerald-300 leading-tight py-1">
                        {act.structuredOutput}
                      </pre>
                    </div>

                    {/* Learning Links */}
                    {act.learningLinks && act.learningLinks.length > 0 && (
                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Learning Links & Architectural Concepts:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {act.learningLinks.map((link, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F3F8EA] dark:bg-slate-800 text-[#800000] dark:text-red-400 border border-[#A8C66C] flex items-center gap-1"
                              title={link.description}
                            >
                              <BookOpen className="w-2.5 h-2.5 text-[#A8C66C]" />
                              {link.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Direct Launch Button inside Drawer */}
                    <button
                      onClick={runAction}
                      disabled={loadingAction !== null}
                      className="w-full py-2 rounded-lg font-bold text-xs bg-[#800000] text-white hover:bg-[#600000] disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#A8C66C]" />
                      <span>Run {act.label} Now</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="font-bold text-slate-700 dark:text-slate-300">No matching action buttons found</p>
            <p className="text-[11px]">Try searching for 'Marketing', 'CRM', 'Reporting', or 'Playbooks'</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('All');
              }}
              className="mt-2 px-3 py-1 rounded bg-[#800000] text-white font-bold text-[11px]"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-center shrink-0">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 font-semibold">
          <span>Grounded in Sales Playbooks</span>
          <span>•</span>
          <span className="text-[#800000] dark:text-red-400 font-bold">Gemini 3.6 Flash AI</span>
        </p>
      </div>

      {/* Action Tutorial Side-Panel Overlay */}
      {selectedTutorialAction && (
        <ActionTutorialOverlay
          action={selectedTutorialAction}
          onClose={() => setSelectedTutorialAction(null)}
          onRunAction={(id) => {
            const run = getClickHandler(id);
            run();
          }}
          isLoading={loadingAction === selectedTutorialAction.id}
        />
      )}
    </aside>
  );
};
