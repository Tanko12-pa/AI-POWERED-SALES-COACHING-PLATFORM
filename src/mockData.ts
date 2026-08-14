import {
  CrmOpportunity,
  CalendarEvent,
  SlackSnippet,
  PlaybookDoc,
  EmailCampaign,
  SystemLogNode,
  CopyVariant,
  AudienceSegment,
  PushNotification
} from './types';

export const initialCrmOpportunities: CrmOpportunity[] = [
  {
    id: 'crm-001',
    name: 'ACME Corp Enterprise Renewal',
    company: 'ACME Corp',
    stage: 'Negotiation',
    dealValue: 125000,
    contactName: 'Sarah Jenkins',
    email: 'sjenkins@acmecorp.com',
    lastContactDate: '2026-08-06',
    probability: 80,
    notes: 'Sent updated proposal. Waiting on legal team approval for SLA terms.',
    riskReason: 'No response in 5 days regarding contract amendment.',
    createdDate: '2026-08-01'
  },
  {
    id: 'crm-002',
    name: 'Beta Retail Omnichannel Suite',
    company: 'Beta Retail Group',
    stage: 'Proposal',
    dealValue: 85000,
    contactName: 'David Lee',
    email: 'dlee@betaretail.com',
    lastContactDate: '2026-08-10',
    probability: 65,
    notes: 'Demo completed with positive feedback from VP of Digital.',
    createdDate: '2026-08-03'
  },
  {
    id: 'crm-003',
    name: 'Delta Health Analytics Rollout',
    company: 'Delta Health Care',
    stage: 'Discovery',
    dealValue: 210000,
    contactName: 'Dr. Marcus Vance',
    email: 'mvance@deltahealth.org',
    lastContactDate: '2026-08-09',
    probability: 40,
    notes: 'Open technical questions regarding HIPAA compliance and cloud sync.',
    createdDate: '2026-08-05'
  },
  {
    id: 'crm-004',
    name: 'Global Logistics Supply Chain AI',
    company: 'Global Logistics Ltd',
    stage: 'Closed Won',
    dealValue: 175000,
    contactName: 'Elena Rostova',
    email: 'elena@globallogistics.io',
    lastContactDate: '2026-08-10',
    probability: 100,
    notes: 'Contract signed. Onboarding set for next Monday.',
    createdDate: '2026-07-20'
  },
  {
    id: 'crm-005',
    name: 'FinTech Premier Payment Gateway',
    company: 'FinTech One',
    stage: 'Negotiation',
    dealValue: 95000,
    contactName: 'Carlos Mendez',
    email: 'cmendez@fintechone.com',
    lastContactDate: '2026-08-07',
    probability: 75,
    notes: 'Price objection raised during CFO review.',
    riskReason: 'Competitor pricing match requested.',
    createdDate: '2026-08-02'
  }
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal-101',
    title: 'ACME Corp Executive QBR',
    repName: 'Alex Rivera',
    clientName: 'ACME Corp',
    date: '2026-08-11',
    time: '10:00 AM',
    duration: '45 mins',
    status: 'Scheduled',
    notes: 'Review Q3 volume tier discounts and SLA requirements.'
  },
  {
    id: 'cal-102',
    title: 'Beta Retail Demo Follow-Up',
    repName: 'Alex Rivera',
    clientName: 'Beta Retail',
    date: '2026-08-11',
    time: '02:00 PM',
    duration: '30 mins',
    status: 'Scheduled',
    notes: 'Walkthrough ROI calculator with Finance team.'
  },
  {
    id: 'cal-103',
    title: 'Delta Health Security Review',
    repName: 'Alex Rivera',
    clientName: 'Delta Health',
    date: '2026-08-12',
    time: '11:00 AM',
    duration: '60 mins',
    status: 'Scheduled',
    notes: 'Technical session with Chief Information Security Officer.'
  }
];

export const initialSlackSnippets: SlackSnippet[] = [
  {
    id: 'slk-201',
    sender: 'Sarah Jenkins (ACME)',
    channel: '#deal-acme-corp',
    message: 'Can you resend the SOC2 audit report? Our compliance director needs it before signoff.',
    timestamp: '2026-08-10 16:42',
    sentiment: 'Urgent / Risk'
  },
  {
    id: 'slk-202',
    sender: 'Dave Lee (Beta Retail)',
    channel: '#prospect-beta-retail',
    message: 'We loved the demo yesterday! Can you send a draft contract for 150 user seats?',
    timestamp: '2026-08-10 18:15',
    sentiment: 'Positive'
  }
];

export const initialPlaybookDocs: PlaybookDoc[] = [
  {
    id: 'doc-001',
    title: 'Enterprise Sales Playbook 2026',
    type: 'playbook',
    fileSize: '2.4 MB',
    uploadDate: '2026-08-01',
    contentSnippet: 'MEDDIC framework execution guidelines, discovery question frameworks, and executive alignment steps.',
    indexedInSearch: true
  },
  {
    id: 'doc-002',
    title: 'AI Product & Architecture Sheet v4',
    type: 'product_sheet',
    fileSize: '1.8 MB',
    uploadDate: '2026-08-02',
    contentSnippet: 'Low-latency Gemini 3.6 integration architecture, data privacy guarantees, zero-retention parameters.',
    indexedInSearch: true
  },
  {
    id: 'doc-003',
    title: 'Q3 Volume Pricing & Discounting Matrix',
    type: 'pricing',
    fileSize: '850 KB',
    uploadDate: '2026-08-05',
    contentSnippet: 'Tier 1 (>100k): up to 15% discount with VP approval. Multi-year commitment incentive matrix.',
    indexedInSearch: true
  },
  {
    id: 'doc-004',
    title: 'Competitive Battlecard vs Salesforce Agentforce',
    type: 'objection_handling',
    fileSize: '1.2 MB',
    uploadDate: '2026-08-08',
    contentSnippet: 'Key differentiators: Real-time open internet marketing language lab, automated Sentry health patches, zero lock-in.',
    indexedInSearch: true
  }
];

