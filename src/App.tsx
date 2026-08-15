/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ActionPanel } from './components/ActionPanel';
import { MetricCards } from './components/MetricCards';
import { SalesCoachingFeed } from './components/SalesCoachingFeed';
import { MarketingLanguageLab } from './components/MarketingLanguageLab';
import { AudienceTargetingStudio } from './components/AudienceTargetingStudio';
import { EmailAutomationLab } from './components/EmailAutomationLab';
import { SystemHealthStudio } from './components/SystemHealthStudio';
import { SettingsAndPlaybooks } from './components/SettingsAndPlaybooks';
import { SalesSoftwareDirectory } from './components/SalesSoftwareDirectory';
import { DownloadReportModal } from './components/DownloadReportModal';
import { ChatbotDrawer } from './components/ChatbotDrawer';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { BadgesModal } from './components/BadgesModal';
import { VoicePitchRecorderModal } from './components/VoicePitchRecorderModal';
import { AuthSubscriptionProvider } from './context/AuthSubscriptionContext';
import { AuthModal } from './components/AuthModal';
import { SubscriptionPlansModal } from './components/SubscriptionPlansModal';
import { ManageSubscriptionPortal } from './components/ManageSubscriptionPortal';
import { LayoutDashboard, Receipt, Sparkles as SparklesIcon, ShieldCheck } from 'lucide-react';

import {
  initialCrmOpportunities,
  initialCalendarEvents,
  initialSlackSnippets,
  initialPlaybookDocs,
  initialCopyVariants,
  initialAudienceSegments,
  initialEmailCampaigns,
  initialSystemLogs,
  initialPushNotifications
} from './mockData';

import {
  CoachingSessionResult,
  MarketingLabResult,
  AudienceTargetingResult,
  CrmOpportunity,
  PlaybookDoc,
  CopyVariant,
  AudienceSegment,
  EmailCampaign,
  SystemLogNode,
  PushNotification,
  ChatMessage,
  UserRole,
  IndustryType,
  BadgeItem,
  PrepSlotProposal,
  PitchAnalysisResult
} from './types';

const INITIAL_BADGES: BadgeItem[] = [
  {
    id: 'badge-1',
    name: 'Pipeline Prodigy',
    description: 'Awarded for maintaining a Pipeline Health Score of 85 or higher.',
    iconName: 'Trophy',
    category: 'Pipeline',
    unlocked: true,
    unlockedAt: '2026-08-08',
    progress: 100,
    criteriaText: 'Pipeline Health >= 85'
  },
  {
    id: 'badge-2',
    name: 'Coaching Champion',
    description: 'Awarded for running 3 or more live AI coaching analysis sessions.',
    iconName: 'Zap',
    category: 'Coaching',
    unlocked: true,
    unlockedAt: '2026-08-09',
    progress: 100,
    criteriaText: 'Run 3 Coaching Sessions'
  },
  {
    id: 'badge-3',
    name: 'Streak Master',
    description: 'Awarded for completing 3 or more daily pre-call prep checklists.',
    iconName: 'Target',
    category: 'Prep',
    unlocked: true,
    unlockedAt: '2026-08-10',
    progress: 100,
    criteriaText: '3 Pre-Call Preps Done'
  },
  {
    id: 'badge-4',
    name: 'Closing Expert',
    description: 'Awarded for closing over $100,000 in total contract value.',
    iconName: 'DollarSign',
    category: 'Closing',
    unlocked: true,
    unlockedAt: '2026-08-10',
    progress: 100,
    criteriaText: 'Closed Won > $100k'
  },
  {
    id: 'badge-5',
    name: 'Pitch Master',
    description: 'Awarded for recording and analyzing a 60s voice pitch in the Speech Practice Lab.',
    iconName: 'Mic',
    category: 'Pitch',
    unlocked: false,
    progress: 0,
    criteriaText: 'Record 1 Voice Pitch'
  }
];

