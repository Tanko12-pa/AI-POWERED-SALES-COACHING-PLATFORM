import React, { useState, useMemo } from 'react';
import {
  Building2,
  ExternalLink,
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Award,
  Layers,
  Compass,
  Zap,
  Shield,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Users,
  Target,
  FileText,
  Play,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Check,
  X,
  BookOpen,
  Cpu,
  Globe,
  Sliders,
  Maximize2,
  Star,
  Bookmark,
  Filter,
  Tag,
  PieChart,
  RotateCcw
} from 'lucide-react';
import { SalesToolsD3Chart } from './SalesToolsD3Chart';
import { CoachingEfficiencyGuide } from './CoachingEfficiencyGuide';

export interface SoftwareTool {
  id: string;
  number: number;
  name: string;
  category: string;
  categoryGroup: string;
  bestFor: string;
  description: string;
  formerName?: string;
  websiteName: string;
  websiteUrl: string;
  keyFeatures: string[];
  easeOfUse?: number; // 1-10 scale
  costTier?: number; // 1-10 scale (1 = Low $, 10 = High $$$)
  marketShare?: number; // 1-100 percentage market share / sector index
  targetSegment?: 'Enterprise' | 'Mid-Market' | 'SMB';
  tags?: string[];
}

export const SOFTWARE_TOOLS: SoftwareTool[] = [
  // 1. AI Simulation & Practice Platforms
  {
    id: 'exec',
    number: 1,
    name: 'Exec',
    category: 'AI Practice',
    categoryGroup: 'AI Simulation & Practice Platforms',
    bestFor: 'Personalized AI roleplay and realistic buyer simulations.',
    description: 'Generates realistic, high-pressure buyer scenarios to help reps practice pitch delivery and objection handling before hopping on live calls.',
    websiteName: 'Exec',
    websiteUrl: 'https://www.exec.com/',
    keyFeatures: ['Realistic Buyer Scenarios', 'Personalized AI Roleplay', 'Pitch & Objection Practice'],
    easeOfUse: 8.7,
    costTier: 5.5,
    marketShare: 32,
    targetSegment: 'Mid-Market',
    tags: ['AI-Driven', 'AI Role-Play', 'Objection Simulations', 'Best for Onboarding']
  },
  {
    id: 'secondnature',
    number: 2,
    name: 'Second Nature AI',
    category: 'AI Practice',
    categoryGroup: 'AI Simulation & Practice Platforms',
    bestFor: 'Automated voice and video sales coaching.',
    description: 'Uses AI avatars that act as prospect buyers to conduct natural voice conversations, scoring reps on tone, talking points, and pitch delivery.',
    websiteName: 'Second Nature AI',
    websiteUrl: 'https://secondnature.ai/',
    keyFeatures: ['AI Avatars & Voice Conversations', 'Pitch & Tone Scoring', 'Automated Video Coaching'],
    easeOfUse: 8.5,
    costTier: 6.0,
    marketShare: 38,
    targetSegment: 'Enterprise',
    tags: ['AI-Driven', 'AI Role-Play', 'Video Coaching', 'Best for Onboarding']
  },
  {
    id: 'pitchmonster',
    number: 3,
    name: 'PitchMonster',
    category: 'AI Practice',
    categoryGroup: 'AI Simulation & Practice Platforms',
    bestFor: 'AI-powered pitch analysis and manager dashboards.',
    description: 'Provides playbook-based scoring that highlights missed talking points and skill gaps through interactive AI roleplays and pitch simulations.',
    websiteName: 'PitchMonster',
    websiteUrl: 'https://www.pitchmonster.io/',
    keyFeatures: ['Playbook-Based Scoring', 'Skill Gap Analysis', 'Manager Dashboards'],
    easeOfUse: 8.8,
    costTier: 4.0,
    marketShare: 28,
    targetSegment: 'SMB',
    tags: ['AI-Driven', 'Best for Onboarding', 'AI Role-Play', 'Objection Simulations']
  },

  // 2. Sales Readiness & Enablement Suites
  {
    id: 'mindtickle',
    number: 4,
    name: 'Mindtickle',
    category: 'Enablement',
    categoryGroup: 'Sales Readiness & Enablement Suites',
    bestFor: 'Enterprise sales readiness and data-driven skill tracking.',
    description: 'Comprehensive readiness platform featuring call intelligence, structured micro-learning, roleplays, and analytics tied directly to revenue metrics.',
    websiteName: 'Mindtickle',
    websiteUrl: 'https://www.mindtickle.com/',
    keyFeatures: ['Call Intelligence', 'Structured Micro-Learning', 'Revenue-Tied Analytics'],
    easeOfUse: 7.2,
    costTier: 8.5,
    marketShare: 72,
    targetSegment: 'Enterprise',
    tags: ['AI-Driven', 'Best for Onboarding', 'LMS / Onboarding', 'AI Role-Play', 'Enterprise Learning']
  },
  {
    id: 'allego',
    number: 5,
    name: 'Allego',
    category: 'Enablement',
    categoryGroup: 'Sales Readiness & Enablement Suites',
    bestFor: 'Video-based peer coaching and async training.',
    description: 'Video coaching, conversation intelligence, and just-in-time content sharing for distributed sales teams.',
    websiteName: 'Allego',
    websiteUrl: 'https://www.allego.com/',
    keyFeatures: ['Async Video Coaching', 'Conversation Intelligence', 'Just-In-Time Content Sharing'],
    easeOfUse: 8.0,
    costTier: 7.0,
    marketShare: 64,
    targetSegment: 'Mid-Market',
    tags: ['AI-Driven', 'Video Coaching', 'Best for Onboarding', 'Conversation Intelligence']
  },
  {
    id: 'seismic',
    number: 6,
    name: 'Seismic (Lessonly)',
    category: 'Enablement',
    categoryGroup: 'Sales Readiness & Enablement Suites',
    bestFor: 'Large enterprise sales enablement and content management.',
    description: 'Integrates learning modules with real-time deal collateral, helping reps access training material inside their sales workflows.',
    websiteName: 'Seismic',
    websiteUrl: 'https://www.seismic.com/',
    keyFeatures: ['In-Workflow Learning Modules', 'Real-Time Deal Collateral', 'Enterprise Enablement'],
    easeOfUse: 7.4,
    costTier: 9.0,
    marketShare: 82,
    targetSegment: 'Enterprise',
    tags: ['CRM-Integrated', 'Best for Onboarding', 'Enterprise Learning', 'LMS / Onboarding']
  },
  {
    id: 'saleshood',
    number: 7,
    name: 'SalesHood',
    category: 'Enablement',
    categoryGroup: 'Sales Readiness & Enablement Suites',
    bestFor: 'Mid-market sales productivity and peer-to-peer coaching.',
    description: 'Fast implementation, automated manager coaching workflows, and guided sales plays designed to boost team productivity.',
    websiteName: 'SalesHood',
    websiteUrl: 'https://saleshood.com/',
    keyFeatures: ['Automated Manager Workflows', 'Guided Sales Plays', 'Fast Implementation'],
    easeOfUse: 8.1,
    costTier: 6.5,
    marketShare: 48,
    targetSegment: 'Mid-Market',
    tags: ['AI-Driven', 'Best for Onboarding', 'LMS / Onboarding', 'Peer Coaching']
  },
  {
    id: 'highspot',
    number: 8,
    name: 'Highspot',
    category: 'Enablement',
    categoryGroup: 'Sales Readiness & Enablement Suites',
    bestFor: 'Sales enablement, training content, coaching, and AI-powered guidance.',
    description: 'Highspot helps sales organizations organize enablement content, train sellers, coach teams, and measure sales effectiveness.',
    websiteName: 'Highspot',
    websiteUrl: 'https://www.highspot.com/',
    keyFeatures: ['Enablement Content Hub', 'AI-Powered Seller Guidance', 'Sales Effectiveness Analytics'],
    easeOfUse: 8.3,
    costTier: 8.0,
    marketShare: 78,
    targetSegment: 'Enterprise',
    tags: ['AI-Driven', 'CRM-Integrated', 'Enterprise Learning']
  },
  {
    id: 'bigtincan',
    number: 9,
    name: 'Bigtincan Readiness',
    formerName: 'Brainshark',
    category: 'Enablement',
    categoryGroup: 'Sales Readiness & Enablement Suites',
    bestFor: 'Sales readiness, centralized training, coaching, and certification.',
    description: 'Bigtincan Readiness provides a centralized environment for preparing and developing customer-facing teams with learning, scorecards, and content.',
    websiteName: 'Bigtincan',
    websiteUrl: 'https://www.bigtincan.com/',
    keyFeatures: ['Centralized Readiness Environment', 'Video Practice Scoring', 'Content & Certification'],
    easeOfUse: 7.3,
    costTier: 7.5,
    marketShare: 66,
    targetSegment: 'Enterprise',
    tags: ['Best for Onboarding', 'LMS / Onboarding', 'Video Scoring']
  },

  // 3. Corporate LMS & Onboarding Software
  {
    id: '360learning',
    number: 10,
    name: '360Learning',
    category: 'LMS',
    categoryGroup: 'Corporate LMS & Onboarding Software',
    bestFor: 'Collaborative, peer-authored training courses.',
    description: 'Allows internal top performers to easily co-author training materials, battle cards, and quizzes through collaborative peer learning.',
    websiteName: '360Learning',
    websiteUrl: 'https://360learning.com/',
    keyFeatures: ['Peer-Co-Authored Courses', 'Battle Cards & Quizzes', 'Collaborative Learning Paths'],
    easeOfUse: 8.9,
    costTier: 5.0,
    marketShare: 45,
    targetSegment: 'Mid-Market',
    tags: ['LMS / Onboarding', 'Best for Onboarding', 'Peer Coaching']
  },
  {
    id: 'talentlms',
    number: 11,
    name: 'TalentLMS',
    category: 'LMS',
    categoryGroup: 'Corporate LMS & Onboarding Software',
    bestFor: 'Budget-friendly, structured onboarding.',
    description: 'Pre-built course libraries, custom competency badges, and gamified learning paths designed for rapid onboarding.',
    websiteName: 'TalentLMS',
    websiteUrl: 'https://www.talentlms.com/',
    keyFeatures: ['Pre-built Course Libraries', 'Custom Competency Badges', 'Gamified Learning Paths'],
    easeOfUse: 9.1,
    costTier: 3.0,
    marketShare: 52,
    targetSegment: 'SMB',
    tags: ['LMS / Onboarding', 'Best for Onboarding', 'Gamification']
  },
  {
    id: 'skyprep',
    number: 12,
    name: 'SkyPrep',
    category: 'LMS',
    categoryGroup: 'Corporate LMS & Onboarding Software',
    bestFor: 'Automated onboarding logistics and compliance tracking.',
    description: 'Automated distance learning paths, simple course authoring, and workflow automation for seamless employee onboarding.',
    websiteName: 'SkyPrep',
    websiteUrl: 'https://skyprep.com/',
    keyFeatures: ['Automated Distance Learning', 'Simple Course Authoring', 'Compliance Workflow Tracking'],
    easeOfUse: 8.6,
    costTier: 4.5,
    marketShare: 35,
    targetSegment: 'SMB',
    tags: ['LMS / Onboarding', 'Best for Onboarding', 'Compliance Tracking']
  },
  {
    id: 'ispring',
    number: 13,
    name: 'iSpring Learn',
    category: 'LMS',
    categoryGroup: 'Corporate LMS & Onboarding Software',
    bestFor: 'Scalable corporate eLearning.',
    description: 'Rapid content creation, 360-degree performance appraisal, and detailed reporting for corporate training and skill development.',
    websiteName: 'iSpring Solutions',
    websiteUrl: 'https://www.ispringsolutions.com/',
    keyFeatures: ['Rapid Content Creation', '360-Degree Performance Appraisal', 'Detailed Analytics Reporting'],
    easeOfUse: 8.8,
    costTier: 4.0,
    marketShare: 40,
    targetSegment: 'Mid-Market',
    tags: ['LMS / Onboarding', 'Best for Onboarding', 'eLearning']
  },
  {
    id: 'docebo',
    number: 14,
    name: 'Docebo',
    category: 'LMS',
    categoryGroup: 'Corporate LMS & Onboarding Software',
    bestFor: 'Enterprise learning and sales training programs.',
    description: 'Docebo is particularly useful for organizations that need a broader learning platform supporting sales training, onboarding, certification, and employee development.',
    websiteName: 'Docebo',
    websiteUrl: 'https://www.docebo.com/',
    keyFeatures: ['Enterprise eLearning Platform', 'AI Learning Personalization', 'Onboarding & Certification'],
    easeOfUse: 7.0,
    costTier: 8.5,
    marketShare: 76,
    targetSegment: 'Enterprise',
    tags: ['AI-Driven', 'Best for Onboarding', 'LMS / Onboarding', 'Enterprise Learning']
  },

  // 4. AI Conversation Intelligence & Sales Coaching
  {
    id: 'gong',
    number: 15,
    name: 'Gong',
    category: 'AI Conversation Intelligence',
    categoryGroup: 'AI Conversation Intelligence & Sales Coaching',
    bestFor: 'AI-powered sales coaching, conversation intelligence, and performance insights.',
    description: 'Gong combines real customer-conversation data with AI-powered coaching, training, scorecards, and performance analytics to support revenue leaders.',
    websiteName: 'Gong',
    websiteUrl: 'https://www.gong.io/sales-training-software/',
    keyFeatures: ['Customer Conversation Intelligence', 'AI Coaching Scorecards', 'Performance Analytics & Risk Signals'],
    easeOfUse: 7.8,
    costTier: 9.0,
    marketShare: 88,
    targetSegment: 'Enterprise',
    tags: ['AI-Driven', 'CRM-Integrated', 'Conversation Intelligence', 'Call Recording', 'Deal Intelligence']
  },
  {
    id: 'chorus',
    number: 16,
    name: 'Chorus by ZoomInfo',
    category: 'AI Conversation Intelligence',
    categoryGroup: 'AI Conversation Intelligence & Sales Coaching',
    bestFor: 'Capturing and analyzing customer engagement within sales conversations.',
    description: 'Chorus provides conversation intelligence and sales-performance analysis, helping organizations understand customer interactions and sales calls.',
    websiteName: 'Chorus by ZoomInfo',
    websiteUrl: 'https://zoominfo.com',
    keyFeatures: ['ZoomInfo Intelligence Integration', 'Customer Sentiment Analysis', 'Deal Risk Signals'],
    easeOfUse: 7.8,
    costTier: 8.5,
    marketShare: 84,
    targetSegment: 'Enterprise',
    tags: ['AI-Driven', 'CRM-Integrated', 'Conversation Intelligence', 'Call Recording']
  },
  {
    id: 'attention',
    number: 17,
    name: 'Attention',
    category: 'Real-Time Sales Assistance',
    categoryGroup: 'AI Conversation Intelligence & Sales Coaching',
    bestFor: 'Following sales methodologies and handling objections.',
    description: 'Attention focuses on sales conversations, helping teams improve how representatives conduct and manage customer interactions with real-time process adherence.',
    websiteName: 'Attention',
    websiteUrl: 'https://attention.tech',
    keyFeatures: ['Methodology Compliance', 'Real-Time Objection Assist', 'Conversation Workflow'],
    easeOfUse: 8.2,
    costTier: 6.0,
    marketShare: 32,
    targetSegment: 'Mid-Market',
    tags: ['AI-Driven', 'CRM-Integrated', 'Real-Time Guidance', 'Objection Simulations']
  },
  {
    id: 'balto',
    number: 18,
    name: 'Balto',
    category: 'Real-Time Sales Assistance',
    categoryGroup: 'AI Conversation Intelligence & Sales Coaching',
    bestFor: 'Real-time guidance and behavioral improvement in sales and contact-center conversations.',
    description: 'Balto focuses on real-time assistance during customer conversations, helping representatives follow approved processes, messaging, and guidance while interacting with customers.',
    websiteName: 'Balto',
    websiteUrl: 'https://balto.ai',
    keyFeatures: ['Real-Time Prompting', 'Contact Center Assist', 'Compliance Checklist'],
    easeOfUse: 8.6,
    costTier: 7.0,
    marketShare: 58,
    targetSegment: 'Enterprise',
    tags: ['AI-Driven', 'Real-Time Guidance', 'Contact Center Assist']
  },
  {
    id: 'salescreen',
    number: 19,
    name: 'SalesScreen',
    category: 'Sales Performance & Gamification',
    categoryGroup: 'Sales Readiness & Enablement Suites',
    bestFor: 'Gamification of sales coaching and training.',
    description: 'SalesScreen combines sales performance data, coaching workflows, scorecards, and gamification to help managers motivate and coach sales representatives.',
    websiteName: 'SalesScreen',
    websiteUrl: 'https://salescreen.com',
    keyFeatures: ['Sales Gamification', 'Data-Driven Scorecards', 'Structured Coaching Sessions'],
    easeOfUse: 8.5,
    costTier: 5.0,
    marketShare: 45,
    targetSegment: 'Mid-Market',
    tags: ['CRM-Integrated', 'Gamification', 'Scorecards', 'Performance Management']
  },

  // 5. CRM & Revenue Intelligence
  {
    id: 'salesforce',
    number: 20,
    name: 'Salesforce Sales Cloud / Agentforce Sales',
    category: 'CRM & Revenue Intelligence',
    categoryGroup: 'CRM, Revenue Intelligence & Sales Management',
    bestFor: 'Enterprises seeking a comprehensive AI-powered sales platform.',
    description: 'Salesforce Sales Cloud (now Agentforce Sales) provides CRM, opportunity management, sales engagement, analytics, forecasting, automation, and AI capabilities.',
    websiteName: 'Salesforce Sales',
    websiteUrl: 'https://salesforce.com',
    keyFeatures: ['Agentforce Autonomous AI', 'Global CRM Engine', 'Pipeline Automation'],
    easeOfUse: 6.2,
    costTier: 9.5,
    marketShare: 96,
    targetSegment: 'Enterprise',
    tags: ['AI-Driven', 'CRM-Integrated', 'Salesforce Native', 'Forecasting']
  },
  {
    id: 'hubspot',
    number: 21,
    name: 'HubSpot Sales Hub',
    category: 'CRM & Revenue Intelligence',
    categoryGroup: 'CRM, Revenue Intelligence & Sales Management',
    bestFor: 'Organizations seeking sales enablement integrated with CRM customer data.',
    description: 'HubSpot Sales Hub provides tools for managing contacts, deals, sales activities, automation, reporting, and sales productivity.',
    websiteName: 'HubSpot Sales Hub',
    websiteUrl: 'https://hubspot.com',
    keyFeatures: ['Inbound CRM', 'Sales Automation Workflows', 'Pipeline Management'],
    easeOfUse: 9.0,
    costTier: 6.5,
    marketShare: 91,
    targetSegment: 'SMB',
    tags: ['CRM-Integrated', 'Inbound CRM', 'Sales Automation']
  },
  {
    id: 'clari',
    number: 22,
    name: 'Clari',
    category: 'CRM & Revenue Intelligence',
    categoryGroup: 'CRM, Revenue Intelligence & Sales Management',
    bestFor: 'Revenue operations, forecasting, pipeline management, and AI-powered revenue intelligence.',
    description: 'Clari helps revenue organizations manage pipeline, forecasting, sales activity, and revenue operations.',
    websiteName: 'Clari',
    websiteUrl: 'https://clari.com',
    keyFeatures: ['RevOps Engine', 'Forecast Precision', 'Activity Inspection'],
    easeOfUse: 7.5,
    costTier: 9.0,
    marketShare: 79,
    targetSegment: 'Enterprise',
    tags: ['AI-Driven', 'CRM-Integrated', 'RevOps Intelligence', 'Forecasting']
  },
  {
    id: 'jiminny',
    number: 23,
    name: 'Jiminny',
    category: 'AI Conversation Intelligence',
    categoryGroup: 'AI Conversation Intelligence & Sales Coaching',
    bestFor: 'AI-driven conversational insights from customer interactions.',
    description: 'Jiminny uses conversation intelligence, AI feedback, coaching scorecards, performance metrics, and CRM integrations to help sales leaders identify coaching opportunities.',
    websiteName: 'Jiminny',
    websiteUrl: 'https://jiminny.com',
    keyFeatures: ['AI Coaching Scorecards', 'Talk/Listen Analytics', 'CRM Auto-Sync'],
    easeOfUse: 8.4,
    costTier: 6.5,
    marketShare: 42,
    targetSegment: 'Mid-Market',
    tags: ['AI-Driven', 'CRM-Integrated', 'Conversation Intelligence', 'Call Recording']
  },
  {
    id: 'salesloft',
    number: 24,
    name: 'Salesloft',
    category: 'AI Conversation Intelligence',
    categoryGroup: 'AI Conversation Intelligence & Sales Coaching',
    bestFor: 'AI-driven coaching insights and revenue engagement.',
    description: 'Salesloft\'s coaching capabilities use sales activity and customer-interaction information to help managers identify coachable moments and seller performance.',
    websiteName: 'Salesloft',
    websiteUrl: 'https://salesloft.com',
    keyFeatures: ['Revenue Engagement', 'Coachability Moments', 'Pipeline Cadences'],
    easeOfUse: 7.6,
    costTier: 8.0,
    marketShare: 81,
    targetSegment: 'Enterprise',
    tags: ['AI-Driven', 'CRM-Integrated', 'Conversation Intelligence']
  },
  {
    id: 'smartwinnr',
    number: 25,
    name: 'SmartWinnr',
    category: 'Sales Performance & Gamification',
    categoryGroup: 'Sales Readiness & Enablement Suites',
    bestFor: 'Field coaching, video coaching, practice, and sales performance.',
    description: 'SmartWinnr provides structured coaching, video-based assessments, competency frameworks, feedback, and gamification.',
    websiteName: 'SmartWinnr',
    websiteUrl: 'https://smartwinnr.com',
    keyFeatures: ['Video Coaching', 'Field Assessment', 'Script & Pitch Practice'],
    easeOfUse: 8.0,
    costTier: 5.5,
    marketShare: 35,
    targetSegment: 'Mid-Market',
    tags: ['Best for Onboarding', 'Gamification', 'AI Role-Play']
  }
];

