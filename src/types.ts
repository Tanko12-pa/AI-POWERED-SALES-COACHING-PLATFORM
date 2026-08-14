export type UserRole = 'Admin' | 'Sales Manager' | 'Sales Rep';

export interface CrmOpportunity {
  id: string;
  name: string;
  company: string;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  dealValue: number;
  contactName: string;
  email: string;
  lastContactDate: string;
  probability: number;
  notes: string;
  riskReason?: string;
  createdDate: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  repName: string;
  clientName: string;
  date: string;
  time: string;
  duration: string;
  status: 'Scheduled' | 'Completed' | 'Follow-Up Needed';
  notes: string;
}

export interface SlackSnippet {
  id: string;
  sender: string;
  channel: string;
  message: string;
  timestamp: string;
  sentiment: 'Positive' | 'Neutral' | 'Urgent / Risk';
}

export interface PlaybookRef {
  doc: string;
  section: string;
  snippet?: string;
}

export interface CoachingSessionResult {
  summary: string;
  priority_actions: string[];
  risk_deals: { name: string; risk_reason: string }[];
  playbook_refs: PlaybookRef[];
  time_management_score: number;
  pipeline_health_score: number;
  next_best_steps: string[];
  timestamp: string;
}

export type IndustryType = 'retail' | 'e-commerce' | 'travel' | 'health' | 'finance' | 'technology' | 'b2b_saas';

export interface CopyVariant {
  id: string;
  title: string;
  copy: string;
  tone: string;
  targetPersona: string;
  industry: IndustryType;
  performanceEstimate: string;
  callToAction: string;
  createdDate: string;
}

export interface MarketingLabResult {
  variants: CopyVariant[];
  tone_guidelines: string;
  ab_test_plan: string;
  optimization_notes: string;
  timestamp: string;
}

export interface AudienceSegment {
  id: string;
  name: string;
  demographics: string;
  behaviors: string;
  budgetShare: string;
  recommendedChannels: string[];
  estimatedReach: string;
}

export interface AudienceTargetingResult {
  segments: AudienceSegment[];
  channels: string[];
  placements: string[];
  bidding_strategy: string;
  live_optimization_tips: string[];
  timestamp: string;
}

export interface EmailCampaign {
  id: string;
  campaignName: string;
  subject: string;
  template: string;
  targetAudience: string;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  status: 'Active' | 'Draft' | 'Automated' | 'Paused';
  lastSentDate: string;
}

export interface SystemLogNode {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'security';
  category: 'Sentry Debugger' | 'Auto-Patch' | 'Cloud Backup' | 'Auto-Pilot Upgrade';
  message: string;
  node: string;
  lineRef?: string;
  suggestedFix?: string;
}

export interface PlaybookDoc {
  id: string;
  title: string;
  type: 'playbook' | 'product_sheet' | 'pricing' | 'objection_handling';
  fileSize: string;
  uploadDate: string;
  contentSnippet: string;
  indexedInSearch: boolean;
}

export interface PushNotification {
  id: string;
  type: 'coaching' | 'security' | 'deal_alert' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
}

export interface MeetingDebriefActionItem {
  id: string;
  task: string;
  owner: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface MeetingDebriefKeyObjection {
  id: string;
  objection: string;
  severity: 'Critical' | 'Moderate' | 'Minor';
  suggestedResponse: string;
}

export interface MeetingDebriefResult {
  sentimentScore: number;
  sentimentLabel: 'Positive' | 'Neutral' | 'Hesitant / Risk' | 'Highly Favorable';
  sentimentSummary: string;
  keyObjections: MeetingDebriefKeyObjection[];
  actionItems: MeetingDebriefActionItem[];
  coachingTips: string[];
  opportunityName?: string;
  timestamp: string;
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'Pipeline' | 'Coaching' | 'Prep' | 'Closing' | 'Pitch';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 to 100
  criteriaText: string;
}

export interface PrepSlotProposal {
  id: string;
  opportunityName: string;
  clientName: string;
  proposedTime: string; // e.g. "Today at 10:15 AM - 10:30 AM"
  duration: string;
  prepFocus: string;
  playbookTopic: string;
  status: 'Proposed' | 'Accepted' | 'Dismissed';
}

export interface PitchAnalysisResult {
  id: string;
  timestamp: string;
  transcription: string;
  durationSeconds: number;
  overallScore: number;
  paceWpm: number;
  clarityScore: number;
  matchedTopics: { topic: string; foundInPlaybook: boolean; snippetMatched: string }[];
  missedTopics: string[];
  coachingFeedback: string[];
  recommendedPlaybookRef: string;
}

export interface TeamMemberPerformance {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  pipelineHealthScore: number;
  closedWonValue: number;
  activeDealsCount: number;
  coachingSessionsCompleted: number;
  campaignSuccessRate: number; // percentage
  badgesCount: number;
  badges: string[]; // Badge IDs or names
  topSkill: string;
  rank: number;
}

export interface TeamAggregateMetrics {
  avgPipelineHealth: number;
  totalTeamClosedValue: number;
  totalActiveDeals: number;
  avgCoachingCompletion: number;
  teamCampaignSuccessRate: number;
  topPerformingRegion: string;
  timeframe: string;
}

export interface TalkListenRatio {
  rep_percentage: number;
  prospect_percentage: number;
  assessment: string;
}

export interface EvaluationCategory {
  category_name: string;
  score: number;
  strengths: string[];
  areas_for_improvement: string[];
  evidence_quotes: string[];
}

export interface MeddpiccChecklist {
  metrics_identified: boolean;
  economic_buyer_uncovered: boolean;
  decision_criteria_clear: boolean;
  decision_process_known: boolean;
  paper_process_discussed: boolean;
  implicated_pain_found: boolean;
  champion_identified: boolean;
}

export interface CallScorecardResult {
  call_summary: string;
  overall_score: number;
  talk_listen_ratio: TalkListenRatio;
  evaluation_categories: EvaluationCategory[];
  meddpicc_checklist: MeddpiccChecklist;
  key_action_items: string[];
  opportunityName?: string;
  repName?: string;
  timestamp?: string;
  full_transcript?: string;
}

export type SubscriptionPlanType = 'monthly' | 'yearly';
export type SubscriptionStatus =
  | 'trialing'
  | 'active_monthly'
  | 'active_yearly'
  | 'expired_trial'
  | 'free_tier'
  | 'canceled';

export interface BillingInvoice {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'Paid' | 'Trial' | 'Pending' | 'Refunded';
  plan: '7-Day Free Trial' | '$15.99 / Monthly' | '$155.99 / Yearly';
  paymentMethod: string;
  invoicePdfUrl?: string;
}

export interface SubscriptionState {
  status: SubscriptionStatus;
  selectedPlan: SubscriptionPlanType; // Plan to transition to or currently active
  monthlyPrice: number; // 15.99
  yearlyPrice: number; // 155.99
  trialStartDate: string; // ISO date string
  trialEndDate: string; // ISO date string (7 days later)
  trialDaysRemaining: number;
  autoTransitionToPlan: boolean; // default true: after trial expires, auto charge selected plan
  transitionExecuted: boolean;
  paymentMethod: {
    cardBrand: string;
    last4: string;
    expDate: string;
    holderName: string;
  };
  billingHistory: BillingInvoice[];
  lastPaymentDate?: string;
  nextBillingDate?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string; // Saved password for sign-in & password recovery
  role: UserRole;
  avatarUrl?: string;
  subscription: SubscriptionState;
  createdAt: string;
}