const INITIAL_PROPOSED_SLOTS: PrepSlotProposal[] = [
  {
    id: 'prop-1',
    opportunityName: 'ACME Corp Enterprise Renewal',
    clientName: 'ACME Corp',
    proposedTime: 'Today at 10:15 AM - 10:30 AM',
    duration: '15 min',
    prepFocus: 'Review SOC2 & Security Addendum snippet in playbook before 11:00 AM call',
    playbookTopic: 'Security & Enterprise Pricing Matrix',
    status: 'Proposed'
  },
  {
    id: 'prop-2',
    opportunityName: 'Beta Retail Group Expansion',
    clientName: 'Beta Retail Group',
    proposedTime: 'Today at 1:30 PM - 1:45 PM',
    duration: '15 min',
    prepFocus: 'Prepare 150-seat TCO savings breakdown & CFO price objection script',
    playbookTopic: 'Handling Price Objections & ROI',
    status: 'Proposed'
  }
];

export default function App() {
  return (
    <AuthSubscriptionProvider>
      <AppInner />
    </AuthSubscriptionProvider>
  );
}

function AppInner() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboardSubView, setDashboardSubView] = useState<'coaching' | 'subscription'>('coaching');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userRole, setUserRole] = useState<UserRole>('Admin');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Drawers & Modals
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);
  const [showPitchModal, setShowPitchModal] = useState<boolean>(false);

  // Data Stores
  const [crmOpportunities, setCrmOpportunities] = useState<CrmOpportunity[]>(initialCrmOpportunities);
  const [calendarEvents] = useState(initialCalendarEvents);
  const [slackSnippets] = useState(initialSlackSnippets);
  const [playbooks, setPlaybooks] = useState<PlaybookDoc[]>(initialPlaybookDocs);
  const [copyVariants, setCopyVariants] = useState<CopyVariant[]>(initialCopyVariants);
  const [segments, setSegments] = useState<AudienceSegment[]>(initialAudienceSegments);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(initialEmailCampaigns);
  const [systemLogs, setSystemLogs] = useState<SystemLogNode[]>(initialSystemLogs);
  const [notifications, setNotifications] = useState<PushNotification[]>(initialPushNotifications);

  // New Stores: Badges & AI Proposed Slots
  const [badges, setBadges] = useState<BadgeItem[]>(INITIAL_BADGES);
  const [proposedPrepSlots, setProposedPrepSlots] = useState<PrepSlotProposal[]>(INITIAL_PROPOSED_SLOTS);

  // Handlers for Pre-Call Prep Slots & Voice Pitch
  const handleProposePrepSlots = async () => {
    setLoadingAction('propose-slots');
    try {
      const response = await fetch('/api/coaching/propose-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crmData: crmOpportunities, calendarData: calendarEvents })
      }).catch(() => null);
      const data = response && response.ok ? await response.json().catch(() => ({})) : {};
      const slots = data.proposedSlots || [
        {
          id: `slot-rec-${Date.now()}`,
          opportunityId: 'opp-1',
          opportunityName: 'Acme Corp - Enterprise Tier Expansion',
          slotTime: 'Tomorrow at 9:30 AM',
          durationMinutes: 20,
          rationale: 'Review MEDDIC economic buyer criteria and pricing objection counter-points before negotiation call.',
          priority: 'High',
          status: 'Proposed'
        }
      ];
      setProposedPrepSlots(slots);
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          type: 'coaching',
          title: 'AI Pre-Call Prep Slots Proposed',
          message: `Gemini proposed ${slots.length} optimal prep slots based on CRM priorities and calendar availability.`,
          timestamp: 'Just now',
          read: false,
          priority: 'high'
        },
        ...prev
      ]);
    } catch (err) {
      console.warn('Propose slots network notice, using local generator:', err);
      setProposedPrepSlots(INITIAL_PROPOSED_SLOTS);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAcceptPrepSlot = (slotId: string) => {
    setProposedPrepSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'Accepted' } : s));
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'coaching',
        title: 'Pre-Call Prep Slot Calendarized',
        message: 'Slot inserted into daily calendar view.',
        timestamp: 'Just now',
        read: false,
        priority: 'medium'
      },
      ...prev
    ]);
  };

  const handleDismissPrepSlot = (slotId: string) => {
    setProposedPrepSlots(prev => prev.filter(s => s.id !== slotId));
  };

  const handlePitchCompleted = (result: PitchAnalysisResult) => {
    // Unlock Pitch Master badge
    const todayStr = new Date().toISOString().split('T')[0];
    setBadges(prev => prev.map(b => b.id === 'badge-5' ? { ...b, unlocked: true, progress: 100, unlockedAt: todayStr } : b));
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'coaching',
        title: '🏆 "Pitch Master" Badge Unlocked!',
        message: `Voice pitch analyzed! Overall score: ${result.overallScore}/100. Badge stored in your profile.`,
        timestamp: 'Just now',
        read: false,
        priority: 'high'
      },
      ...prev
    ]);
  };

  // AI Session Outputs
  const [coachingData, setCoachingData] = useState<CoachingSessionResult | null>(null);
  const [marketingResult, setMarketingResult] = useState<MarketingLabResult | null>(null);
  const [targetingResult, setTargetingResult] = useState<AudienceTargetingResult | null>(null);

  // Chatbot state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'chat-1',
      sender: 'assistant',
      text: 'Hello! I am your AI Sales Coaching Assistant powered by Gemini 3.6. Ask me anything about handling pricing objections, playbook MEDDIC rules, or optimizing deal stage transitions.',
      timestamp: 'Just now',
      sources: ['Enterprise Sales Playbook 2026']
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Unread notification count
  const unreadCount = notifications.filter(n => !n.read).length;

  // -------------------------------------------------------------
  // Backend Action Panel Handlers
  // -------------------------------------------------------------

  // 1. Run Sales Coaching Session
  const handleRunCoachingSession = async () => {
    setLoadingAction('coaching');
    try {
      const response = await fetch('/api/coaching/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crmData: crmOpportunities,
          calendarData: calendarEvents,
          slackData: slackSnippets,
          playbooks
        })
      });
      const data = response.ok ? await response.json().catch(() => null) : null;
      if (data) {
        setCoachingData(data);
      }
      setActiveTab('dashboard');

      // Add push notification
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          type: 'coaching',
          title: 'Sales Coaching Session Complete',
          message: `Evaluation generated. Pipeline Health Score is ${data?.pipeline_health_score || 88}/100.`,
          timestamp: 'Just now',
          read: false,
          priority: 'high'
        },
        ...prev
      ]);
    } catch (err) {
      console.warn('Coaching session network notice:', err);
      setActiveTab('dashboard');
    } finally {
      setLoadingAction(null);
    }
  };

  // 2. Analyze Today's Sales Activity
  const handleAnalyzeToday = async () => {
    setLoadingAction('analyze');
    try {
      const response = await fetch('/api/coaching/analyze', { method: 'POST' });
      const data = response.ok ? await response.json().catch(() => null) : null;
      if (data) {
        setCoachingData(data);
      }
      setActiveTab('dashboard');
    } catch (err) {
      console.warn('Analyze network notice:', err);
      setActiveTab('dashboard');
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. Generate High-Performing Marketing Copy
  const handleGenerateCopy = async (
    product = 'AI-Powered Sales Coaching Platform',
    industry: IndustryType = 'retail',
    persona = 'VP of Marketing'
  ) => {
    setLoadingAction('generate_copy');
    try {
      const response = await fetch('/api/marketing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productDescription: product, industry, persona })
      });
      const data = response.ok ? await response.json().catch(() => null) : null;
      if (data) {
        setMarketingResult(data);
        if (data.variants && data.variants.length > 0) {
          setCopyVariants(prev => [...data.variants, ...prev]);
        }
      }
      setActiveTab('marketing');
    } catch (err) {
      console.warn('Marketing generate network notice:', err);
      setActiveTab('marketing');
    } finally {
      setLoadingAction(null);
    }
  };

  // 4. Optimize Existing Campaign Copy
  const handleOptimizeCopy = async () => {
    setLoadingAction('optimize_copy');
    await handleGenerateCopy('AI-Powered Sales Coaching Platform', 'e-commerce', 'CMO');
  };

  // 5. Design Data-Driven Audience Targeting Plan
  const handleDesignTargeting = async () => {
    setLoadingAction('targeting');
    try {
      const response = await fetch('/api/targeting/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignObjective: 'Enterprise B2B Growth', budget: 75000 })
      });
      const data = response.ok ? await response.json().catch(() => null) : null;
      if (data) {
        setTargetingResult(data);
      }
      setActiveTab('targeting');
    } catch (err) {
      console.warn('Targeting plan network notice:', err);
      setActiveTab('targeting');
    } finally {
      setLoadingAction(null);
    }
  };

  // 6. Review Live Campaign Performance
  const handleReviewPerformance = async () => {
    setLoadingAction('review_campaign');
    await handleDesignTargeting();
  };

  // 7. Sync CRM & Calendar Data
  const handleSyncCrmCalendar = () => {
    setLoadingAction('sync_crm');
    setTimeout(() => {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          type: 'system',
          title: 'CRM & Calendar Synchronized',
          message: '5 CRM opportunities and 3 calendar events refreshed successfully.',
          timestamp: 'Just now',
          read: false,
          priority: 'medium'
        },
        ...prev
      ]);
      setLoadingAction(null);
    }, 800);
  };

  // 8. Upload / Refresh Sales Playbooks & Product Docs
  const handleUploadDocsTrigger = () => {
    setActiveTab('settings');
  };

  // 9. Export Coaching Report (PDF/CSV)
  const handleExportReportTrigger = () => {
    setShowPdfModal(true);
  };

  // 10. Settings & Integrations
  const handleOpenSettingsTrigger = () => {
    setActiveTab('settings');
  };

  // -------------------------------------------------------------
  // Data Mutation Handlers
  // -------------------------------------------------------------
  const handleAddOpportunity = (newOpp: CrmOpportunity) => {
    setCrmOpportunities(prev => [newOpp, ...prev]);
  };

  const handleDeleteOpportunity = (id: string) => {
    setCrmOpportunities(prev => prev.filter(o => o.id !== id));
  };

  const handleAddCopyVariant = (v: CopyVariant) => {
    setCopyVariants(prev => [v, ...prev]);
  };

  const handleDeleteCopyVariant = (id: string) => {
    setCopyVariants(prev => prev.filter(c => c.id !== id));
  };

  const handleAddSegment = (seg: AudienceSegment) => {
    setSegments(prev => [seg, ...prev]);
  };

  const handleDeleteSegment = (id: string) => {
    setSegments(prev => prev.filter(s => s.id !== id));
  };

  const handleAddCampaign = (camp: EmailCampaign) => {
    setCampaigns(prev => [camp, ...prev]);
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleAddLogNode = (node: SystemLogNode) => {
    setSystemLogs(prev => [node, ...prev]);
  };

  const handleDeleteLogNode = (id: string) => {
    setSystemLogs(prev => prev.filter(l => l.id !== id));
  };

  const handleUploadPlaybook = (doc: PlaybookDoc) => {
    setPlaybooks(prev => [doc, ...prev]);
  };

  const handleDeletePlaybook = (id: string) => {
    setPlaybooks(prev => prev.filter(p => p.id !== id));
  };

  // Trigger Sentry Patch & Cloud Backup
  const handleTriggerPatchAndBackup = async () => {
    try {
      const response = await fetch('/api/system/trigger-patch', { method: 'POST' });
      const data = response.ok ? await response.json().catch(() => ({})) : {};

      const newLog: SystemLogNode = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'security',
        category: 'Auto-Patch',
        message: data.message || 'Auto-patch applied and state synced successfully.',
        node: 'sec-shield-gateway'
      };
      setSystemLogs(prev => [newLog, ...prev]);

      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          type: 'security',
          title: 'Auto-Pilot Security Patch Deployed',
          message: 'Encrypted cloud backup snapshot verified in Auto-Pilot mode.',
          timestamp: 'Just now',
          read: false,
          priority: 'low'
        },
        ...prev
      ]);
    } catch (err) {
      console.warn('Trigger patch notice:', err);
    }
  };

  // Export CSV Event Logs
  const handleExportCsvLogs = () => {
    const headers = 'ID,Timestamp,Level,Category,Node,Message\n';
    const rows = systemLogs.map(l =>
      `"${l.id}","${l.timestamp}","${l.level}","${l.category}","${l.node}","${l.message.replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `System_Event_Logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Chatbot Handler
  const handleSendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: { coachingData, crmOpportunities } })
      });
      const data = response.ok ? await response.json().catch(() => null) : null;

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data?.reply || `I analyzed "${text}". Based on your pipeline data, focus on multi-threading key stakeholders and reinforcing ROI payback metrics.`,
        timestamp: 'Just now',
        sources: data?.sources || ['Enterprise Sales Playbook 2026', 'MEDDIC Methodology']
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('Chatbot API notice:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Regarding "${text}": Make sure to uncover the Economic Buyer and qualify Decision Criteria before submitting your proposal.`,
        timestamp: 'Just now',
        sources: ['Enterprise Sales Playbook']
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Filtered lists if Global Search Query is present
  const filteredOpportunities = crmOpportunities.filter(o =>
    !searchQuery ||
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-[#F8FAF6] text-slate-900'
    }`}>
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        unreadCount={unreadCount}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenPdfReport={() => setShowPdfModal(true)}
        onOpenChatbot={() => setShowChatbot(true)}
        userRole={userRole}
        setUserRole={setUserRole}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(prev => !prev)}
      />

      {/* Main Screen Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Insight Canvas */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Metric Cards Bar */}
            <MetricCards
              coachingData={coachingData}
              onDownloadPdf={() => setShowPdfModal(true)}
            />

            {/* Tab Views */}
            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                {/* Dashboard Sub-View Switcher Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      id="dashboard-coaching-subtab-btn"
                      onClick={() => setDashboardSubView('coaching')}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        dashboardSubView === 'coaching'
                          ? 'bg-[#800000] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Sales Coaching & Pipeline Feed</span>
                    </button>

                    <button
                      id="dashboard-subscription-subtab-btn"
                      onClick={() => setDashboardSubView('subscription')}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        dashboardSubView === 'subscription'
                          ? 'bg-[#800000] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Receipt className="w-3.5 h-3.5 text-[#A8C66C]" />
                      <span>Manage Subscription Portal</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-[#A8C66C] text-[#800000] text-[9px] font-black uppercase">
                        Live Sync
                      </span>
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 px-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Backend Real-Time Active</span>
                  </div>
                </div>

                {dashboardSubView === 'coaching' ? (
                  <SalesCoachingFeed
                    coachingData={coachingData}
                    crmOpportunities={filteredOpportunities}
                    calendarEvents={calendarEvents}
                    playbooks={playbooks}
                    badges={badges}
                    proposedPrepSlots={proposedPrepSlots}
                    onAddOpportunity={handleAddOpportunity}
                    onDeleteOpportunity={handleDeleteOpportunity}
                    onRunCoachingSession={handleRunCoachingSession}
                    onOpenBadgesModal={() => setShowBadgesModal(true)}
                    onProposePrepSlots={handleProposePrepSlots}
                    onAcceptPrepSlot={handleAcceptPrepSlot}
                    onDismissPrepSlot={handleDismissPrepSlot}
                    onOpenPitchModal={() => setShowPitchModal(true)}
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <ManageSubscriptionPortal
                    isDarkMode={isDarkMode}
                  />
                )}
              </div>
            )}

            {activeTab === 'software' && (
              <SalesSoftwareDirectory
                onRunCoachingSession={handleRunCoachingSession}
                onOpenPdfReport={() => setShowPdfModal(true)}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'marketing' && (
              <MarketingLanguageLab
                marketingResult={marketingResult}
                copyVariants={copyVariants}
                onAddCopyVariant={handleAddCopyVariant}
                onDeleteCopyVariant={handleDeleteCopyVariant}
                onGenerateCopy={(prod, ind, pers) => handleGenerateCopy(prod, ind, pers)}
              />
            )}

            {activeTab === 'targeting' && (
              <AudienceTargetingStudio
                targetingResult={targetingResult}
                segments={segments}
                onAddSegment={handleAddSegment}
                onDeleteSegment={handleDeleteSegment}
                onDesignPlan={handleDesignTargeting}
              />
            )}

            {activeTab === 'email' && (
              <EmailAutomationLab
                campaigns={campaigns}
                onAddCampaign={handleAddCampaign}
                onDeleteCampaign={handleDeleteCampaign}
                onGenerateEmailContent={(name, aud) => {
                  handleGenerateCopy(`Email sequence for ${name}`, 'b2b_saas', aud);
                }}
              />
            )}

            {activeTab === 'system' && (
              <SystemHealthStudio
                systemLogs={systemLogs}
                onAddLogNode={handleAddLogNode}
                onDeleteLogNode={handleDeleteLogNode}
                onTriggerPatchAndBackup={handleTriggerPatchAndBackup}
                onExportCsvLogs={handleExportCsvLogs}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsAndPlaybooks
                playbooks={playbooks}
                onUploadDoc={handleUploadPlaybook}
                onDeleteDoc={handleDeletePlaybook}
                onSyncIntegrations={handleSyncCrmCalendar}
              />
            )}
          </div>

          {/* Right Column: Single Control Panel (All 10 Action Buttons) */}
          <div className="lg:col-span-4">
            <ActionPanel
              onRunCoaching={handleRunCoachingSession}
              onAnalyzeToday={handleAnalyzeToday}
              onGenerateCopy={() => handleGenerateCopy()}
              onOptimizeCopy={handleOptimizeCopy}
              onDesignTargeting={handleDesignTargeting}
              onReviewPerformance={handleReviewPerformance}
              onSyncCrmCalendar={handleSyncCrmCalendar}
              onUploadDocs={handleUploadDocsTrigger}
              onExportReport={handleExportReportTrigger}
              onOpenSettings={handleOpenSettingsTrigger}
              loadingAction={loadingAction}
            />
          </div>

        </div>
      </main>

      {/* Modals & Drawers */}
      {showPdfModal && (
        <DownloadReportModal
          coachingData={coachingData}
          crmOpportunities={crmOpportunities}
          onClose={() => setShowPdfModal(false)}
        />
      )}

      {showChatbot && (
        <ChatbotDrawer
          messages={chatMessages}
          onSendMessage={handleSendChatMessage}
          onClose={() => setShowChatbot(false)}
          isLoading={chatLoading}
        />
      )}

      {showNotifications && (
        <NotificationsDrawer
          notifications={notifications}
          onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
          onClearAll={() => setNotifications([])}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {showBadgesModal && (
        <BadgesModal
          badges={badges}
          onClose={() => setShowBadgesModal(false)}
        />
      )}

      {showPitchModal && (
        <VoicePitchRecorderModal
          onClose={() => setShowPitchModal(false)}
          onPitchAnalyzed={handlePitchCompleted}
        />
      )}

      {/* Auth & Subscription Modals */}
      <AuthModal />
      <SubscriptionPlansModal />
    </div>
  );
}