export const ALL_AVAILABLE_TAGS = [
  'Best for Onboarding',
  'CRM-Integrated',
  'AI-Driven',
  'AI Role-Play',
  'Conversation Intelligence',
  'Call Recording',
  'Real-Time Guidance',
  'Gamification',
  'Salesforce Native',
  'LMS / Onboarding',
  'Forecasting',
  'CRM Auto-Sync',
  'Objection Simulations',
  'RevOps Intelligence',
  'Deal Intelligence'
];

export const CORE_CAPABILITIES = [
  {
    title: 'Knowledge Base',
    icon: BookOpen,
    desc: 'Centralize sales knowledge, product information, playbooks, scripts, FAQs, competitive intelligence, and best practices.'
  },
  {
    title: 'AI-Powered Recommendations',
    icon: Sparkles,
    desc: 'Generate intelligent recommendations based on sales activity, customer conversations, deal information, and representative performance.'
  },
  {
    title: 'Call Recording & Transcription',
    icon: Play,
    desc: 'Record, transcribe, organize, and review sales conversations for coaching and performance analysis.'
  },
  {
    title: 'AI-Driven Coaching & Feedback',
    icon: Zap,
    desc: 'Identify coaching opportunities, objection-handling weaknesses, communication patterns, and areas where representatives can improve.'
  },
  {
    title: 'CRM & Sales Tool Integration',
    icon: Layers,
    desc: 'Connect sales coaching information with CRM platforms and other sales technologies.'
  },
  {
    title: 'Reporting & Analytics',
    icon: BarChart3,
    desc: 'Monitor sales performance, coaching progress, conversation trends, pipeline health, and team development.'
  },
  {
    title: 'Buyer Sentiment Analysis',
    icon: MessageSquare,
    desc: 'Identify signals in customer conversations that may indicate interest, hesitation, objections, or purchase intent.'
  },
  {
    title: 'Deal Intelligence',
    icon: Target,
    desc: 'Help managers understand deal health, potential risks, next steps, and opportunities for intervention.'
  },
  {
    title: 'Sales Readiness',
    icon: Award,
    desc: 'Support onboarding, training, role-play, continuous learning, and representative development.'
  },
  {
    title: 'Performance Management',
    icon: TrendingUp,
    desc: 'Track individual and team progress using measurable sales-performance indicators.'
  }
];

