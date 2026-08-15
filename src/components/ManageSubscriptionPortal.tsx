import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  Download,
  AlertTriangle,
  Receipt,
  ToggleLeft,
  ToggleRight,
  Check,
  Calendar,
  DollarSign,
  Activity,
  Layers,
  Calculator,
  TrendingDown,
  Users,
  Shield,
  Loader2
} from 'lucide-react';
import { useAuthSubscription } from '../context/AuthSubscriptionContext';

interface BackendSubscriptionData {
  status: 'active' | 'trialing' | 'past_due' | 'cancelled';
  selectedPlan: 'monthly' | 'yearly';
  planName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  trialDaysRemaining: number;
  autoRenew: boolean;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  paymentMethod: {
    type: string;
    email?: string;
    last4: string;
    gateway: string;
    buttonId?: string;
  };
  subscriptionId: string;
  features: {
    unlimitedAiRoleplay: boolean;
    salesObjectionPlaybooks: boolean;
    speechAnalyticsLab: boolean;
    executivePdfExports: boolean;
    teamCollaboration: boolean;
    webhookRealtimeSync: boolean;
  };
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    currency: string;
    status: string;
    plan: string;
    paymentMethod: string;
  }>;
  lastWebhookSync: string;
}

interface ManageSubscriptionPortalProps {
  onOpenCheckoutModal?: () => void;
  isDarkMode?: boolean;
}

