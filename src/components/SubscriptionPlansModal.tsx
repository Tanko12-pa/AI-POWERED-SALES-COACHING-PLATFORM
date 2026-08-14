import React, { useState } from 'react';
import {
  X,
  Check,
  Zap,
  Sparkles,
  Shield,
  CreditCard,
  Clock,
  ArrowRight,
  HelpCircle,
  FileText,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { useAuthSubscription } from '../context/AuthSubscriptionContext';
import { SubscriptionPlanType } from '../types';
import { PayPalSmartCheckout } from './PayPalSmartCheckout';
import { PayPalHostedButtonsCheckout } from './PayPalHostedButtonsCheckout';

export const SubscriptionPlansModal: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    isSubscriptionModalOpen,
    subscriptionModalTab,
    closeSubscriptionModal,
    openAuthModal,
    startSevenDayFreeTrial,
    subscribeMonthly,
    subscribeYearly,
    subscribeWithPayPal,
    cancelSubscription,
    changeTransitionPlan,
    simulateTrialExpiration,
    simulateResetTrial
  } = useAuthSubscription();

  const [activeTab, setActiveTab] = useState<'plans' | 'hosted_buttons' | 'billing' | 'transition_settings' | 'paypal'>(
    (subscriptionModalTab as any) || 'hosted_buttons'
  );
  const [selectedTransition, setSelectedTransition] = useState<SubscriptionPlanType>(
    currentUser?.subscription.selectedPlan || 'monthly'
  );
  const [isPayPalProcessing, setIsPayPalProcessing] = useState(false);
  const [payPalPayerEmail, setPayPalPayerEmail] = useState(currentUser?.email || 'akindewum@gmail.com');
  const [payPalSuccessMsg, setPayPalSuccessMsg] = useState<string | null>(null);

  if (!isSubscriptionModalOpen) return null;

  const currentStatus = currentUser?.subscription.status || 'free_tier';
  const isTrialing = currentStatus === 'trialing';
  const isMonthlyActive = currentStatus === 'active_monthly';
  const isYearlyActive = currentStatus === 'active_yearly';
  const daysLeft = currentUser?.subscription.trialDaysRemaining ?? 7;

  const handleStartTrial = () => {
    if (!isAuthenticated) {
      openAuthModal('trial');
    } else {
      startSevenDayFreeTrial(selectedTransition);
    }
  };

  const handleSubscribeMonthly = () => {
    if (!isAuthenticated) {
      openAuthModal('signin');
    } else {
      subscribeMonthly();
    }
  };

  const handleSubscribeYearly = () => {
    if (!isAuthenticated) {
      openAuthModal('signin');
    } else {
      subscribeYearly();
    }
  };

  const handlePayPalCheckout = async (planType: 'monthly' | 'yearly') => {
    if (!isAuthenticated) {
      openAuthModal('signin');
      return;
    }
    setIsPayPalProcessing(true);
    setPayPalSuccessMsg(null);
    try {
      const res = await subscribeWithPayPal(planType, payPalPayerEmail);
      if (res.success) {
        setPayPalSuccessMsg(`PayPal Payment Completed! Order #${res.orderId || 'SUCCESS'}`);
      }
    } finally {
      setIsPayPalProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#800000] text-[#A8C66C] shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  AI Sales Coaching Plans & Subscriptions
                </h3>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#A8C66C] text-[#800000] uppercase tracking-wider">
                  Unconnected Plans
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Start with a 7-day free trial, or choose standalone monthly ($15.99) or yearly ($155.99) plans.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={closeSubscriptionModal}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Row */}
        <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              id="tab-paypal-hosted-btn"
              onClick={() => setActiveTab('hosted_buttons')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'hosted_buttons'
                  ? 'bg-[#0070ba] text-white shadow-xs'
                  : 'text-[#0070ba] dark:text-blue-400 hover:bg-blue-100/60 dark:hover:bg-slate-800'
              }`}
            >
              <span className="italic font-black text-xs">PayPal</span>
              <span>Hosted Buttons (CAD)</span>
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'plans'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Plans & 7-Day Trial
            </button>
            <button
              onClick={() => setActiveTab('transition_settings')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'transition_settings'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Trial Transition Engine
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'billing'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Invoices & Billing
            </button>
            <button
              id="tab-paypal-checkout-btn"
              onClick={() => setActiveTab('paypal')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'paypal'
                  ? 'bg-[#003087] text-[#FFC439] shadow-xs'
                  : 'text-[#003087] dark:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-slate-800'
              }`}
            >
              <span className="italic font-black text-xs">PayPal</span>
              <span>Smart API Buttons</span>
            </button>
          </div>

          {/* Current Status Pill */}
          {currentUser && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="text-[11px] text-slate-500">Current Status:</span>
              <span className="px-2.5 py-1 rounded-full bg-[#800000] text-white text-[10px] font-black">
                {isTrialing && `7-Day Trial (${daysLeft}d left)`}
                {isMonthlyActive && 'Monthly Pro ($15.99/mo)'}
                {isYearlyActive && 'Yearly Pro ($155.99/yr)'}
                {currentStatus === 'canceled' && 'Canceled'}
              </span>
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">

          {/* TAB 1: 3 UNCONNECTED TIERS (7-DAY TRIAL, $15.99/MO, $155.99/YR) */}
          {activeTab === 'plans' && (
            <div className="space-y-6">

              {/* 3 Standalone Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                
                {/* PLAN 1: 7-DAY FREE TRIAL */}
                <div className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all ${
                  isTrialing
                    ? 'border-[#A8C66C] bg-[#F3F8EA]/60 dark:bg-slate-850 shadow-md ring-2 ring-[#A8C66C]/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-[#800000] text-[#A8C66C] text-[10px] font-black uppercase tracking-wider">
                        Risk-Free
                      </span>
                      {isTrialing && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active Now
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-slate-100">7-Day Free Trial</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Test all coaching capabilities free for 7 full days.
                      </p>
                    </div>

                    <div className="py-2 border-y border-slate-100 dark:border-slate-800">
                      <div className="text-2xl font-black text-[#800000] dark:text-red-400">
                        $0.00 <span className="text-xs font-semibold text-slate-500">/ 7 days</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                        Automatically transitions to your selected plan after Day 7.
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Full AI scorecard analyzer</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Multimodal call audio transcription</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Real-time speech practice pitch lab</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Zero immediate credit card charge</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      id="plan-start-7day-trial-btn"
                      onClick={handleStartTrial}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                        isTrialing
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-[#800000] hover:bg-[#600000] text-white'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-[#A8C66C]" />
                      <span>{isTrialing ? `Trial Active (${daysLeft}d Left)` : 'Start 7-Day Free Trial'}</span>
                    </button>
                  </div>
                </div>

                {/* PLAN 2: STANDALONE $15.99 / MONTHLY PLAN */}
                <div className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all ${
                  isMonthlyActive
                    ? 'border-[#800000] bg-[#F3F8EA]/60 dark:bg-slate-850 shadow-md ring-2 ring-[#800000]/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black uppercase tracking-wider">
                        Monthly Flex
                      </span>
                      {isMonthlyActive && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Subscribed
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-slate-100">Monthly Pro Plan</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Standalone monthly subscription with cancel-anytime flexibility.
                      </p>
                    </div>

                    <div className="py-2 border-y border-slate-100 dark:border-slate-800">
                      <div className="text-2xl font-black text-[#800000] dark:text-red-400">
                        $15.99 <span className="text-xs font-semibold text-slate-500">/ month</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                        Billed monthly. Unconnected standalone plan.
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#800000] shrink-0" />
                        <span>Unlimited AI coaching sessions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#800000] shrink-0" />
                        <span>Full MEDDIC & talk-to-listen breakdowns</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#800000] shrink-0" />
                        <span>CRM automated deal stage triggers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#800000] shrink-0" />
                        <span>Cancel or switch at any time</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <button
                      id="plan-subscribe-monthly-btn"
                      onClick={handleSubscribeMonthly}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                        isMonthlyActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#800000] hover:bg-[#600000] text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#A8C66C]" />
                      <span>{isMonthlyActive ? 'Subscribed ($15.99/mo)' : 'Subscribe Monthly — $15.99/mo'}</span>
                    </button>

                    <button
                      id="paypal-subscribe-monthly-btn"
                      onClick={() => handlePayPalCheckout('monthly')}
                      disabled={isPayPalProcessing}
                      className="w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] border border-[#E0A800] disabled:opacity-50"
                    >
                      <span className="font-black italic text-sm">PayPal</span>
                      <span>{isPayPalProcessing ? 'Processing...' : 'Pay $15.99 with PayPal'}</span>
                    </button>
                  </div>
                </div>

                {/* PLAN 3: STANDALONE $155.99 / YEARLY PLAN */}
                <div className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all ${
                  isYearlyActive
                    ? 'border-[#800000] bg-[#F3F8EA]/60 dark:bg-slate-850 shadow-md ring-2 ring-[#800000]/40'
                    : 'border-[#A8C66C] bg-white dark:bg-slate-900 shadow-sm hover:border-[#8BA854]'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-[#A8C66C] text-[#800000] text-[10px] font-black uppercase tracking-wider">
                        Best Value • Save 18%
                      </span>
                      {isYearlyActive && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Subscribed
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-slate-100">Yearly Pro Plan</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Standalone annual subscription with 18% maximum savings.
                      </p>
                    </div>

                    <div className="py-2 border-y border-slate-100 dark:border-slate-800">
                      <div className="text-2xl font-black text-[#800000] dark:text-red-400">
                        $155.99 <span className="text-xs font-semibold text-slate-500">/ year</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block mt-0.5">
                        Equivalent to $13.00 / month (Save $35.89 / year)
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#800000] shrink-0" />
                        <span>Everything in Monthly Pro Plan</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#800000] shrink-0" />
                        <span>Priority Gemini 3.6 processing queue</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#800000] shrink-0" />
                        <span>Advanced team coaching benchmarks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#800000] shrink-0" />
                        <span>18% cost savings locked for 1 year</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <button
                      id="plan-subscribe-yearly-btn"
                      onClick={handleSubscribeYearly}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                        isYearlyActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#800000] hover:bg-[#600000] text-white'
                      }`}
                    >
                      <Award className="w-4 h-4 text-[#A8C66C]" />
                      <span>{isYearlyActive ? 'Subscribed ($155.99/yr)' : 'Subscribe Yearly — $155.99/yr'}</span>
                    </button>

                    <button
                      id="paypal-subscribe-yearly-btn"
                      onClick={() => handlePayPalCheckout('yearly')}
                      disabled={isPayPalProcessing}
                      className="w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] border border-[#E0A800] disabled:opacity-50"
                    >
                      <span className="font-black italic text-sm">PayPal</span>
                      <span>{isPayPalProcessing ? 'Processing...' : 'Pay $155.99 with PayPal (Save 18%)'}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* PayPal Express Gateway Badge & Live Status */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-blue-50/60 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 border border-amber-200/80 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-xl bg-[#003087] text-[#0079C1] flex items-center gap-1 font-black text-sm tracking-tight shadow-xs">
                    <span className="text-white italic">Pay</span><span className="text-[#0079C1] italic">Pal</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                        PayPal REST API Connected & Verified
                      </strong>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        Sandbox Gateway Active
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Client ID: BAAEeaPb...FlPjBk • Secure 256-bit encryption • Instant checkout
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={payPalPayerEmail}
                    onChange={(e) => setPayPalPayerEmail(e.target.value)}
                    placeholder="PayPal Email"
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 w-48 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    onClick={() => handlePayPalCheckout('monthly')}
                    disabled={isPayPalProcessing}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] text-xs font-black transition-all cursor-pointer shadow-xs border border-[#E0A800]"
                  >
                    Quick Checkout
                  </button>
                </div>
              </div>

              {payPalSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in">
                  <span>🎉 {payPalSuccessMsg}</span>
                  <button onClick={() => setPayPalSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}


              {/* Automatic Trial-to-Plan Transition Lifecycle Visualizer */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#800000]" />
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      Automatic 7-Day Free Trial Transition Architecture
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    Selected Transition Plan: <strong className="text-[#800000] dark:text-red-400">{currentUser?.subscription.selectedPlan === 'monthly' ? 'Monthly ($15.99)' : 'Yearly ($155.99)'}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Step 1 • Day 0</span>
                    <strong className="text-xs text-slate-900 dark:text-slate-100 block mt-0.5">Activate 7-Day Free Trial</strong>
                    <p className="text-[11px] text-slate-500 mt-1">$0.00 charged. Instant access to all AI coaching tools.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Step 2 • Days 1–6</span>
                    <strong className="text-xs text-slate-900 dark:text-slate-100 block mt-0.5">Active Coaching Period</strong>
                    <p className="text-[11px] text-slate-500 mt-1">Full multimodal analysis & speech lab practice.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#800000]">
                    <span className="text-[10px] font-bold text-[#800000] uppercase">Step 3 • Day 7 Expiration</span>
                    <strong className="text-xs text-[#800000] dark:text-red-400 block mt-0.5">Automatic Plan Transition</strong>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      Automatically charges selected plan (${currentUser?.subscription.selectedPlan === 'monthly' ? '15.99/mo' : '155.99/yr'}) for uninterrupted workflow.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TRIAL TRANSITION CONTROLS & SIMULATION TESTING */}
          {activeTab === 'transition_settings' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-2">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                  <h4 className="text-sm font-extrabold text-amber-900 dark:text-amber-200">
                    Interactive Trial Expiry & Transition Simulation Engine
                  </h4>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Test the platform's automatic transition behavior. You can change your post-trial plan, fast-forward time to simulate the 7-day expiration, or reset your trial back to day 1.
                </p>
              </div>

              {/* Plan Choice Selector */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400">Configure Post-Trial Plan</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTransition('monthly');
                      changeTransitionPlan('monthly');
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      currentUser?.subscription.selectedPlan === 'monthly'
                        ? 'border-[#800000] bg-[#F3F8EA] dark:bg-slate-800 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Transition to Monthly ($15.99)</strong>
                      {currentUser?.subscription.selectedPlan === 'monthly' && <Check className="w-4 h-4 text-[#800000]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Charges $15.99 on Day 7 expiry.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTransition('yearly');
                      changeTransitionPlan('yearly');
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      currentUser?.subscription.selectedPlan === 'yearly'
                        ? 'border-[#800000] bg-[#F3F8EA] dark:bg-slate-800 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Transition to Yearly ($155.99)</strong>
                      {currentUser?.subscription.selectedPlan === 'yearly' && <Check className="w-4 h-4 text-[#800000]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Charges $155.99 on Day 7 expiry (18% savings).</p>
                  </button>
                </div>
              </div>

              {/* Simulation Action Buttons */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400">Simulation Triggers</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={simulateTrialExpiration}
                    className="p-3.5 rounded-xl bg-[#800000] hover:bg-[#600000] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-[#A8C66C]" />
                    <span>Simulate 7-Day Expiry (Trigger Auto-Transition)</span>
                  </button>

                  <button
                    onClick={simulateResetTrial}
                    className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-[#A8C66C]" />
                    <span>Reset to 7-Day Free Trial (Day 1)</span>
                  </button>
                </div>
              </div>

              {/* Cancel Subscription */}
              {currentUser && currentUser.subscription.status !== 'canceled' && (
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-xs text-slate-800 dark:text-slate-200 block">Cancel Auto-Renew</strong>
                    <span className="text-[11px] text-slate-500">Stop automatic transition or renewal at end of cycle.</span>
                  </div>
                  <button
                    onClick={cancelSubscription}
                    className="px-3.5 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer"
                  >
                    Cancel Plan
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INVOICES & BILLING LEDGER */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              
              {/* Payment Method Card */}
              {currentUser && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#800000]">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                        {currentUser.subscription.paymentMethod.cardBrand} ending in {currentUser.subscription.paymentMethod.last4}
                      </strong>
                      <span className="text-[11px] text-slate-500">
                        Expires {currentUser.subscription.paymentMethod.expDate} • Cardholder: {currentUser.subscription.paymentMethod.holderName}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    Primary Billing Method
                  </span>
                </div>
              )}

              {/* Billing Invoices Table */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    Payment & Invoice History
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {currentUser?.subscription.billingHistory.length || 0} Transactions
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentUser?.subscription.billingHistory.map((inv) => (
                    <div key={inv.id} className="p-3.5 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="font-bold text-slate-900 dark:text-slate-100">{inv.description}</strong>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-3">
                          <span>Invoice ID: {inv.id}</span>
                          <span>Date: {inv.date}</span>
                          <span>Method: {inv.paymentMethod}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-sm text-slate-900 dark:text-slate-100">
                          ${inv.amount.toFixed(2)}
                        </div>
                        <span className="text-[10px] text-slate-400">USD</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: PAYPAL HOSTED BUTTONS & SHOPPING CART (CAD) */}
          {activeTab === 'hosted_buttons' && (
            <div className="space-y-4">
              <PayPalHostedButtonsCheckout
                onPlanSelected={(plan) => {
                  console.log('PayPal hosted plan selected:', plan);
                }}
              />
            </div>
          )}

          {/* TAB 5: PAYPAL SMART CHECKOUT & RECURRING SUBSCRIPTION PORTAL */}
          {activeTab === 'paypal' && (
            <div className="space-y-4">
              <PayPalSmartCheckout
                defaultAmount="19.99"
                defaultPlanId="P-AI-SALES-COACH-PRO"
                onSuccess={(id, type) => {
                  console.log('PayPal transaction completed:', id, type);
                }}
              />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