export const BENEFITS = [
  {
    num: 1,
    title: 'Faster Skill Development',
    desc: 'AI-powered training, role-playing, conversation analysis, and real-time coaching can help representatives identify weaknesses and develop important selling skills faster.'
  },
  {
    num: 2,
    title: 'Consistent & Scalable Coaching',
    desc: 'Standardized coaching frameworks allow organizations to provide consistent training and performance expectations across departments, locations, and sales teams.'
  },
  {
    num: 3,
    title: 'Data-Driven Insights',
    desc: 'Sales analytics can help managers identify performance trends, skill gaps, deal risks, and coaching opportunities using measurable information rather than intuition alone.'
  },
  {
    num: 4,
    title: 'Improved Sales Readiness',
    desc: 'Sales representatives can practice pitches, improve objection handling, learn products, study successful conversations, and prepare for customer interactions.'
  },
  {
    num: 5,
    title: 'Better Manager Productivity',
    desc: 'Instead of manually reviewing every interaction, managers can use AI-generated insights and performance indicators to identify conversations and behaviors that require attention.'
  },
  {
    num: 6,
    title: 'Continuous Learning',
    desc: 'Sales coaching software can create an ongoing learning environment in which representatives receive feedback, practice skills, and continuously improve.'
  }
];

export const HOW_TO_CHOOSE_ITEMS = [
  { num: 1, title: 'Coaching Objective', desc: 'Determine whether the primary objective is onboarding, sales training, conversation intelligence, real-time coaching, performance management, or revenue intelligence.' },
  { num: 2, title: 'AI Capabilities', desc: 'Evaluate whether the platform provides useful AI recommendations, conversation analysis, sentiment analysis, automated summaries, coaching suggestions, and deal intelligence.' },
  { num: 3, title: 'CRM Integration', desc: "Check compatibility with the organization's existing CRM and sales technology stack." },
  { num: 4, title: 'Call Recording & Transcription', desc: 'For conversation-based coaching, determine whether the platform can record, transcribe, search, analyze, and organize calls.' },
  { num: 5, title: 'Training & Role-Playing', desc: 'Look for interactive training, simulations, role-playing, assessments, certifications, and practice environments.' },
  { num: 6, title: 'Analytics & Reporting', desc: 'Managers should be able to measure individual and team performance, identify skill gaps, and track coaching progress.' },
  { num: 7, title: 'Scalability', desc: "Choose a platform that can support the organization's current team while allowing future growth." },
  { num: 8, title: 'Security & Compliance', desc: 'Organizations should evaluate data protection, access controls, privacy, compliance requirements, and information-security practices.' },
  { num: 9, title: 'Ease of Use', desc: 'A powerful platform is less valuable if representatives and managers do not use it consistently.' },
  { num: 10, title: 'Total Cost of Ownership', desc: 'Consider subscription costs, implementation, integrations, training, administration, and ongoing support.' }
];