export const initialCopyVariants: CopyVariant[] = [
  {
    id: 'copy-001',
    title: 'High-Convert Retail Headline',
    copy: 'Turn raw store activity into real-time revenue intelligence. Empower your retail teams to close 35% faster with AI-grounded insights.',
    tone: 'Authoritative & Action-Oriented',
    targetPersona: 'VP of Retail Operations',
    industry: 'retail',
    performanceEstimate: '+28% Projected CTR',
    callToAction: 'Book Live Retail Demo',
    createdDate: '2026-08-10'
  },
  {
    id: 'copy-002',
    title: 'Finance Security & ROI Focus',
    copy: 'Enterprise-grade revenue intelligence backed by strict compliance. See how top financial institutions automate deal coaching without risking data security.',
    tone: 'Professional & Reassuring',
    targetPersona: 'Chief Risk & Commercial Officer',
    industry: 'finance',
    performanceEstimate: '+34% Enterprise Lead Conversion',
    callToAction: 'Download Compliance Whitepaper',
    createdDate: '2026-08-09'
  }
];

export const initialAudienceSegments: AudienceSegment[] = [
  {
    id: 'aud-001',
    name: 'Enterprise Tech Decision Makers',
    demographics: 'US / EU, Directors & VPs, Company Size > 500',
    behaviors: 'Active readers of tech portals, SaaS buyers, open internet B2B research',
    budgetShare: '40%',
    recommendedChannels: ['Programmatic Display', 'Connected TV (CTV)', 'LinkedIn Direct Native'],
    estimatedReach: '1.2M Business Professionals'
  },
  {
    id: 'aud-002',
    name: 'High-Growth E-Commerce & Retail Leaders',
    demographics: 'Global, Founders, CMOs, Heads of Sales',
    behaviors: 'High affinity for digital transformation, marketing automation tools',
    budgetShare: '35%',
    recommendedChannels: ['Open Web Native Ads', 'High-Impact Digital Out-of-Home', 'Podcasts'],
    estimatedReach: '850K Decision Makers'
  }
];

export const initialEmailCampaigns: EmailCampaign[] = [
  {
    id: 'email-001',
    campaignName: 'Q3 Enterprise Re-engagement Sequence',
    subject: 'Accelerate deal cycles with AI-grounded sales coaching',
    template: 'Hi {{First_Name}}, noticed ACME is evaluating revenue AI. Our latest playbook reduced stalled deal time by 40%...',
    targetAudience: 'Stalled Deals > $50k',
    openRate: 48.5,
    clickRate: 14.2,
    conversionRate: 6.8,
    status: 'Active',
    lastSentDate: '2026-08-10'
  },
  {
    id: 'email-002',
    campaignName: 'Post-Demo ROI Nudge',
    subject: 'Your customized ROI breakdown & next steps',
    template: 'Hi {{First_Name}}, thanks for joining our demo! Attached is the tailormade ROI calculation for {{Company}}...',
    targetAudience: 'Completed Demos (Last 48 Hours)',
    openRate: 62.1,
    clickRate: 28.4,
    conversionRate: 12.5,
    status: 'Automated',
    lastSentDate: '2026-08-11'
  }
];

export const initialSystemLogs: SystemLogNode[] = [
  {
    id: 'log-001',
    timestamp: '2026-08-11 00:42:15',
    level: 'info',
    category: 'Auto-Pilot Upgrade',
    message: 'AI Studio Auto-Pilot successfully deployed patch v2.4.1. Node performance optimized.',
    node: 'node-us-west-1a'
  },
  {
    id: 'log-002',
    timestamp: '2026-08-11 00:30:00',
    level: 'security',
    category: 'Auto-Patch',
    message: 'Automated security scan completed. 0 critical vulnerabilities found. TLS 1.3 enforced.',
    node: 'sec-shield-gateway'
  },
  {
    id: 'log-003',
    timestamp: '2026-08-10 23:15:04',
    level: 'warn',
    category: 'Sentry Debugger',
    message: 'Caught high response latency warning on third-party webhook handler (340ms). Auto-throttled retry queue.',
    node: 'api-gateway-02',
    lineRef: 'server.ts:142',
    suggestedFix: 'Wrap external webhook payload in asynchronous background worker.'
  },
  {
    id: 'log-004',
    timestamp: '2026-08-10 20:00:00',
    level: 'info',
    category: 'Cloud Backup',
    message: 'Automated encrypted snapshot backup verified successfully. Backup ID: snap-20260810-2000.',
    node: 'backup-vault-s3'
  }
];

export const initialPushNotifications: PushNotification[] = [
  {
    id: 'notif-001',
    type: 'deal_alert',
    title: 'ACME Corp Deal Stalled',
    message: 'No activity detected in 5 days. Recommendation: Send SOC2 security report snippet.',
    timestamp: '10 mins ago',
    read: false,
    priority: 'high'
  },
  {
    id: 'notif-002',
    type: 'coaching',
    title: 'Coaching Summary Ready',
    message: 'Today\'s Sales Activity analysis generated. Pipeline Health score is 84/100.',
    timestamp: '35 mins ago',
    read: false,
    priority: 'medium'
  },
  {
    id: 'notif-003',
    type: 'security',
    title: 'Auto-Patch Applied',
    message: 'Security shield updated to latest definition. All nodes 100% compliant.',
    timestamp: '2 hours ago',
    read: true,
    priority: 'low'
  }
];