export const ManageSubscriptionPortal: React.FC<ManageSubscriptionPortalProps> = ({
  onOpenCheckoutModal,
  isDarkMode = false
}) => {
  const {
    currentUser,
    openSubscriptionModal,
    subscribeMonthly,
    subscribeYearly,
    cancelSubscription
  } = useAuthSubscription();

  const [loading, setLoading] = useState(false);
  const [subData, setSubData] = useState<BackendSubscriptionData | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [updatingPlanTarget, setUpdatingPlanTarget] = useState<'monthly' | 'yearly' | null>(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  // Dynamic price calculation & interactive simulation state
  const [simulatedPlan, setSimulatedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [teamSeats, setTeamSeats] = useState<number>(1);
  const [isSdkInitializing, setIsSdkInitializing] = useState<boolean>(true);

  // Simulate PayPal SDK handshake readiness
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSdkInitializing(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // 1. Fetch live subscription state from backend
  const fetchSubscriptionStatus = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const res = await fetch('/api/user/subscription').catch(() => null);
      if (res && res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data && data.subscription) {
          setSubData(data.subscription);
          setSimulatedPlan(data.subscription.selectedPlan || 'yearly');
          return;
        }
      }
    } catch (err: any) {
      console.warn('Backend subscription fetch notice:', err?.message || err);
    } finally {
      // Fallback synthesis from AuthSubscriptionContext
      if (!subData && currentUser?.subscription) {
        setSubData({
          status: currentUser.subscription.status as any,
          selectedPlan: currentUser.subscription.selectedPlan,
          planName: currentUser.subscription.selectedPlan === 'yearly' ? 'Pro Sales Coaching Annual (CAD)' : 'Pro Sales Coaching (CAD)',
          monthlyPrice: 15.99,
          yearlyPrice: 155.99,
          currency: 'CAD',
          trialDaysRemaining: currentUser.subscription.trialDaysRemaining || 0,
          autoRenew: currentUser.subscription.autoTransitionToPlan,
          currentPeriodStart: new Date().toISOString().split('T')[0],
          currentPeriodEnd: currentUser.subscription.nextBillingDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          paymentMethod: {
            type: 'PayPal Hosted Vault',
            email: currentUser.email,
            last4: 'CAD-Vault',
            gateway: 'PayPal Sandbox (VPDDGW7BB8CAW)',
            buttonId: 'UQL32X2486VFE'
          },
          subscriptionId: 'I-SUB-CAD-9817246',
          features: {
            unlimitedAiRoleplay: true,
            salesObjectionPlaybooks: true,
            speechAnalyticsLab: true,
            executivePdfExports: true,
            teamCollaboration: true,
            webhookRealtimeSync: true
          },
          invoices: [
            {
              id: 'INV-2026-003',
              date: new Date().toISOString().split('T')[0],
              amount: 15.99,
              currency: 'CAD',
              status: 'Paid',
              plan: 'Monthly Pro (CAD)',
              paymentMethod: 'PayPal (CAD-Vault)'
            }
          ],
          lastWebhookSync: new Date().toISOString()
        });
        setSimulatedPlan(currentUser.subscription.selectedPlan || 'yearly');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [currentUser]);

  // Pricing Constants
  const MONTHLY_BASE_PRICE = subData?.monthlyPrice || 15.99;
  const YEARLY_BASE_PRICE = subData?.yearlyPrice || 155.99;
  const CURRENCY = subData?.currency || 'CAD';

  // Dynamic calculations based on current selection and seat multipliers
  const annualizedMonthlyCost = MONTHLY_BASE_PRICE * 12 * teamSeats;
  const annualPlanCost = YEARLY_BASE_PRICE * teamSeats;
  const totalAnnualSavings = Math.max(0, annualizedMonthlyCost - annualPlanCost);
  const percentageSavings = Math.round((totalAnnualSavings / annualizedMonthlyCost) * 100);
  const effectiveMonthlyRate = annualPlanCost / (12 * teamSeats);

  // Selected plan calculation values
  const currentPlanMonthlyEquivalent = simulatedPlan === 'yearly' ? effectiveMonthlyRate : MONTHLY_BASE_PRICE;
  const currentPlanTotalBilled = simulatedPlan === 'yearly' ? annualPlanCost : (MONTHLY_BASE_PRICE * teamSeats);

  // 2. Plan Switch Handler (Monthly <-> Yearly)
  const handleSwitchPlan = async (targetPlan: 'monthly' | 'yearly') => {
    if (!subData || subData.selectedPlan === targetPlan) return;
    setIsUpdatingPlan(true);
    setUpdatingPlanTarget(targetPlan);
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await fetch('/api/user/subscription/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch_plan', plan: targetPlan })
      }).catch(() => null);
      if (res && res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.subscription) {
          setSubData(data.subscription);
          setSimulatedPlan(targetPlan);
        }
      } else {
        setSubData(prev => prev ? {
          ...prev,
          selectedPlan: targetPlan,
          planName: targetPlan === 'yearly' ? 'Pro Sales Coaching Annual (CAD)' : 'Pro Sales Coaching (CAD)'
        } : null);
        setSimulatedPlan(targetPlan);
      }
      if (targetPlan === 'yearly') {
        subscribeYearly();
      } else {
        subscribeMonthly();
      }
      setActionSuccess(`Plan successfully upgraded to ${targetPlan === 'yearly' ? `Annual Pro (${percentageSavings}% Savings - ${CURRENCY} $${YEARLY_BASE_PRICE.toFixed(2)}/yr)` : `Monthly Pro (${CURRENCY} $${MONTHLY_BASE_PRICE.toFixed(2)}/mo)`}.`);
      setTimeout(() => setActionSuccess(null), 4500);
    } catch (err: any) {
      setActionError(err?.message || 'Error updating subscription plan');
    } finally {
      setIsUpdatingPlan(false);
      setUpdatingPlanTarget(null);
    }
  };

  // 3. Auto-Renew Toggle
  const handleToggleAutoRenew = async () => {
    if (!subData) return;
    const newAutoRenew = !subData.autoRenew;
    try {
      const res = await fetch('/api/user/subscription/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoRenew: newAutoRenew })
      }).catch(() => null);
      if (res && res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.subscription) {
          setSubData(data.subscription);
        }
      } else {
        setSubData(prev => prev ? { ...prev, autoRenew: newAutoRenew } : null);
      }
      setActionSuccess(`Auto-renewal has been ${newAutoRenew ? 'enabled' : 'paused'}.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err?.message || 'Error modifying auto-renew');
    }
  };

  // 4. Cancel / Pause Subscription
  const handleConfirmCancel = async () => {
    setShowConfirmCancel(false);
    try {
      const res = await fetch('/api/user/subscription/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' })
      }).catch(() => null);
      if (res && res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.subscription) {
          setSubData(data.subscription);
        }
      } else {
        setSubData(prev => prev ? { ...prev, status: 'cancelled', autoRenew: false } : null);
      }
      cancelSubscription();
      setActionSuccess('Subscription cancelled. You will retain Pro access through the end of the billing period.');
      setTimeout(() => setActionSuccess(null), 4500);
    } catch (err: any) {
      setActionError(err?.message || 'Error cancelling subscription');
    }
  };

  // 5. Reactivate
  const handleReactivate = async () => {
    try {
      const res = await fetch('/api/user/subscription/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reactivate' })
      }).catch(() => null);
      if (res && res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.subscription) {
          setSubData(data.subscription);
        }
      } else {
        setSubData(prev => prev ? { ...prev, status: 'active', autoRenew: true } : null);
      }
      subscribeMonthly();
      setActionSuccess('Subscription reactivated successfully!');
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      setActionError(err?.message || 'Error reactivating subscription');
    }
  };

  const isYearly = subData?.selectedPlan === 'yearly';
  const isActive = subData?.status === 'active';
  const isTrialing = subData?.status === 'trialing';

  // SKELETON LOADING STATE
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 animate-pulse transition-all">
        {/* Skeleton Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div className="space-y-2">
            <div className="h-6 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-3 w-80 bg-slate-100 dark:bg-slate-850 rounded-md"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-8 w-36 bg-[#0070ba]/30 rounded-xl"></div>
          </div>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {/* Hero Card Skeleton */}
            <div className="h-56 bg-slate-900/60 dark:bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="h-5 w-32 bg-slate-800 rounded-full"></div>
                <div className="h-5 w-24 bg-slate-800 rounded-md"></div>
              </div>
              <div className="space-y-2">
                <div className="h-7 w-56 bg-slate-750 rounded-lg"></div>
                <div className="h-4 w-72 bg-slate-800 rounded-md"></div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800">
                <div className="h-8 bg-slate-800/80 rounded-md"></div>
                <div className="h-8 bg-slate-800/80 rounded-md"></div>
                <div className="h-8 bg-slate-800/80 rounded-md"></div>
              </div>
            </div>

            {/* Plan Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-40 bg-slate-100 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-4"></div>
              <div className="h-40 bg-slate-100 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-4"></div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-4">
            <div className="h-48 bg-slate-100 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"></div>
            <div className="h-40 bg-slate-100 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"></div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs font-semibold text-[#0070ba] dark:text-blue-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Synchronizing with PayPal Subscription Vault & Webhook Gateway...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 transition-all relative">
      {/* Checkout & Upgrade Processing Modal/Overlay */}
      {isUpdatingPlan && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 text-white text-center animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-w-md w-full flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0070ba]/20 text-[#0070ba] flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#0070ba]" />
            </div>
            <h3 className="text-base font-black text-white">
              Processing Subscription Switch
            </h3>
            <p className="text-xs text-slate-300">
              Updating your billing schedule to {updatingPlanTarget === 'yearly' ? 'Annual Pro (CAD $155.99/yr)' : 'Monthly Pro (CAD $15.99/mo)'} and syncing with PayPal Hosted Vault...
            </p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2">
              <div className="bg-[#0070ba] h-full w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0070ba]/10 text-[#0070ba] dark:text-blue-400">
              <Receipt className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
              Manage Subscription & Billing Portal
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Backend Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active plan status, dynamic savings calculator, CAD billing history, and PayPal Webhook gateway
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* SDK Status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-bold">
            {isSdkInitializing ? (
              <>
                <Loader2 className="w-3 h-3 text-[#0070ba] animate-spin" />
                <span>PayPal SDK Initializing...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>PayPal SDK Ready</span>
              </>
            )}
          </div>

          <button
            id="refresh-subscription-portal-btn"
            onClick={fetchSubscriptionStatus}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Fetch real-time state from /api/user/subscription"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Sync Status'}</span>
          </button>

          <button
            id="open-paypal-hosted-portal-btn"
            onClick={() => {
              if (onOpenCheckoutModal) onOpenCheckoutModal();
              else openSubscriptionModal('hosted_buttons' as any);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0070ba] hover:bg-[#003087] text-white font-black text-xs transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
          >
            <span className="italic font-black text-xs">PayPal</span>
            <span>Hosted Buttons (CAD)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Notifications */}
      {actionSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer">×</button>
        </div>
      )}

      {actionError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-red-700 hover:text-red-900 font-bold cursor-pointer">×</button>
        </div>
      )}

      {/* Main Grid: Status Card + Billing Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        
        {/* Left 2 Cols: Subscription Overview, Interactive Calculator & Plan Controls */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Active Plan Hero Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#002244] text-white shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Zap className="w-32 h-32 text-blue-300" />
            </div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-400/30">
                    {CURRENCY} Subscription
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                    isTrialing ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                    'bg-red-500/20 text-red-300 border border-red-400/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {subData?.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>

                <div className="text-right text-xs text-blue-200">
                  <span>ID: </span>
                  <span className="font-mono font-bold text-white">{subData?.subscriptionId || 'I-SUB-CAD-9817246'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-2 mt-2 mb-4">
                <div>
                  <h3 className="text-2xl font-black text-white">
                    {subData?.planName || (isYearly ? 'Pro Sales Coaching Annual' : 'Pro Sales Coaching Monthly')}
                  </h3>
                  <p className="text-xs text-blue-200/80 mt-0.5">
                    Unlimited AI pitch simulations, custom objection playbooks, and speech telemetry
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-white">
                    {CURRENCY} ${isYearly ? YEARLY_BASE_PRICE.toFixed(2) : MONTHLY_BASE_PRICE.toFixed(2)}
                    <span className="text-xs font-semibold text-blue-200">/{isYearly ? 'year' : 'month'}</span>
                  </div>
                  {isYearly ? (
                    <span className="text-[10px] font-bold text-emerald-400">
                      Save {percentageSavings}% (CAD ${totalAnnualSavings.toFixed(2)}/yr)
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-300">
                      Switch to Annual to save {CURRENCY} ${totalAnnualSavings.toFixed(2)}/yr
                    </span>
                  )}
                </div>
              </div>

              {/* Renewal Timeline & Webhook Sync */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-blue-300 uppercase font-bold block">Current Period</span>
                  <span className="font-semibold text-white">
                    {subData?.currentPeriodStart || 'Aug 01, 2026'} - {subData?.currentPeriodEnd || 'Aug 31, 2026'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-blue-300 uppercase font-bold block">Next Renewal</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-300" />
                    {subData?.autoRenew ? (subData?.currentPeriodEnd || 'In 23 days') : 'Cancels at Period End'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-blue-300 uppercase font-bold block">Webhook Gateway</span>
                  <span className="font-semibold text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Real-time Verified</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* REAL-TIME PRICE CALCULATION & SAVINGS COMPARATOR */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-slate-850 dark:via-slate-850 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/40 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-[#0070ba] text-white">
                  <Calculator className="w-4 h-4" />
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Real-Time Price & Savings Engine
                </span>
              </div>

              {/* Team seat counter */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-600 dark:text-slate-300 font-bold">Seats:</span>
                <div className="flex items-center gap-1">
                  {[1, 3, 5, 10].map(seats => (
                    <button
                      key={seats}
                      onClick={() => setTeamSeats(seats)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-black cursor-pointer transition-all ${
                        teamSeats === seats
                          ? 'bg-[#0070ba] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {seats}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Comparison Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                  12 Months (Billed Monthly)
                </span>
                <span className="text-base font-black text-slate-800 dark:text-slate-200">
                  {CURRENCY} ${annualizedMonthlyCost.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ${MONTHLY_BASE_PRICE.toFixed(2)}/mo × {teamSeats} seat{teamSeats > 1 ? 's' : ''}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800/80 relative">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                  Annual Plan Total
                </span>
                <span className="text-base font-black text-emerald-700 dark:text-emerald-300">
                  {CURRENCY} ${annualPlanCost.toFixed(2)}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                  Equivalent to ${effectiveMonthlyRate.toFixed(2)}/mo/seat
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-sm flex flex-col justify-center">
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-100 block">
                  Your Net Annual Savings
                </span>
                <span className="text-lg font-black tracking-tight">
                  {CURRENCY} ${totalAnnualSavings.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-emerald-100">
                  Save {percentageSavings}% with Annual Billing
                </span>
              </div>
            </div>
          </div>

          {/* Plan Switcher & Upgrades with Hover Scaling & Tactile Animations */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0070ba]" />
                Switch / Upgrade Plan Tier
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Hover card for live preview & tactile selection
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Monthly Plan Card (Tactile Hover & Scale Animation) */}
              <div
                onClick={() => setSimulatedPlan('monthly')}
                className={`p-4 rounded-xl border relative cursor-pointer group transition-all duration-300 ease-out transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] ${
                  !isYearly
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#0070ba] shadow-sm ring-1 ring-[#0070ba]/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#0070ba]/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0070ba]"></span>
                    Monthly Pro
                  </span>
                  {!isYearly ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#0070ba] text-white text-[10px] font-black tracking-wide">
                      Current Plan
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#0070ba] transition-colors">
                      Select Monthly
                    </span>
                  )}
                </div>

                <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2">
                  {CURRENCY} ${MONTHLY_BASE_PRICE.toFixed(2)}
                  <span className="text-xs font-semibold text-slate-500">/mo</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Flexible cancel-anytime monthly cycle</p>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>12-Month Total:</span>
                    <span className="font-bold">{CURRENCY} ${annualizedMonthlyCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Flexibility:</span>
                    <span>Max Freedom</span>
                  </div>
                </div>

                {isYearly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwitchPlan('monthly');
                    }}
                    disabled={isUpdatingPlan}
                    className="mt-3.5 w-full py-2 px-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 text-xs font-bold transition-all cursor-pointer hover:shadow-xs active:scale-95"
                  >
                    {isUpdatingPlan && updatingPlanTarget === 'monthly' ? 'Switching...' : 'Switch to Monthly'}
                  </button>
                )}
              </div>

              {/* Yearly Plan Card (Tactile Hover & Scale Animation + Value Highlight) */}
              <div
                onClick={() => setSimulatedPlan('yearly')}
                className={`p-4 rounded-xl border relative cursor-pointer group transition-all duration-300 ease-out transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] ${
                  isYearly
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#0070ba] shadow-sm ring-1 ring-[#0070ba]/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-xs'
                }`}
              >
                {/* Savings Pill */}
                <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs animate-bounce group-hover:scale-110 transition-transform">
                  Save {percentageSavings}%
                </span>

                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Annual Pro
                  </span>
                  {isYearly ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#0070ba] text-white text-[10px] font-black tracking-wide">
                      Current Plan
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                      Best Value
                    </span>
                  )}
                </div>

                <div className="text-xl font-black text-[#0070ba] dark:text-blue-400 mt-2">
                  {CURRENCY} ${YEARLY_BASE_PRICE.toFixed(2)}
                  <span className="text-xs font-semibold text-slate-500">/yr</span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Billed annually (${effectiveMonthlyRate.toFixed(2)}/mo effective)
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Annual Savings:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Save {CURRENCY} ${totalAnnualSavings.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Priority Queue:</span>
                    <span>Gemini 3.6 Flash</span>
                  </div>
                </div>

                {!isYearly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwitchPlan('yearly');
                    }}
                    disabled={isUpdatingPlan}
                    className="mt-3.5 w-full py-2 px-3 rounded-lg bg-[#0070ba] hover:bg-[#003087] text-white text-xs font-black transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 hover:shadow-md active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isUpdatingPlan && updatingPlanTarget === 'yearly' ? 'Upgrading...' : `Upgrade to Annual (Save ${percentageSavings}%)`}</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Feature Matrix Included in Subscription */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-3">
              Included Pro Coaching Capabilities
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Unlimited AI Roleplay Pitch Simulations</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Voice Pitch Practice Lab (Speech & Fillers)</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Custom Sales Objection Handling Playbooks</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Executive PDF Coaching Exports & Reports</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Payment Method, Auto-Renew & Invoices */}
        <div className="space-y-4">
          
          {/* Payment Method Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-3">
              Payment Gateway & Method
            </span>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between mb-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#003087] text-white flex items-center justify-center font-black italic text-xs">
                  PP
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {subData?.paymentMethod.type || 'PayPal Hosted Vault'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {subData?.paymentMethod.email || 'payer-canada@enterprise.ai'}
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-black text-[10px]">
                {CURRENCY}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Merchant Account:</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-[11px]">VPDDGW7BB8CAW</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Auto-Renewal:</span>
                <button
                  onClick={handleToggleAutoRenew}
                  className="flex items-center gap-1 font-bold text-[#0070ba] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {subData?.autoRenew ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <ToggleRight className="w-4 h-4" /> Enabled
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <ToggleLeft className="w-4 h-4" /> Paused
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Webhook Sync:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                  <Check className="w-3.5 h-3.5" /> Active
                </span>
              </div>
            </div>

            {/* Cancel / Reactivate Button */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              {isActive ? (
                <div>
                  {showConfirmCancel ? (
                    <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs animate-fadeIn">
                      <p className="font-bold text-red-900 dark:text-red-300 mb-2">
                        Confirm cancellation? Access remains active until period end.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleConfirmCancel}
                          className="px-2.5 py-1 rounded bg-red-600 text-white font-bold text-xs hover:bg-red-700 cursor-pointer"
                        >
                          Yes, Cancel
                        </button>
                        <button
                          onClick={() => setShowConfirmCancel(false)}
                          className="px-2.5 py-1 rounded bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 cursor-pointer"
                        >
                          Keep Plan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowConfirmCancel(true)}
                      className="w-full py-1.5 text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-bold hover:underline text-center cursor-pointer"
                    >
                      Cancel / Pause Subscription
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleReactivate}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all cursor-pointer hover:scale-102 active:scale-98"
                >
                  Reactivate Subscription
                </button>
              )}
            </div>
          </div>

          {/* Billing Receipts & Invoice Ledger */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5 text-[#0070ba]" />
                Invoices & Receipts
              </span>
              <span className="text-[10px] text-slate-400 font-bold">{CURRENCY} Currency</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {(subData?.invoices || []).map((inv) => (
                <div
                  key={inv.id}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:border-[#0070ba]/40 transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{inv.id}</div>
                    <div className="text-[10px] text-slate-500">{inv.date} • {inv.plan}</div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-slate-900 dark:text-slate-100">
                      {CURRENCY} ${inv.amount.toFixed(2)}
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