export const FAQS = [
  {
    q: 'What is sales coaching software?',
    a: 'It is software that helps sales organizations train, coach, monitor, and improve sales representatives using training content, analytics, conversation intelligence, AI, feedback, and performance data.'
  },
  {
    q: 'Can AI coach sales representatives?',
    a: 'AI can provide automated feedback, identify conversation patterns, recommend improvements, analyze sales calls, and generate coaching suggestions. Human managers remain important for judgment, mentorship, and complex coaching.'
  },
  {
    q: 'Can sales coaching software record calls?',
    a: 'Many conversation-intelligence platforms provide call recording and transcription, subject to applicable laws, company policies, customer consent requirements, and platform configuration.'
  },
  {
    q: 'Can sales coaching software integrate with CRM systems?',
    a: 'Many modern platforms integrate with CRM systems such as Salesforce and HubSpot. Integration capabilities vary by provider and subscription level.'
  },
  {
    q: 'Does sales coaching software help new employees?',
    a: 'Yes. Training modules, playbooks, simulations, role-playing, assessments, knowledge bases, and guided coaching can accelerate onboarding and sales readiness.'
  },
  {
    q: 'Can sales coaching software identify weak sales skills?',
    a: 'AI and analytics can identify patterns associated with areas such as objection handling, discovery, talk/listen balance, messaging, follow-up, and other measurable conversation or performance indicators.'
  },
  {
    q: 'What is the difference between sales coaching and sales enablement?',
    a: 'Sales coaching focuses primarily on improving individual and team selling skills through feedback, practice, and performance development. Sales enablement is broader and may include training, content, processes, tools, knowledge, and resources that help representatives perform their jobs.'
  },
  {
    q: 'What should a company consider before buying sales coaching software?',
    a: 'Consider the company\'s coaching goals, AI capabilities, integrations, security, reporting, training features, scalability, ease of use, implementation requirements, and total cost.'
  }
];

interface SalesSoftwareDirectoryProps {
  onRunCoachingSession?: () => void;
  onOpenPdfReport?: () => void;
  isDarkMode?: boolean;
}

