import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuthSubscription } from '../context/AuthSubscriptionContext';

interface TrialCounterProps {
  setActiveTab: (tab: string) => void;
  isDarkMode?: boolean;
  compact?: boolean;
}

export const TrialCounter: React.FC<TrialCounterProps> = ({
  setActiveTab,
  isDarkMode = false,
  compact = false
}) => {
  const {
    currentUser,
    isAuthenticated,
    openAuthModal,
    openSubscriptionModal
  } = useAuthSubscription();

  // Real-time ticking state (updates every second for accurate countdown)
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // If not logged in, display an invitation banner to activate the 7-day free trial
  if (!isAuthenticated || !currentUser) {
    return (
      <div
        id="trial-counter-guest-banner"
        className={`w-full px-4 py-2 text-xs border-b flex flex-wrap items-center justify-between gap-2 transition-colors ${
          isDarkMode
            ? 'bg-slate-900/95 border-slate-800 text-slate-200'
            : 'bg-[#F9FBF6] border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A8C66C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#800000]"></span>
          </span>
          <span className="font-extrabold text-[#800000] dark:text-red-400">
            7-Day Free Trial Available:
          </span>
          <span className="text-slate-600 dark:text-slate-400 hidden sm:inline">
            168 hours of full unrestricted access to AI Scorecards, Pitch Lab, and MEDDIC pipelines. $0.00 CAD upfront.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="trial-counter-signup-btn"
            onClick={() => openAuthModal('signup')}
            className="px-3 py-1 rounded-lg bg-[#800000] text-white hover:bg-[#600000] font-black text-[11px] shadow-xs flex items-center gap-1 cursor-pointer transition-all"
          >
            <Sparkles className="w-3 h-3 text-[#A8C66C]" />
            <span>Start 7-Day Free Trial</span>
          </button>
        </div>
      </div>
    );
  }

  const isTrialing = currentUser.subscription.status === 'trialing';
  const isExpired = currentUser.subscription.status === 'expired_trial' || currentUser.subscription.status === 'past_due';
  const isPaidActive = currentUser.subscription.status === 'active_monthly' || currentUser.subscription.status === 'active_yearly';

  // Active Paid User Banner
  if (isPaidActive) {
    return (
      <div
        id="trial-counter-pro-banner"
        className={`w-full px-4 py-1.5 text-xs border-b flex items-center justify-between gap-2 ${
          isDarkMode
            ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-300'
            : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
        }`}
      >
        <div className="flex items-center gap-2 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-bold">
            Subscription Active: {currentUser.subscription.selectedPlan === 'yearly' ? 'Yearly Pro Plan ($155.99 CAD/yr - Saved 18%)' : 'Monthly Pro Plan ($15.99 CAD/mo)'}
          </span>
          <span className="hidden md:inline text-slate-500 dark:text-slate-400">
            • Next renewal: {currentUser.subscription.nextBillingDate || 'Active'}
          </span>
        </div>
        <button
          onClick={() => setActiveTab('billing')}
          className="text-[11px] font-bold text-[#800000] dark:text-red-400 hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>Manage Subscription</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // Calculate Trial Timestamps
  // Use trialStartDate or account createdAt (falling back to 7 days before trialEndDate or now)
  const startMs = currentUser.subscription.trialStartDate
    ? new Date(currentUser.subscription.trialStartDate).getTime()
    : (currentUser.createdAt ? new Date(currentUser.createdAt).getTime() : now);

  const endMs = currentUser.subscription.trialEndDate
    ? new Date(currentUser.subscription.trialEndDate).getTime()
    : startMs + 7 * 24 * 60 * 60 * 1000;

  const totalTrialMs = 7 * 24 * 60 * 60 * 1000; // 168 hours in milliseconds
  const msRemaining = Math.max(0, endMs - now);

  // Exact time units breakdown
  const totalHoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60));
  const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
  const hoursOnly = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((msRemaining % (1000 * 60)) / 1000);

  // Progress metrics (0% to 100%)
  const elapsedMs = Math.min(totalTrialMs, Math.max(0, now - startMs));
  const percentageElapsed = Math.min(100, Math.max(0, (elapsedMs / totalTrialMs) * 100));

  // Determine urgency level
  const isUrgent = isTrialing && totalHoursRemaining < 48 && msRemaining > 0;
  const isCritical = isTrialing && totalHoursRemaining < 24 && msRemaining > 0;
  const isTrialTimeUp = isTrialing && msRemaining <= 0;

  // Render Expired Banner
  if (isExpired || isTrialTimeUp) {
    return (
      <div
        id="trial-counter-expired-banner"
        className="w-full px-4 py-2 bg-red-600 text-white text-xs font-bold flex flex-wrap items-center justify-between gap-3 shadow-sm border-b border-red-700 animate-in fade-in"
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-300 shrink-0" />
          <span>
            <strong>7-Day Free Trial Expired (168 Hours Completed):</strong> Access to premium AI coaching features is suspended.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('billing')}
            className="px-3 py-1 rounded-lg bg-white text-red-700 hover:bg-slate-100 font-extrabold text-[11px] shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <span>Activate Pro Subscription ($15.99 / $155.99)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Render Active Trial Countdown Banner in Header
  return (
    <div
      id="trial-counter-active-banner"
      className={`w-full px-4 sm:px-6 py-2 text-xs border-b transition-all ${
        isCritical
          ? 'bg-red-500/15 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100'
          : isUrgent
            ? 'bg-amber-500/15 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
            : isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-200'
              : 'bg-[#FAFDF6] border-[#A8C66C]/50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Left: Trial Status & Time Remaining Details */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-[#800000] text-[#A8C66C] shadow-2xs">
              <Clock className="w-3.5 h-3.5" />
            </span>
            <span className="font-black text-xs tracking-tight text-[#800000] dark:text-red-400">
              7-DAY FREE TRIAL
            </span>
          </div>

          {/* Remaining Hours Highlight Badge */}
          <div
            id="trial-hours-remaining-badge"
            className={`px-2.5 py-0.5 rounded-full font-black text-xs flex items-center gap-1.5 shadow-2xs border ${
              isCritical
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : isUrgent
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                  : 'bg-[#800000] text-white border-[#600000]'
            }`}
          >
            <span>⏰ {totalHoursRemaining} Hours Remaining</span>
            <span className="opacity-80 text-[10px] font-medium hidden sm:inline">
              ({daysRemaining}d {hoursOnly}h {minutesRemaining}m {secondsRemaining}s)
            </span>
          </div>

          {/* Progress Bar showing percentage of 168 hours */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  isUrgent ? 'bg-amber-500' : 'bg-[#A8C66C]'
                }`}
                style={{ width: `${Math.max(4, 100 - percentageElapsed)}%` }}
                title={`${Math.round(100 - percentageElapsed)}% of 168h free trial remaining`}
              />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
              {Math.round(100 - percentageElapsed)}% left
            </span>
          </div>

          {/* Policy indicator */}
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden xl:inline">
            Unrestricted access • 168h total duration
          </span>
        </div>

        {/* Right: Quick Plan Actions & Direct Upgrade Link */}
        <div className="flex items-center gap-2 shrink-0">
          {isUrgent && (
            <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-300 hidden sm:flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Expires in &lt; 48 hours</span>
            </span>
          )}

          <button
            id="trial-counter-plans-btn"
            onClick={() => openSubscriptionModal('plans')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 cursor-pointer transition-all"
          >
            View Plans ($15.99 / $155.99)
          </button>

          <button
            id="trial-counter-upgrade-btn"
            onClick={() => setActiveTab('billing')}
            className="px-3 py-1 rounded-lg bg-[#800000] text-white hover:bg-[#600000] font-black text-[11px] shadow-xs flex items-center gap-1 cursor-pointer transition-all"
          >
            <span>Upgrade to Pro</span>
            <ArrowRight className="w-3 h-3 text-[#A8C66C]" />
          </button>
        </div>

      </div>
    </div>
  );
};