export const SalesSoftwareDirectory: React.FC<SalesSoftwareDirectoryProps> = ({
  onRunCoachingSession,
  onOpenPdfReport,
  isDarkMode = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showTourModal, setShowTourModal] = useState<boolean>(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [selectedToolForCompare, setSelectedToolForCompare] = useState<SoftwareTool | null>(null);
  const [selectedToolForDetails, setSelectedToolForDetails] = useState<SoftwareTool | null>(null);

  // Favorites state with localStorage persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_sales_coaching_tools');
      return saved ? JSON.parse(saved) : ['gong', 'pitchmonster', 'salescreen'];
    } catch {
      return ['gong', 'pitchmonster', 'salescreen'];
    }
  });

  // Tag-based filter sidebar states
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceTierFilter, setPriceTierFilter] = useState<string>('all');
  const [showFilterSidebar, setShowFilterSidebar] = useState<boolean>(true);

  // User Profile Data for AI Match Calculation
  const [userProfile, setUserProfile] = useState<{
    industry: string;
    teamSize: string;
    coachingGoal: string;
  }>({
    industry: 'B2B SaaS / Tech',
    teamSize: 'Enterprise (100+ Reps)',
    coachingGoal: 'AI Conversation Intelligence'
  });

  const [showEfficiencyThreshold, setShowEfficiencyThreshold] = useState<boolean>(true);
  const [showOnlyAiMatches, setShowOnlyAiMatches] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Compute AI Match scores based on user profile alignment
  const aiMatchScores = useMemo(() => {
    const scores: Record<string, number> = {};
    SOFTWARE_TOOLS.forEach((tool) => {
      let score = 62; // Base match score

      // Segment alignment
      if (userProfile.teamSize.includes('Enterprise') && tool.targetSegment === 'Enterprise') score += 16;
      else if (userProfile.teamSize.includes('Mid-Market') && tool.targetSegment === 'Mid-Market') score += 16;
      else if (userProfile.teamSize.includes('SMB') && tool.targetSegment === 'SMB') score += 16;
      else if (tool.targetSegment === 'Enterprise' || tool.targetSegment === 'Mid-Market') score += 8;

      // Category alignment with Coaching Goal
      if (userProfile.coachingGoal.includes('Conversation') && tool.category === 'AI Conversation Intelligence') score += 18;
      if (userProfile.coachingGoal.includes('Onboarding') && tool.category === 'Sales Training & Readiness') score += 18;
      if (userProfile.coachingGoal.includes('Real-Time') && tool.category === 'Real-Time Sales Assistance') score += 18;
      if (userProfile.coachingGoal.includes('CRM') && tool.category === 'CRM & Revenue Intelligence') score += 18;

      // High Ease & Market Share boost
      if ((tool.easeOfUse || 7.5) >= 8.2) score += 6;
      if ((tool.marketShare || 20) >= 65) score += 4;

      // Clamp score between 55% and 98%
      scores[tool.id] = Math.min(98, Math.max(55, score));
    });
    return scores;
  }, [userProfile]);

  const handleToggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId];
      try {
        localStorage.setItem('saved_sales_coaching_tools', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save favorites to localStorage:', err);
      }
      return next;
    });
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedSegment('all');
    setSelectedTags([]);
    setPriceTierFilter('all');
  };

  // Filter tools based on category, search query, favorites, segment & tags
  const filteredTools = useMemo(() => {
    return SOFTWARE_TOOLS.filter((tool) => {
      // 1. Saved / Favorites Tab
      if (selectedCategory === 'saved' && !favorites.includes(tool.id)) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory === 'conv-intel' && tool.category !== 'AI Conversation Intelligence') return false;
      if (selectedCategory === 'readiness' && tool.category !== 'Sales Training & Readiness') return false;
      if (selectedCategory === 'gamification' && tool.category !== 'Sales Performance & Gamification') return false;
      if (selectedCategory === 'realtime' && tool.category !== 'Real-Time Sales Assistance') return false;
      if (selectedCategory === 'crm-rev' && tool.category !== 'CRM & Revenue Intelligence') return false;
      if (selectedCategory === 'salesforce' && tool.category !== 'Sales Coaching for Salesforce') return false;

      // 3. Target Segment Filter
      if (selectedSegment !== 'all' && tool.targetSegment !== selectedSegment) {
        return false;
      }

      // 4. Price Tier Filter
      if (priceTierFilter === 'low' && (tool.costTier || 5) > 4.5) return false;
      if (priceTierFilter === 'mid' && ((tool.costTier || 5) < 4.5 || (tool.costTier || 5) > 7.5)) return false;
      if (priceTierFilter === 'high' && (tool.costTier || 5) < 7.5) return false;

      // 5. Selected Tags Filter (Must match all selected tags)
      if (selectedTags.length > 0) {
        const toolTags = tool.tags || [];
        const hasAllTags = selectedTags.every((st) => toolTags.includes(st));
        if (!hasAllTags) return false;
      }

      // 6. Text query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.bestFor.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.keyFeatures.some((f) => f.toLowerCase().includes(q)) ||
        (tool.tags && tool.tags.some((t) => t.toLowerCase().includes(q)))
      );
    });
  }, [selectedCategory, searchQuery, favorites, selectedSegment, priceTierFilter, selectedTags]);

  const categoryTabs = [
    { id: 'all', label: `All Tools (${SOFTWARE_TOOLS.length})` },
    { id: 'saved', label: `⭐ Saved Tools (${favorites.length})` },
    { id: 'd3matrix', label: '📊 D3 Cost vs. Ease Chart' },
    { id: 'platform', label: 'AI Coaching Engine' },
    { id: 'conv-intel', label: 'Conversation Intel' },
    { id: 'readiness', label: 'Training & Readiness' },
    { id: 'gamification', label: 'Gamification' },
    { id: 'realtime', label: 'Real-Time Assist' },
    { id: 'crm-rev', label: 'CRM & RevOps' },
    { id: 'salesforce', label: 'Salesforce Native' }
  ];

  const activeFilterCount =
    (selectedSegment !== 'all' ? 1 : 0) +
    (priceTierFilter !== 'all' ? 1 : 0) +
    selectedTags.length +
    (searchQuery ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HERO COMMAND CENTRE BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#800000] via-[#5c0000] to-slate-900 text-white p-6 sm:p-8 shadow-xl border-2 border-[#A8C66C]">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#A8C66C]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#A8C66C] text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Intelligent Command Centre
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/20">
              Interactive D3 Analytics & Saved Tools Suite
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Your Intelligent Command Centre for Sales Performance
          </h2>

          <div className="text-sm sm:text-base text-slate-200 leading-relaxed space-y-3 font-normal">
            <p className="font-semibold text-emerald-300 text-lg">
              AI-Powered Sales Coaching Platform
            </p>
            <p>
              The AI-Powered Sales Coaching Platform is an intelligent sales-performance platform designed to help sales teams analyze customer interactions, uncover deal insights, improve representative performance, and support data-backed decision-making.
            </p>
            <p className="text-slate-300 text-xs sm:text-sm">
              The platform uses artificial intelligence and machine learning to capture and analyze sales calls, emails, meetings, customer conversations, and sales activities. It helps sales leaders and representatives identify buyer sentiment, deal health, coaching opportunities, pipeline risks, skill gaps, and opportunities for improvement.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowTourModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#A8C66C] text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-[#b8d67c] transition-all flex items-center gap-2 shadow-lg hover:scale-105"
            >
              <Compass className="w-4 h-4" />
              <span>TAKE A TOUR</span>
            </button>

            <button
              onClick={() => setSelectedCategory('d3matrix')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-md border border-blue-400"
            >
              <PieChart className="w-4 h-4 text-emerald-300" />
              <span>Interactive D3 Cost vs. Ease Chart</span>
            </button>

            {onRunCoachingSession && (
              <button
                onClick={onRunCoachingSession}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 border border-white/20"
              >
                <Play className="w-4 h-4 text-[#A8C66C]" />
                <span>Launch Live AI Coaching Engine</span>
              </button>
            )}

            <button
              onClick={() => {
                const el = document.getElementById('coaching-efficiency-guide-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-[#800000] hover:bg-[#600000] text-white font-extrabold text-xs transition-all flex items-center gap-2 border border-[#A8C66C] shadow-md cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#A8C66C]" />
              <span>Coaching Efficiency Guide (Gemini Stack)</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('available-software-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white underline underline-offset-4"
            >
              Browse 22 Sales Coaching Software Platforms ↓
            </button>
          </div>
        </div>
      </div>

      {/* 1.5. SYNTHESIZED PLATFORM CAPABILITIES & COACHING EFFICIENCY GUIDE */}
      <div id="coaching-efficiency-guide-section">
        <CoachingEfficiencyGuide />
      </div>

      {/* 2. D3 VALUE MATRIX CHART SECTION */}
      <div id="d3-matrix-section" className="space-y-4">
        {/* AI Match Profile Quick Config Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-2 border-emerald-500/40 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center font-black text-sm">
                🎯
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>AI Profile Alignment & Recommendation Engine</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black">
                    Live Strategic Matching
                  </span>
                </h4>
                <p className="text-xs text-slate-300">
                  Highlighting tools on the D3 scatter plot that best fit your organization's domain and scale.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5 self-start sm:self-auto transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Done Customizing' : 'Customize Team Profile'}</span>
            </button>
          </div>

          {/* Active Profile Pills / Editor */}
          {isEditingProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs animate-in fade-in duration-150">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Industry Sector</label>
                <select
                  value={userProfile.industry}
                  onChange={(e) => setUserProfile({ ...userProfile, industry: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="B2B SaaS / Tech">B2B SaaS / Tech</option>
                  <option value="Financial Services & Banking">Financial Services & Banking</option>
                  <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                  <option value="Consumer & Industrial">Consumer & Industrial</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Team Size & Segment</label>
                <select
                  value={userProfile.teamSize}
                  onChange={(e) => setUserProfile({ ...userProfile, teamSize: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="Enterprise (100+ Reps)">Enterprise (100+ Reps)</option>
                  <option value="Mid-Market (20-100 Reps)">Mid-Market (20-100 Reps)</option>
                  <option value="SMB (1-20 Reps)">SMB (1-20 Reps)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Primary Coaching Goal</label>
                <select
                  value={userProfile.coachingGoal}
                  onChange={(e) => setUserProfile({ ...userProfile, coachingGoal: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="AI Conversation Intelligence">AI Conversation Intelligence</option>
                  <option value="Onboarding & Readiness">Onboarding & Readiness</option>
                  <option value="Real-Time Assist">Real-Time Assist</option>
                  <option value="CRM Automation & Forecasting">CRM Automation & Forecasting</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold">Current Target Profile:</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-emerald-300 font-extrabold flex items-center gap-1">
                <span>🏢 {userProfile.industry}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-300 font-extrabold flex items-center gap-1">
                <span>👥 {userProfile.teamSize}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-cyan-300 font-extrabold flex items-center gap-1">
                <span>🎯 Goal: {userProfile.coachingGoal}</span>
              </span>
            </div>
          )}
        </div>

        <SalesToolsD3Chart
          tools={filteredTools}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onSelectTool={(tool) => {
            setSelectedToolForDetails(tool);
          }}
          isDarkMode={isDarkMode}
          aiMatchScores={aiMatchScores}
          showEfficiencyThreshold={showEfficiencyThreshold}
          onToggleEfficiencyThreshold={() => setShowEfficiencyThreshold((prev) => !prev)}
          showOnlyAiMatches={showOnlyAiMatches}
          onToggleShowOnlyAiMatches={() => setShowOnlyAiMatches((prev) => !prev)}
        />
      </div>

      {/* 3. CORE CAPABILITIES (10 ITEMS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#800000] dark:text-red-400" />
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Core Capabilities
            </h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F3F8EA] text-[#8BA854] dark:bg-slate-800 dark:text-[#A8C66C] border border-[#A8C66C]">
            10 Platform Pillars
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {CORE_CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#A8C66C] transition-all space-y-2 shadow-xs group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F3F8EA] dark:bg-slate-800 text-[#800000] dark:text-red-400 flex items-center justify-center shrink-0 border border-[#A8C66C] group-hover:bg-[#800000] group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 leading-tight">
                  {cap.title}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                  {cap.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. OPERATIONAL CATEGORIES RESEARCH GUIDE & BLOG REFERENCE */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#4a0000] text-white border-2 border-[#800000] space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800000]/80 text-[#A8C66C] border border-[#A8C66C]/40 text-xs font-black uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Research Guide & Industry Classification</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Modern Sales Training Software Operational Categories
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Modern sales training software generally falls into three main operational categories: AI Simulation & Practice, Sales Enablement & Readiness, and Learning Management Systems (LMS).
            </p>
          </div>

          <a
            href="https://kendo.ai/blogs/best-sales-training-software"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#A8C66C] text-slate-950 font-black text-xs hover:bg-[#b8d67c] transition-all flex items-center gap-2 shadow-lg shrink-0 border border-white/20"
          >
            <span>Read Full Kendo.ai Blog Guide</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* 3 Main Operational Categories Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category 1 */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#800000] text-[#A8C66C] flex items-center justify-center font-black text-sm border border-[#A8C66C]/30">
                1
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">AI Simulation & Practice</h4>
                <p className="text-[11px] text-slate-300">Real-time practice & automated pitch feedback</p>
              </div>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Tools focusing on buyer conversation simulations, voice roleplay, and scoring reps before live calls.
            </p>
            <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#A8C66C]">Exec</span>
                <a href="https://www.exec.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-0.5">exec.com <ExternalLink className="w-2.5 h-2.5" /></a>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#A8C66C]">Second Nature AI</span>
                <a href="https://secondnature.ai/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-0.5">secondnature.ai <ExternalLink className="w-2.5 h-2.5" /></a>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#A8C66C]">PitchMonster</span>
                <a href="https://www.pitchmonster.io/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-0.5">pitchmonster.io <ExternalLink className="w-2.5 h-2.5" /></a>
              </div>
            </div>
          </div>

          {/* Category 2 */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#800000] text-[#A8C66C] flex items-center justify-center font-black text-sm border border-[#A8C66C]/30">
                2
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Sales Readiness & Enablement</h4>
                <p className="text-[11px] text-slate-300">Continuous skill tracking & collateral</p>
              </div>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Platforms providing structured micro-learning, video coaching, and just-in-time deal collateral.
            </p>
            <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#A8C66C]">Mindtickle</span>
                <a href="https://www.mindtickle.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-0.5">mindtickle.com <ExternalLink className="w-2.5 h-2.5" /></a>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#A8C66C]">Allego</span>
                <a href="https://www.allego.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-0.5">allego.com <ExternalLink className="w-2.5 h-2.5" /></a>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#A8C66C]">Seismic (Lessonly)</span>
                <a href="https://www.seismic.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-0.5">seismic.com <ExternalLink className="w-2.5 h-2.5" /></a>
              </div>
            </div>
          </div>

          {/* Category 3 */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#800000] text-[#A8C66C] flex items-center justify-center font-black text-sm border border-[#A8C66C]/30">
                3
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Corporate LMS & Onboarding</h4>
                <p className="text-[11px] text-slate-300">Structured courses & employee paths</p>
              </div>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              LMS engines designed for onboarding logistics, course authoring, compliance, and enterprise eLearning.
            </p>
            <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#A8C66C]">360Learning</span>
                <a href="https://360learning.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-0.5">360learning.com <ExternalLink className="w-2.5 h-2.5" /></a>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#A8C66C]">TalentLMS</span>
                <a href="https://www.talentlms.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-0.5">talentlms.com <ExternalLink className="w-2.5 h-2.5" /></a>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#A8C66C]">SkyPrep</span>
                <a href="https://skyprep.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-0.5">skyprep.com <ExternalLink className="w-2.5 h-2.5" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. AVAILABLE SALES COACHING SOFTWARE DIRECTORY */}
      <div id="available-software-section" className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-6 h-6 text-[#800000] dark:text-red-400" />
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                AVAILABLE SALES COACHING SOFTWARE DIRECTORY
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filter by capability tags, target segment, or price tier. Click direct links to visit tool platforms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilterSidebar(!showFilterSidebar)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                showFilterSidebar
                  ? 'bg-[#800000] text-white border-[#800000]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Tag Sidebar</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools ('Gong', 'Role-Play')..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#800000]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category & Saved Tab Bar */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          {categoryTabs.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              {cat.id === 'saved' && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* TAG-BASED FILTER SIDEBAR */}
          {showFilterSidebar && (
            <div className="lg:col-span-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-5 shadow-xs shrink-0">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#800000] dark:text-red-400" />
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                    Filter by Tags
                  </h4>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Segment Filter */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Target Market Segment
                </label>
                <div className="flex flex-col gap-1 text-xs">
                  {['all', 'Enterprise', 'Mid-Market', 'SMB'].map((seg) => (
                    <button
                      key={seg}
                      onClick={() => setSelectedSegment(seg)}
                      className={`px-2.5 py-1.5 rounded-lg text-left font-bold transition-all flex items-center justify-between ${
                        selectedSegment === seg
                          ? 'bg-[#F3F8EA] text-[#800000] dark:bg-slate-800 dark:text-[#A8C66C] border border-[#A8C66C]'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{seg === 'all' ? 'All Segments' : seg}</span>
                      {selectedSegment === seg && <Check className="w-3.5 h-3.5 text-[#800000] dark:text-[#A8C66C]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Tier Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Investment Tier
                </label>
                <div className="flex flex-col gap-1 text-xs">
                  {[
                    { id: 'all', label: 'All Pricing Tiers' },
                    { id: 'low', label: 'Low Cost / Accessible ($)' },
                    { id: 'mid', label: 'Mid Tier ($$)' },
                    { id: 'high', label: 'Enterprise Premium ($$$)' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPriceTierFilter(p.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-left font-bold transition-all flex items-center justify-between ${
                        priceTierFilter === p.id
                          ? 'bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-400 border border-blue-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{p.label}</span>
                      {priceTierFilter === p.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Capability Tag Checkboxes */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Key Capabilities ({selectedTags.length} active)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_AVAILABLE_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-[#800000] text-white border-[#800000]'
                            : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#A8C66C]'
                        }`}
                      >
                        {isSelected ? <Check className="w-3 h-3 text-[#A8C66C]" /> : <span className="opacity-40">+</span>}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Saved Tools Counter Box */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-800 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>My Saved Tools ({favorites.length})</span>
                </div>
                <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80">
                  Bookmark tools to build your personalized comparison suite.
                </p>
                {favorites.length > 0 && (
                  <button
                    onClick={() => setSelectedCategory('saved')}
                    className="text-[11px] font-black text-amber-800 dark:text-amber-300 hover:underline pt-1 block"
                  >
                    View Saved Platforms →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SOFTWARE CARDS GRID */}
          <div className={showFilterSidebar ? 'lg:col-span-9 space-y-4' : 'lg:col-span-12 space-y-4'}>
            
            {/* Active Filters Bar */}
            {activeFilterCount > 0 && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-slate-500">Active Filters ({filteredTools.length} results):</span>
                  {selectedSegment !== 'all' && (
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold border border-slate-300">
                      Segment: {selectedSegment}
                    </span>
                  )}
                  {priceTierFilter !== 'all' && (
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-bold border border-blue-300">
                      Price: {priceTierFilter}
                    </span>
                  )}
                  {selectedTags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-[#800000] text-white font-bold flex items-center gap-1"
                    >
                      {t}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => handleToggleTag(t)} />
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleClearFilters}
                  className="font-bold text-red-600 dark:text-red-400 hover:underline text-[11px]"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Empty State for Saved Tools / No Results */}
            {filteredTools.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-slate-800 text-amber-500 flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 fill-amber-400" />
                </div>
                <h4 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                  {selectedCategory === 'saved' ? 'No Saved Tools Yet' : 'No Tools Match Selected Filters'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {selectedCategory === 'saved'
                    ? "Click the star icon on any software card below to bookmark it for quick access and comparison."
                    : "Try adjusting your tag filters, segment selection, or search query to find relevant software platforms."}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 rounded-xl bg-[#800000] text-white text-xs font-bold hover:bg-[#600000] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Grid of Tool Cards */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => {
                  const isFav = favorites.includes(tool.id);
                  return (
                    <div
                      key={tool.id}
                      id={`tool-card-${tool.id}`}
                      className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md group ${
                        isFav
                          ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-[#A8C66C] dark:hover:border-[#A8C66C]'
                      }`}
                    >
                      <div>
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div
                            className="flex items-center gap-2 cursor-pointer group/title"
                            onClick={() => setSelectedToolForDetails(tool)}
                          >
                            <span className="w-7 h-7 rounded-lg bg-[#800000] text-white text-xs font-black flex items-center justify-center shrink-0">
                              {tool.number}
                            </span>
                            <div>
                              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-tight group-hover/title:text-[#800000] dark:group-hover/title:text-[#A8C66C] transition-colors">
                                {tool.name}
                              </h4>
                              {tool.formerName && (
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block">
                                  Formerly: {tool.formerName}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Favorite Star Toggle Button */}
                          <button
                            onClick={() => handleToggleFavorite(tool.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isFav
                                ? 'bg-amber-400 text-slate-950 border-amber-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-700'
                            }`}
                            title={isFav ? 'Remove from saved' : 'Save tool to favorites'}
                          >
                            <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Category & Segment Badge */}
                        <div className="flex flex-wrap items-center gap-1 mb-2">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F3F8EA] dark:bg-slate-800 text-[#8BA854] dark:text-[#A8C66C] border border-[#A8C66C]">
                            {tool.category}
                          </span>
                          {tool.targetSegment && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                              {tool.targetSegment}
                            </span>
                          )}
                        </div>

                        {/* Best For Pill */}
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-2.5">
                          <span className="text-[10px] font-black uppercase text-[#800000] dark:text-red-400 block mb-0.5">
                            Best For:
                          </span>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {tool.bestFor}
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                          {tool.description}
                        </p>

                        {/* Ratings / Scores */}
                        <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[10px] mb-3">
                          <div>
                            <span className="text-slate-500 block font-semibold">Ease Score:</span>
                            <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                              {tool.easeOfUse || 7.5} / 10
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block font-semibold">Cost Tier:</span>
                            <strong className="text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                              Tier {tool.costTier || 5} / 10
                            </strong>
                          </div>
                        </div>

                        {/* Capability Tags */}
                        {tool.tags && tool.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {tool.tags.map((tg, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                              >
                                #{tg}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5 shrink-0">
                        <button
                          onClick={() => setSelectedToolForDetails(tool)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#800000] text-white text-xs font-bold hover:bg-[#600000] transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-[#A8C66C]" />
                          <span>Expand Details</span>
                        </button>

                        <a
                          href={tool.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
                          title={`Visit ${tool.websiteName} official website`}
                        >
                          <span>Visit Site</span>
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        </a>

                        <button
                          onClick={() => setSelectedToolForCompare(tool)}
                          className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#A8C66C] hover:text-slate-950 font-bold text-xs transition-colors"
                          title="Compare features with our AI Platform"
                        >
                          Compare
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. HOW TO CHOOSE THE BEST SALES COACHING TOOL */}
      <div id="section-choose" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#800000] dark:text-red-400" />
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase">
              HOW TO CHOOSE THE BEST SALES COACHING TOOL
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            10 Evaluation Criteria
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Before selecting a platform, organizations should evaluate the following key dimensions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {HOW_TO_CHOOSE_ITEMS.map((item) => (
            <div
              key={item.num}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#A8C66C] text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">
                  {item.num}
                </span>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                  {item.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. BOTTOM LINE & CONTINUOUS LEARNING LOOP */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#800000] text-white space-y-4 shadow-lg border border-[#A8C66C]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-[#A8C66C]" />
          <h3 className="text-xl font-black text-white uppercase tracking-wider">
            BOTTOM LINE: Making Sales Coaching as Smooth as Possible
          </h3>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
          Effective sales coaching should not depend entirely on occasional meetings or manual reviews. An intelligent sales coaching environment continuously connects:
        </p>

        {/* Process Pipeline Visual */}
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-black text-white text-center">
            <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">Customer Conversations</span>
            <span className="text-[#A8C66C]">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-[#A8C66C] text-slate-950">AI Analysis</span>
            <span className="text-[#A8C66C]">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">Performance Insights</span>
            <span className="text-[#A8C66C]">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-[#800000] border border-white/20">Coaching Recommendations</span>
            <span className="text-[#A8C66C]">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">Training</span>
            <span className="text-[#A8C66C]">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">Practice</span>
            <span className="text-[#A8C66C]">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">Measurement</span>
            <span className="text-[#A8C66C]">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-400 text-slate-950 font-extrabold">Improvement</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The goal is to give sales managers evidence-based information about where coaching is needed while giving sales representatives practical guidance they can apply immediately. Modern AI complements human sales leadership by summarizing interactions and surfacing risks while experienced managers provide mentorship and strategic judgment.
        </p>
      </div>

      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <div id="section-faqs" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#800000] dark:text-red-400" />
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase">
            FREQUENTLY ASKED QUESTIONS
          </h3>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between gap-2 font-bold text-xs text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#800000] dark:text-red-400 font-extrabold">Q:</span>
                    {faq.q}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* COMPARISON MODAL */}
      {selectedToolForCompare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#A8C66C] shadow-2xl overflow-hidden space-y-4 p-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-start justify-between border-b pb-3 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase text-[#800000] dark:text-red-400">
                  Feature Matrix Comparison
                </span>
                <h3 className="text-xl font-extrabold">
                  Our AI Platform vs. {selectedToolForCompare.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedToolForCompare(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Our Platform */}
              <div className="p-4 rounded-xl bg-[#F3F8EA] dark:bg-slate-800/90 border border-[#A8C66C] space-y-2">
                <span className="font-extrabold text-[#800000] dark:text-red-400 text-sm block">
                  AI-Powered Sales Coaching Platform (Our Platform)
                </span>
                <ul className="space-y-1.5 text-[11px] text-slate-800 dark:text-slate-200">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Live Real-Time Speech Analysis & Voice Pitch</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Grounded in Custom Playbooks & Objections</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Automated PDF Executive Coaching Reports</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Integrated Action Panel Simulation</li>
                </ul>
              </div>

              {/* Selected Tool */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm block">
                  {selectedToolForCompare.name}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {selectedToolForCompare.description}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <strong className="text-[10px] uppercase text-slate-400 block mb-1">Key Focus:</strong>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {selectedToolForCompare.bestFor}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={selectedToolForCompare.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#800000] dark:text-red-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Visit {selectedToolForCompare.websiteName} Official Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setSelectedToolForCompare(null)}
                className="px-4 py-2 rounded-xl bg-[#800000] text-white text-xs font-bold hover:bg-[#600000]"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOUR MODAL */}
      {showTourModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#A8C66C] shadow-2xl p-6 space-y-5 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-6 h-6 text-[#800000] dark:text-red-400" />
                <h3 className="text-xl font-black uppercase tracking-tight">
                  Guided Platform Tour
                </h3>
              </div>
              <button
                onClick={() => setShowTourModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F3F8EA] dark:bg-slate-800/80 border border-[#A8C66C] space-y-2">
                <div className="w-7 h-7 rounded-lg bg-[#800000] text-white font-bold flex items-center justify-center">1</div>
                <h4 className="font-extrabold text-sm text-[#800000] dark:text-red-400">Playbook Grounding</h4>
                <p className="text-slate-700 dark:text-slate-300">
                  Grounds coaching feedback directly into your organization's custom objection matrices and sales playbooks.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F3F8EA] dark:bg-slate-800/80 border border-[#A8C66C] space-y-2">
                <div className="w-7 h-7 rounded-lg bg-[#800000] text-white font-bold flex items-center justify-center">2</div>
                <h4 className="font-extrabold text-sm text-[#800000] dark:text-red-400">Action Panel Execution</h4>
                <p className="text-slate-700 dark:text-slate-300">
                  Simulate buyer objections, test response strategies, and receive live scored feedback.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F3F8EA] dark:bg-slate-800/80 border border-[#A8C66C] space-y-2">
                <div className="w-7 h-7 rounded-lg bg-[#800000] text-white font-bold flex items-center justify-center">3</div>
                <h4 className="font-extrabold text-sm text-[#800000] dark:text-red-400">Voice Pitch Speech Engine</h4>
                <p className="text-slate-700 dark:text-slate-300">
                  Analyze pitch pace, speech clarity, confidence markers, and filler-word frequency in real time.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#A8C66C] block">Ready to explore?</span>
                <p className="text-slate-300">Launch a coaching session or browse the 22 tools directory.</p>
              </div>
              <button
                onClick={() => setShowTourModal(false)}
                className="px-4 py-2 rounded-xl bg-[#A8C66C] text-slate-950 font-black hover:bg-[#b8d67c]"
              >
                Close & Explore →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPAND DETAILS MODAL */}
      {selectedToolForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#A8C66C] shadow-2xl overflow-hidden my-8 p-6 text-slate-900 dark:text-slate-100 space-y-6 max-h-[90vh] flex flex-col justify-between">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4 dark:border-slate-800 shrink-0">
              <div className="space-y-1.5 pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#800000] text-white text-xs font-black flex items-center justify-center shrink-0">
                    {selectedToolForDetails.number}
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#F3F8EA] dark:bg-slate-800 text-[#8BA854] dark:text-[#A8C66C] border border-[#A8C66C]">
                    {selectedToolForDetails.category}
                  </span>
                  {selectedToolForDetails.targetSegment && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                      {selectedToolForDetails.targetSegment}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>{selectedToolForDetails.name}</span>
                  {selectedToolForDetails.formerName && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      (Formerly {selectedToolForDetails.formerName})
                    </span>
                  )}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleFavorite(selectedToolForDetails.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    favorites.includes(selectedToolForDetails.id)
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-700'
                  }`}
                  title={favorites.includes(selectedToolForDetails.id) ? 'Remove from saved' : 'Save tool to favorites'}
                >
                  <Star className={`w-5 h-5 ${favorites.includes(selectedToolForDetails.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setSelectedToolForDetails(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="space-y-5 overflow-y-auto pr-1 flex-1">
              {/* Best For Callout */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#F3F8EA] to-emerald-50/50 dark:from-slate-800 dark:to-slate-800/80 border border-[#A8C66C] flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#800000] dark:text-[#A8C66C] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black uppercase text-[#800000] dark:text-red-400 block">
                    Ideal Primary Focus / Best For:
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {selectedToolForDetails.bestFor}
                  </p>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Full Platform Overview & Description
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                  {selectedToolForDetails.description}
                </div>
              </div>

              {/* Specific Benefits & Key Features */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Specific Capabilities & Core Benefits</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedToolForDetails.keyFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">
                          {feat}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {idx === 0
                            ? 'Delivers automated skill coaching and performance tracking.'
                            : idx === 1
                            ? 'Ensures team adherence to proven selling playbooks.'
                            : 'Optimizes rep time and buyer conversation outcomes.'}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">
                        Sales Onboarding & Representative Readiness
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Accelerates time-to-first-deal through structured practice and feedback loops.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">
                        Seamless Workflow & CRM Integration
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Synchronizes coaching scorecards directly into your sales CRM pipeline.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics & Ratings */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">Ease of Use Score</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {selectedToolForDetails.easeOfUse || 7.5} / 10
                  </span>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${((selectedToolForDetails.easeOfUse || 7.5) / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">Investment Tier</span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">
                    Tier {selectedToolForDetails.costTier || 5} / 10
                  </span>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${((selectedToolForDetails.costTier || 5) / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">Market Share</span>
                  <span className="text-base font-black text-cyan-600 dark:text-cyan-400">
                    {selectedToolForDetails.marketShare || 25}%
                  </span>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${selectedToolForDetails.marketShare || 25}%` }}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">AI Match Rating</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    🎯 {aiMatchScores[selectedToolForDetails.id] || 70}%
                  </span>
                  <span className="text-[10px] text-slate-400 block font-semibold">Matched to team profile</span>
                </div>
              </div>

              {/* Capability Tags */}
              {selectedToolForDetails.tags && selectedToolForDetails.tags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Tags & Specializations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedToolForDetails.tags.map((tg) => (
                      <span
                        key={tg}
                        className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        #{tg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Actions Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <a
                href={selectedToolForDetails.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700"
              >
                <span>Visit {selectedToolForDetails.websiteName} Official Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#800000] dark:text-[#A8C66C]" />
              </a>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  onClick={() => {
                    const toolToCompare = selectedToolForDetails;
                    setSelectedToolForDetails(null);
                    setSelectedToolForCompare(toolToCompare);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-[#A8C66C] hover:text-slate-950 transition-colors"
                >
                  Compare
                </button>

                <button
                  onClick={() => {
                    setSelectedToolForDetails(null);
                    if (onRunCoachingSession) {
                      onRunCoachingSession();
                    }
                  }}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A8C66C] to-emerald-400 hover:from-[#b8d67c] hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4 fill-current text-slate-950" />
                  <span>Start Coaching</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
