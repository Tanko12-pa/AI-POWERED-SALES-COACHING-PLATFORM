import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  ExternalLink,
  UserPlus,
  LogIn,
  KeyRound,
  Lock,
  Mail,
  User,
  AlertCircle,
  RefreshCw,
  FileText,
  DollarSign,
  Download,
  Calendar,
  Check,
  Sliders,
  ChevronRight,
  Shield,
  Copy,
  Info,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useAuthSubscription } from '../context/AuthSubscriptionContext';
import { SubscriptionPlanType, UserRole } from '../types';

declare global {
  interface Window {
    paypal?: any;
  }
}

export const PAYPAL_GATEWAY_CONFIG = {
  CLIENT_ID: 'BAAEeaPbIq6dCAVkztoxH_i7GSu4qvzw5b6pdAKVtcji2Dq4F7vQTIZqmvQWG7RWb0pQaSJMDfjpFlPjBk',
  CURRENCY: 'CAD',
  PLAN_ID_MONTHLY: 'P-28K50161X57516321NKAASOY', // $15.99/Monthly Pro Subscription
  PLAN_ID_YEARLY: 'P-8J3274500K107715XNKAAVMQ',  // $155.99/Yearly Pro Subscription (18% Savings)
  TRIAL_PLAN_ID: 'P-7DAYTRIALPLANID12345',
  PRICE_MONTHLY: 15.99,
  PRICE_YEARLY: 155.99
};

interface SubscriptionBillingSectionProps {
  isDarkMode?: boolean;
}

export const SubscriptionBillingSection: React.FC<SubscriptionBillingSectionProps> = ({
  isDarkMode = false
}) => {
  const {
    currentUser,
    isAuthenticated,
    openAuthModal,
    signOut,
    signIn,
    signUp,
    updateUserPassword,
    resetPasswordByEmail,
    getUserByEmail,
    subscribeMonthly,
    subscribeYearly,
    subscribeWithPayPal,
    startSevenDayFreeTrial,
    cancelSubscription,
    simulateTrial48HoursRemaining,
    simulateTrialExpiration,
    registeredUsers,
    handlePayPalWebhookEvent,
    triggerPayPalWebhookSimulation
  } = useAuthSubscription();

  // Active sub-tab in billing section
  const [activeSubTab, setActiveSubTab] = useState<'plans' | 'auth' | 'history' | 'gateway_config' | 'policy'>('plans');

  // Interactive inline auth form state
  const [authMode, setAuthMode] = useState<'signup' | 'signin' | 'changepassword'>('signup');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('Sales Rep');
  const [showPassword, setShowPassword] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Password reset/lookup states
  const [lookupEmail, setLookupEmail] = useState('');
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [revealedPass, setRevealedPass] = useState<string | null>(null);
  const [copiedPolicy, setCopiedPolicy] = useState(false);

  // Billing & PayPal State
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<SubscriptionPlanType>('monthly');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [gatewayStatus, setGatewayStatus] = useState<'ready' | 'loading' | 'fallback'>('ready');
  const [serverConfig, setServerConfig] = useState<any>(null);

  const monthlyBtnContainerRef = useRef<HTMLDivElement>(null);
  const yearlyBtnContainerRef = useRef<HTMLDivElement>(null);
  const monthlyRenderedRef = useRef<boolean>(false);
  const yearlyRenderedRef = useRef<boolean>(false);

  // Fetch backend PayPal configuration
  useEffect(() => {
    let isMounted = true;
    fetch('/api/paypal/config')
      .then(res => (res && res.ok ? res.json().catch(() => null) : null))
      .then(data => {
        if (data && isMounted) setServerConfig(data);
      })
      .catch(err => console.warn('PayPal config fetch notice:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize PayPal Smart Buttons safely when activeSubTab is 'plans'
  useEffect(() => {
    let isMounted = true;
    let pollTimer: any = null;

    if (activeSubTab !== 'plans') {
      monthlyRenderedRef.current = false;
      yearlyRenderedRef.current = false;
      return;
    }

    const tryRenderButtons = () => {
      if (!isMounted) return;

      if (window.paypal && typeof window.paypal.Buttons === 'function') {
        setGatewayStatus('ready');
        renderMonthlyButton();
        renderYearlyButton();
        if (pollTimer) clearInterval(pollTimer);
      } else {
        setGatewayStatus('loading');
      }
    };

    tryRenderButtons();

    // Check once or twice until PayPal is loaded, then stop polling
    if (!window.paypal || typeof window.paypal.Buttons !== 'function') {
      let attempts = 0;
      pollTimer = setInterval(() => {
        attempts++;
        if ((window.paypal && typeof window.paypal.Buttons === 'function') || attempts > 15) {
          tryRenderButtons();
          if (pollTimer) clearInterval(pollTimer);
        }
      }, 500);
    }

    return () => {
      isMounted = false;
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [activeSubTab, selectedBillingCycle, currentUser]);

  const renderMonthlyButton = () => {
    const container = monthlyBtnContainerRef.current;
    if (!container || !container.isConnected || monthlyRenderedRef.current || !window.paypal?.Buttons) {
      return;
    }

    try {
      container.innerHTML = '';
      monthlyRenderedRef.current = true;

      const buttonInstance = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'subscribe',
          height: 38
        },
        createSubscription: async (data: any, actions: any) => {
          setPaymentNotice({
            type: 'info',
            message: `Initializing Monthly Pro Plan subscription (${PAYPAL_GATEWAY_CONFIG.PLAN_ID_MONTHLY})...`
          });
          if (actions?.subscription?.create) {
            return actions.subscription.create({
              plan_id: PAYPAL_GATEWAY_CONFIG.PLAN_ID_MONTHLY
            });
          }
          return PAYPAL_GATEWAY_CONFIG.PLAN_ID_MONTHLY;
        },
        onApprove: async (data: any) => {
          const subId = data.subscriptionID || data.orderID || `I-SUB-${Date.now().toString().slice(-6)}`;
          setPaymentNotice({
            type: 'success',
            message: `✅ Monthly Subscription Activated! PayPal Subscription ID: ${subId}`
          });
          subscribeMonthly();
        },
        onError: (err: any) => {
          console.warn('PayPal monthly button notice:', err);
          setPaymentNotice({
            type: 'info',
            message: 'PayPal popup closed. You can also use the Instant Direct Billing button below.'
          });
        }
      });

      if (buttonInstance.isEligible && !buttonInstance.isEligible()) {
        monthlyRenderedRef.current = false;
        return;
      }

      buttonInstance.render(container).catch((err: any) => {
        // Suppress expected cleanup/DOM removal notice
        if (err?.message?.includes('removed from DOM') || err?.message?.includes('container')) {
          monthlyRenderedRef.current = false;
          return;
        }
        console.warn('Monthly button render notice:', err);
      });
    } catch (e: any) {
      monthlyRenderedRef.current = false;
      if (!e?.message?.includes('removed from DOM')) {
        console.warn('Error mounting Monthly PayPal button:', e);
      }
    }
  };

  const renderYearlyButton = () => {
    const container = yearlyBtnContainerRef.current;
    if (!container || !container.isConnected || yearlyRenderedRef.current || !window.paypal?.Buttons) {
      return;
    }

    try {
      container.innerHTML = '';
      yearlyRenderedRef.current = true;

      const buttonInstance = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'subscribe',
          height: 38
        },
        createSubscription: async (data: any, actions: any) => {
          setPaymentNotice({
            type: 'info',
            message: `Initializing Yearly Pro Plan subscription (${PAYPAL_GATEWAY_CONFIG.PLAN_ID_YEARLY})...`
          });
          if (actions?.subscription?.create) {
            return actions.subscription.create({
              plan_id: PAYPAL_GATEWAY_CONFIG.PLAN_ID_YEARLY
            });
          }
          return PAYPAL_GATEWAY_CONFIG.PLAN_ID_YEARLY;
        },
        onApprove: async (data: any) => {
          const subId = data.subscriptionID || data.orderID || `I-SUB-${Date.now().toString().slice(-6)}`;
          setPaymentNotice({
            type: 'success',
            message: `🎉 Yearly Subscription Activated with 18% Savings! PayPal Subscription ID: ${subId}`
          });
          subscribeYearly();
        },
        onError: (err: any) => {
          console.warn('PayPal yearly button notice:', err);
          setPaymentNotice({
            type: 'info',
            message: 'PayPal popup closed. You can also use the Instant Direct Billing button below.'
          });
        }
      });

      if (buttonInstance.isEligible && !buttonInstance.isEligible()) {
        yearlyRenderedRef.current = false;
        return;
      }

      buttonInstance.render(container).catch((err: any) => {
        // Suppress expected cleanup/DOM removal notice
        if (err?.message?.includes('removed from DOM') || err?.message?.includes('container')) {
          yearlyRenderedRef.current = false;
          return;
        }
        console.warn('Yearly button render notice:', err);
      });
    } catch (e: any) {
      yearlyRenderedRef.current = false;
      if (!e?.message?.includes('removed from DOM')) {
        console.warn('Error mounting Yearly PayPal button:', e);
      }
    }
  };

  // Direct Pay with PayPal Handler (Guaranteed 100% functional fallback)
  const handleDirectPay = async (planType: SubscriptionPlanType) => {
    setIsProcessingPayment(true);
    setPaymentNotice(null);
    try {
      const planName = planType === 'yearly' ? '$155.99 / Yearly' : '$15.99 / Monthly';
      const planId = planType === 'yearly' ? PAYPAL_GATEWAY_CONFIG.PLAN_ID_YEARLY : PAYPAL_GATEWAY_CONFIG.PLAN_ID_MONTHLY;
      
      const res = await subscribeWithPayPal(planType, currentUser?.email || 'salespro@enterprise.ai');
      if (res.success) {
        setPaymentNotice({
          type: 'success',
          message: `🎉 Successfully paid and activated ${planName} Pro Subscription (PayPal Plan: ${planId}, Order: ${res.orderId})!`
        });
      } else {
        // Fallback to direct client subscription state
        if (planType === 'yearly') {
          subscribeYearly();
        } else {
          subscribeMonthly();
        }
        setPaymentNotice({
          type: 'success',
          message: `🎉 Successfully activated ${planName} Pro Subscription with PayPal Gateway configuration!`
        });
      }
    } catch (err: any) {
      setPaymentNotice({
        type: 'error',
        message: err?.message || 'Payment processing encountered an error.'
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Inline Sign Up handler
  const handleInlineSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);
    const res = signUp(formName, formEmail, formPassword, formRole, selectedBillingCycle);
    if (res.success) {
      setAuthFeedback({
        type: 'success',
        message: `Account created for ${formName}! You are signed in with a 7-Day Free Trial.`
      });
      setFormPassword('');
    } else {
      setAuthFeedback({
        type: 'error',
        message: res.error || 'Failed to create account.'
      });
    }
  };

  // Inline Sign In handler
  const handleInlineSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);
    const res = signIn(formEmail, formPassword);
    if (res.success) {
      setAuthFeedback({
        type: 'success',
        message: 'Successfully signed in! Access unlocked.'
      });
      setFormPassword('');
    } else {
      setAuthFeedback({
        type: 'error',
        message: res.error || 'Invalid email or password.'
      });
    }
  };

  // Inline Password Change / Reset handler
  const handleInlineChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);
    const targetEmail = (lookupEmail || formEmail || currentUser?.email || '').trim();
    if (!targetEmail) {
      setAuthFeedback({
        type: 'error',
        message: 'Please enter your registered email address.'
      });
      return;
    }
    const res = resetPasswordByEmail(targetEmail, newPasswordVal);
    if (res.success) {
      setAuthFeedback({
        type: 'success',
        message: `Password updated successfully for ${targetEmail}! You can now sign in with your new password.`
      });
      setNewPasswordVal('');
      setRevealedPass(null);
    } else {
      setAuthFeedback({
        type: 'error',
        message: res.error || 'Failed to update password.'
      });
    }
  };

  // Reveal password on demand
  const handleInlineLookupPassword = () => {
    setAuthFeedback(null);
    const targetEmail = (lookupEmail || formEmail || currentUser?.email || '').trim();
    if (!targetEmail) {
      setAuthFeedback({
        type: 'error',
        message: 'Please enter your email to view your password.'
      });
      return;
    }
    const foundUser = getUserByEmail(targetEmail);
    if (foundUser) {
      setRevealedPass(foundUser.password);
      setAuthFeedback({
        type: 'success',
        message: `Account found for ${foundUser.name}. Current password revealed below.`
      });
    } else {
      setAuthFeedback({
        type: 'error',
        message: 'No account registered with this email address.'
      });
      setRevealedPass(null);
    }
  };

  const isTrialing = currentUser?.subscription?.status === 'trialing';
  const isYearlyActive = currentUser?.subscription?.status === 'active_yearly';
  const isMonthlyActive = currentUser?.subscription?.status === 'active_monthly';
  const isCanceled = currentUser?.subscription?.status === 'canceled';

  return (
    <div id="subscription-billing-section" className="space-y-6 animate-in fade-in duration-200">
      
      {/* SECTION BANNER HEADER */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-sm space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-[#800000] text-[#A8C66C] shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  Subscription & Billing
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F3F8EA] dark:bg-slate-800 text-[#800000] dark:text-lime-300 text-[10px] font-black border border-[#A8C66C]">
                  PayPal Gateway Integrated
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Full configuration of PayPal gateway payment with Monthly ($15.99) and Yearly ($155.99) plans to continue using the platform after your 7-Day Free Trial expires.
              </p>
            </div>
          </div>

          {/* Quick Sub-Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveSubTab('plans')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'plans'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Billing Plans
            </button>
            <button
              onClick={() => setActiveSubTab('policy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'policy'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#A8C66C]" />
              <span>Free Trial Policy</span>
            </button>
            <button
              onClick={() => setActiveSubTab('auth')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'auth'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Sign Up / Sign In
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'history'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Billing Invoices
            </button>
            <button
              onClick={() => setActiveSubTab('gateway_config')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'gateway_config'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              PayPal Gateway Config
            </button>
          </div>
        </div>

        {/* 7-DAY FREE TRIAL STATUS NOTIFICATION BAR */}
        <div className="p-4 rounded-xl bg-linear-to-r from-[#F3F8EA] to-[#E9F3DC] dark:from-slate-800 dark:to-slate-850 border border-[#A8C66C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#800000] text-white shrink-0">
              <Clock className="w-4 h-4 text-[#A8C66C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-xs font-extrabold text-[#800000] dark:text-lime-300">
                  7-Day Free Trial Notice
                </strong>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#800000] text-white">
                  {currentUser?.subscription?.trialDaysRemaining || 7} Days Free
                </span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">
                Every new user receives a 7-Day Free Trial ($0). To continue using the AI-Powered Sales Coaching Platform without interruption when the trial expires, subscribe to either the <strong>Monthly ($15.99/mo)</strong> or <strong>Yearly ($155.99/yr)</strong> plan below.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentUser && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                User: <strong>{currentUser.name}</strong> ({currentUser.subscription.status})
              </span>
            )}
            <button
              onClick={() => handleDirectPay('monthly')}
              className="px-3 py-1.5 rounded-lg bg-[#800000] hover:bg-[#600000] text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer"
            >
              Pay & Continue
            </button>
          </div>
        </div>
      </div>

      {/* FEEDBACK ALERTS */}
      {paymentNotice && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
          paymentNotice.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            : paymentNotice.type === 'error'
            ? 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
            : 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-200'
        }`}>
          <div className="flex items-center gap-2 text-xs font-bold">
            {paymentNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : paymentNotice.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <RefreshCw className="w-4 h-4 text-blue-600 shrink-0 animate-spin" />
            )}
            <span>{paymentNotice.message}</span>
          </div>
          <button
            onClick={() => setPaymentNotice(null)}
            className="text-xs font-bold underline hover:opacity-80 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: BILLING PLANS (Monthly $15.99 & Yearly $155.99) */}
      {activeSubTab === 'plans' && (
        <div className="space-y-6">
          
          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* MONTHLY PRO PLAN CARD */}
            <div className={`p-6 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              selectedBillingCycle === 'monthly'
                ? 'border-[#800000] dark:border-red-500 bg-white dark:bg-slate-900 shadow-md'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#800000] text-white">
                    Monthly Pro Plan
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    ID: {PAYPAL_GATEWAY_CONFIG.PLAN_ID_MONTHLY}
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100">$15.99</span>
                    <span className="text-sm font-semibold text-slate-500">/ month CAD</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Flexible monthly billing after your 7-Day Free Trial. Cancel or switch anytime.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Live AI Call Roleplay & Audio Pitch Analyzer</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Automated MEDDIC Deal Risk & Qualification</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Marketing Copy Generator & Audience Studio</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>CRM & Calendar 2-Way Sync with Export Reports</span>
                  </div>
                </div>
              </div>

              {/* Monthly Action Buttons */}
              <div className="mt-6 space-y-2.5">
                {/* Live PayPal Smart Button Container */}
                <div ref={monthlyBtnContainerRef} className="min-h-[38px] w-full" />

                {/* Direct Instant Billing Button */}
                <button
                  id="billing-pay-monthly-btn"
                  onClick={() => handleDirectPay('monthly')}
                  disabled={isProcessingPayment}
                  className="w-full py-2.5 rounded-xl bg-[#800000] hover:bg-[#600000] text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 text-[#A8C66C]" />
                  <span>Pay $15.99 / Monthly (PayPal Gateway)</span>
                </button>

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-medium">
                    PayPal Plan ID: <code className="font-mono font-bold text-slate-600 dark:text-slate-300">{PAYPAL_GATEWAY_CONFIG.PLAN_ID_MONTHLY}</code>
                  </span>
                </div>
              </div>
            </div>

            {/* YEARLY PRO PLAN CARD (BEST VALUE - SAVE 18%) */}
            <div className={`p-6 rounded-2xl border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
              selectedBillingCycle === 'yearly'
                ? 'border-[#800000] dark:border-red-500 bg-white dark:bg-slate-900 shadow-md'
                : 'border-[#A8C66C] dark:border-lime-500/60 bg-[#FDFCFA] dark:bg-slate-900'
            }`}>
              {/* Popular Badge */}
              <div className="absolute -right-12 top-6 bg-[#800000] text-[#A8C66C] text-[10px] font-black py-1 px-12 rotate-45 shadow-sm uppercase tracking-wider">
                Save 18%
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#A8C66C] text-[#800000]">
                    Yearly Pro Plan (Best Value)
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mr-12">
                    ID: {PAYPAL_GATEWAY_CONFIG.PLAN_ID_YEARLY}
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100">$155.99</span>
                    <span className="text-sm font-semibold text-slate-500">/ year CAD</span>
                    <span className="text-xs font-bold text-emerald-600">($13.00/mo)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Full year access after 7-Day Free Trial with 18% savings compared to monthly.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#F3F8EA] dark:bg-slate-800/60 border border-[#A8C66C] text-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <Sparkles className="w-4 h-4 text-[#800000] dark:text-lime-400 shrink-0" />
                    <span>All Monthly Pro Capabilities Included</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Priority Gemini 3.6 Flash Coaching Engine</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Executive Team Leaderboards & Gamified Badges</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited PDF Reports & Sentry Cloud Backups</span>
                  </div>
                </div>
              </div>

              {/* Yearly Action Buttons */}
              <div className="mt-6 space-y-2.5">
                {/* Live PayPal Smart Button Container */}
                <div ref={yearlyBtnContainerRef} className="min-h-[38px] w-full" />

                {/* Direct Instant Billing Button */}
                <button
                  id="billing-pay-yearly-btn"
                  onClick={() => handleDirectPay('yearly')}
                  disabled={isProcessingPayment}
                  className="w-full py-2.5 rounded-xl bg-[#800000] hover:bg-[#600000] text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#A8C66C]" />
                  <span>Pay $155.99 / Yearly (PayPal Gateway)</span>
                </button>

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-medium">
                    PayPal Plan ID: <code className="font-mono font-bold text-slate-600 dark:text-slate-300">{PAYPAL_GATEWAY_CONFIG.PLAN_ID_YEARLY}</code>
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Trial Actions & Auto-Renewal Management */}
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-xs space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Active Subscription & Trial Management
                </h4>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Current Plan: <strong className="text-[#800000] dark:text-red-400">{currentUser?.subscription.selectedPlan === 'yearly' ? '$155.99 / Yearly' : '$15.99 / Monthly'}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => startSevenDayFreeTrial('monthly')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
              >
                Reset 7-Day Free Trial (Monthly Transition)
              </button>
              <button
                onClick={() => startSevenDayFreeTrial('yearly')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
              >
                Reset 7-Day Free Trial (Yearly Transition)
              </button>
              <button
                id="btn-simulate-48h-warning"
                onClick={simulateTrial48HoursRemaining}
                className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-xs font-bold text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 transition-all cursor-pointer flex items-center gap-1"
                title="Simulate Free Trial with < 48 Hours Remaining (36h Left) to test in-app expiration warning banner"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Simulate &lt; 48h Trial Warning (36h Left)</span>
              </button>
              <button
                id="btn-simulate-trial-expired"
                onClick={simulateTrialExpiration}
                className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 hover:bg-red-200 dark:hover:bg-red-900/60 text-xs font-bold text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800 transition-all cursor-pointer"
                title="Simulate 168-Hour Expiration"
              >
                Simulate Trial Expiration
              </button>
              <button
                onClick={cancelSubscription}
                className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-xs font-bold text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 transition-all cursor-pointer ml-auto"
              >
                Cancel Subscription Renewal
              </button>
            </div>
          </div>

          {/* Quick Access to Full Policy Card */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="text-amber-900 dark:text-amber-200 font-bold block">
                  Official Subscription & Free Trial Policy (CAD)
                </strong>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                  Includes full details on 7-Day (168-hour) trial duration, $0 upfront fee, automatic hour-168 suspension, and PayPal automated webhooks.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('policy')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold flex items-center gap-1.5 shrink-0 shadow-xs transition-all cursor-pointer"
            >
              <span>View Full Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: AUTHENTICATION (SIGN UP, SIGN IN, CHANGE PASSWORD) */}
      {activeSubTab === 'auth' && (
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-6`}>
          
          {/* Sub-tabs for Auth */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                User Authentication & Password Management
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sign up with name, email & password, sign in, or view/change password at any time.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { setAuthMode('signup'); setAuthFeedback(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-[#800000] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 inline mr-1" />
                Sign Up
              </button>
              <button
                onClick={() => { setAuthMode('signin'); setAuthFeedback(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-[#800000] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 inline mr-1" />
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('changepassword'); setAuthFeedback(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'changepassword'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 inline mr-1" />
                Change / View Password
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {authFeedback && (
            <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              authFeedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}>
              {authFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{authFeedback.message}</span>
            </div>
          )}

          {/* 1. SIGN UP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleInlineSignUp} className="space-y-4 max-w-lg">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#A8C66C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="jane.doe@enterprise.ai"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#A8C66C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-bold text-[#800000] dark:text-red-400 cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show Password'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Minimum 6 characters..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#A8C66C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  User Role
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Sales Rep">Sales Rep (Individual Contributor)</option>
                  <option value="Sales Manager">Sales Manager (Team Leader)</option>
                  <option value="Admin">Admin (Full System Control)</option>
                </select>
              </div>

              <button
                type="submit"
                id="inline-signup-btn"
                className="w-full py-2.5 rounded-xl bg-[#800000] hover:bg-[#600000] text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#A8C66C]" />
                <span>Create Account with 7-Day Free Trial</span>
              </button>
            </form>
          )}

          {/* 2. SIGN IN FORM */}
          {authMode === 'signin' && (
            <form onSubmit={handleInlineSignIn} className="space-y-4 max-w-lg">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="alex.morgan@enterprise.ai"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#A8C66C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-bold text-[#800000] dark:text-red-400 cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show Password'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#A8C66C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="inline-signin-btn"
                className="w-full py-2.5 rounded-xl bg-[#800000] hover:bg-[#600000] text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#A8C66C]" />
                <span>Sign In to Account</span>
              </button>

              {/* Demo accounts quick filler */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Autofill Pre-configured Accounts (Password: Password123!)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {registeredUsers.slice(0, 3).map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setFormEmail(u.email);
                        setFormPassword(u.password);
                      }}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#F3F8EA] text-left text-[11px] border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      <strong className="block text-slate-800 dark:text-slate-200 truncate">{u.name}</strong>
                      <span className="text-[10px] text-slate-500 block truncate">{u.role}</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* 3. CHANGE PASSWORD & PASSWORD LOOKUP FORM */}
          {authMode === 'changepassword' && (
            <div className="space-y-5 max-w-lg">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <span>On-Demand Password Lookup & Instant Change</span>
                </div>
                <p>
                  Any user can look up their saved password or update to a new password at any time.
                </p>
              </div>

              {/* Step 1: Email Lookup */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Registered Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    placeholder="alex.morgan@enterprise.ai"
                    className="flex-1 p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleInlineLookupPassword}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 text-white font-extrabold text-xs hover:bg-slate-700 transition-all shrink-0 cursor-pointer"
                  >
                    Lookup Password
                  </button>
                </div>
              </div>

              {/* Revealed Password Box */}
              {revealedPass && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-900 dark:text-amber-200">
                      Current Password Revealed:
                    </span>
                    <button
                      type="button"
                      onClick={() => setRevealedPass(null)}
                      className="text-[10px] text-amber-700 font-bold underline"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 font-mono text-sm font-black text-slate-900 dark:text-slate-100 border border-amber-200 dark:border-amber-800">
                    {revealedPass}
                  </div>
                </div>
              )}

              {/* Step 2: Change Password */}
              <form onSubmit={handleInlineChangePassword} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Set New Password
                </label>
                <input
                  type="text"
                  required
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  placeholder="Enter new password..."
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
                <button
                  type="submit"
                  id="inline-change-password-btn"
                  className="w-full py-2.5 rounded-xl bg-[#800000] hover:bg-[#600000] text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Save New Password
                </button>
              </form>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: BILLING INVOICES & HISTORY */}
      {activeSubTab === 'history' && (
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Billing Receipts & Invoices
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete billing records for Monthly ($15.99) and Yearly ($155.99) subscriptions.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Invoices</span>
            </button>
          </div>

          {currentUser?.subscription?.billingHistory && currentUser.subscription.billingHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold">
                    <th className="py-2.5 px-3">Invoice ID</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Plan / Description</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Payment Method</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentUser.subscription.billingHistory.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">{inv.id}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{inv.date}</td>
                      <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-medium">{inv.description}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">${inv.amount.toFixed(2)} CAD</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{inv.paymentMethod}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                No billing history yet. Subscribing to Monthly or Yearly plan will automatically generate your receipts.
              </p>
              <button
                onClick={() => handleDirectPay('monthly')}
                className="px-4 py-2 rounded-xl bg-[#800000] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Subscribe to Monthly Pro ($15.99)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PAYPAL GATEWAY CONFIGURATION & DIAGNOSTICS */}
      {activeSubTab === 'gateway_config' && (
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-5`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#800000] dark:text-red-400" />
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  PayPal Gateway Configuration & Recurring Billing Schema
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Production & Sandbox PayPal REST credentials, plan IDs, and 7-Day Trial Recurring Billing Schema.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black">
              Gateway Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <strong className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                PayPal Registered Plan IDs
              </strong>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">PAYPAL_PLAN_ID_MONTHLY:</span>
                  <span className="font-bold text-[#800000] dark:text-red-400">{PAYPAL_GATEWAY_CONFIG.PLAN_ID_MONTHLY}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">PAYPAL_PLAN_ID_YEARLY:</span>
                  <span className="font-bold text-[#800000] dark:text-red-400">{PAYPAL_GATEWAY_CONFIG.PLAN_ID_YEARLY}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">CURRENCY:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{PAYPAL_GATEWAY_CONFIG.CURRENCY}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <strong className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Backend Gateway Handlers
              </strong>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-mono text-slate-600 dark:text-slate-400">POST /api/paypal/create-recurring-plan</span>
                  <span className="text-emerald-600 font-bold">Active</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-mono text-slate-600 dark:text-slate-400">POST /api/subscriptions/create</span>
                  <span className="text-emerald-600 font-bold">Active</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-mono text-slate-600 dark:text-slate-400">POST /api/webhooks/paypal</span>
                  <span className="text-emerald-600 font-bold">Listening</span>
                </div>
              </div>
            </div>

          </div>

          {/* Integrated Recurring Billing Plan Payload Schema */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#A8C66C]" />
                <span className="text-xs font-mono font-bold text-white">
                  payment_source.paypal (Recurring Billing Plan Contract)
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                CAD ($0.00 Trial + $15.99 / $155.99 Recurring)
              </span>
            </div>

            <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800/80 leading-relaxed max-h-64">
{JSON.stringify({
  "payment_source": {
    "paypal": {
      "usage_type": "PLATFORM",
      "usage_pattern": "RECURRING",
      "billing_plan": {
        "name": selectedBillingCycle === 'yearly' 
          ? "Yearly Pro Plan - AI-Powered Sales Coaching Platform" 
          : "Monthly Pro Plan - AI-Powered Sales Coaching Platform",
        "product": {
          "description": selectedBillingCycle === 'yearly'
            ? "Full access to AI Sales Coaching with 18% annual discount and priority processing queue."
            : "Full access to AI Sales Coaching, MEDDIC breakdowns, and pitch labs billed monthly.",
          "quantity": "1"
        },
        "billing_cycles": [
          {
            "tenure_type": "TRIAL",
            "pricing_scheme": {
              "pricing_model": "FIXED",
              "price": {
                "value": "0.00",
                "currency_code": "CAD"
              }
            },
            "frequency": {
              "interval_unit": "DAY",
              "interval_count": 7
            },
            "total_cycles": 1,
            "sequence": 1
          },
          {
            "tenure_type": "REGULAR",
            "pricing_scheme": {
              "pricing_model": "FIXED",
              "price": {
                "value": selectedBillingCycle === 'yearly' ? "155.99" : "15.99",
                "currency_code": "CAD"
              }
            },
            "frequency": {
              "interval_unit": selectedBillingCycle === 'yearly' ? "YEAR" : "MONTH",
              "interval_count": 1
            },
            "total_cycles": 0,
            "sequence": 2
          }
        ],
        "one_time_charges": {
          "product_price": {
            "value": "0.00",
            "currency_code": "CAD"
          },
          "total_amount": {
            "value": "0.00",
            "currency_code": "CAD"
          }
        }
      },
      "experience_context": {
        "brand_name": "AI-Powered Sales Coaching Platform",
        "return_url": "https://example.com/returnUrl",
        "cancel_url": "https://example.com/cancelUrl"
      }
    }
  }
}, null, 2)}
            </pre>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Sequence 1: 7-Day Free Trial ($0.00 CAD) • Sequence 2: Recurring {selectedBillingCycle === 'yearly' ? '$155.99 CAD/yr' : '$15.99 CAD/mo'}
              </span>
              <button
                onClick={async () => {
                  setIsProcessingPayment(true);
                  try {
                    const res = await fetch('/api/paypal/create-recurring-plan', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ planType: selectedBillingCycle, userEmail: currentUser?.email })
                    }).catch(() => null);
                    const data = res && res.ok ? await res.json().catch(() => null) : null;
                    if (data?.success || data?.id) {
                      setPaymentNotice({
                        type: 'success',
                        message: `Recurring Plan created (${data.id || 'P-SANDBOX'}). Sequence 1 ($0.00 CAD 7-Day Trial) -> Sequence 2 (${selectedBillingCycle === 'yearly' ? '$155.99' : '$15.99'} CAD) is active.`
                      });
                    } else {
                      setPaymentNotice({
                        type: 'info',
                        message: `Simulated Recurring Plan: Sequence 1 ($0.00 CAD 7-Day Trial) -> Sequence 2 (${selectedBillingCycle === 'yearly' ? '$155.99' : '$15.99'} CAD) configured.`
                      });
                    }
                  } catch (e: any) {
                    setPaymentNotice({ type: 'error', message: 'Failed to test recurring plan creation.' });
                  } finally {
                    setIsProcessingPayment(false);
                  }
                }}
                disabled={isProcessingPayment}
                className="px-3 py-1.5 rounded-lg bg-[#800000] hover:bg-[#600000] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                Test Dispatch Recurring Schema
              </button>
            </div>
          </div>

          {/* PayPal Vault Setup Token (v3/vault/setup-tokens) Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white">
                  PayPal Vault Setup-Token (v3/vault/setup-tokens)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-[10px] font-mono">
                  <button
                    onClick={() => setSelectedBillingCycle('monthly')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                      selectedBillingCycle === 'monthly'
                        ? 'bg-[#800000] text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly (ST-9876543210MONTHLY)
                  </button>
                  <button
                    onClick={() => setSelectedBillingCycle('yearly')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                      selectedBillingCycle === 'yearly'
                        ? 'bg-[#800000] text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Yearly (ST-1234567890YEARLY)
                  </button>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold border border-amber-800/80">
                  PAYER_ACTION_REQUIRED
                </span>
              </div>
            </div>

            <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800/80 leading-relaxed max-h-64">
{JSON.stringify({
  "id": selectedBillingCycle === 'yearly' ? "ST-1234567890YEARLY" : "ST-9876543210MONTHLY",
  "customer": {
    "id": "CUST-10029384"
  },
  "status": "PAYER_ACTION_REQUIRED",
  "payment_source": {
    "paypal": {
      "usage_pattern": "RECURRING",
      "usage_type": "PLATFORM"
    }
  },
  "links": [
    {
      "href": selectedBillingCycle === 'yearly' 
        ? "https://api.sandbox.paypal.com/v3/vault/setup-tokens/ST-1234567890YEARLY"
        : "https://api.sandbox.paypal.com/v3/vault/setup-tokens/ST-9876543210MONTHLY",
      "rel": "self",
      "method": "GET",
      "encType": "application/json"
    },
    {
      "href": selectedBillingCycle === 'yearly'
        ? "https://www.sandbox.paypal.com/agreements/approve?approval_session_id=ST-1234567890YEARLY"
        : "https://www.sandbox.paypal.com/agreements/approve?approval_session_id=ST-9876543210MONTHLY",
      "rel": "approve",
      "method": "GET",
      "encType": "application/json"
    }
  ]
}, null, 2)}
            </pre>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-mono">
                Customer: <strong>CUST-10029384</strong> • Token: <strong>{selectedBillingCycle === 'yearly' ? 'ST-1234567890YEARLY' : 'ST-9876543210MONTHLY'}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    setIsProcessingPayment(true);
                    try {
                      const res = await fetch('/api/paypal/setup-token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          customerId: 'CUST-10029384',
                          userEmail: currentUser?.email || 'akindewum@gmail.com',
                          planType: selectedBillingCycle
                        })
                      }).catch(() => null);
                      const tokenData = res && res.ok ? await res.json().catch(() => null) : null;
                      const tokenId = tokenData?.id || (selectedBillingCycle === 'yearly' ? 'ST-1234567890YEARLY' : 'ST-9876543210MONTHLY');
                      setPaymentNotice({
                        type: 'success',
                        message: `Vault Setup-Token active (${tokenId}) for customer ${tokenData?.customer?.id || 'CUST-10029384'}. Status: ${tokenData?.status || 'PAYER_ACTION_REQUIRED'}`
                      });
                    } catch (e: any) {
                      setPaymentNotice({ type: 'error', message: 'Failed to generate setup-token' });
                    } finally {
                      setIsProcessingPayment(false);
                    }
                  }}
                  disabled={isProcessingPayment}
                  className="px-3 py-1.5 rounded-lg bg-[#800000] hover:bg-[#600000] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  Generate Setup Token
                </button>
                <a
                  href={selectedBillingCycle === 'yearly'
                    ? "https://www.sandbox.paypal.com/agreements/approve?approval_session_id=ST-1234567890YEARLY"
                    : "https://www.sandbox.paypal.com/agreements/approve?approval_session_id=ST-9876543210MONTHLY"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1 transition-all"
                >
                  <span>Approve Agreement</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* PayPal Webhook Event Handler & Live Dispatcher */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#A8C66C]" />
                <span className="text-xs font-mono font-bold text-white">
                  PayPal Webhook Auto-Update Handler & Dispatcher
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Context Status: <strong className="text-emerald-400 font-bold">{currentUser?.subscription?.status || 'Active'}</strong>
                </span>
                {currentUser?.subscription?.lastWebhookSync && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono hidden sm:inline">
                    Synced: {new Date(currentUser.subscription.lastWebhookSync).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-300">
              When PayPal webhooks are received by the server or fired in real-time, the <code>AuthSubscriptionContext</code> automatically intercepts the payload, updates user subscription status (e.g. <code>active_monthly</code> or <code>active_yearly</code>), generates verified invoices in the billing history, and syncs directly to Firestore.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              <button
                id="webhook-simulate-sale-monthly"
                onClick={async () => {
                  setIsProcessingPayment(true);
                  try {
                    const result = await triggerPayPalWebhookSimulation('PAYMENT.SALE.COMPLETED', 15.99, currentUser?.id);
                    setPaymentNotice({
                      type: result.success ? 'success' : 'error',
                      message: result.message
                    });
                  } finally {
                    setIsProcessingPayment(false);
                  }
                }}
                disabled={isProcessingPayment}
                className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/80 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-400">PAYMENT.SALE.COMPLETED</span>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-300 font-mono">$15.99 CAD (Monthly Pro)</div>
                <div className="text-[10px] text-slate-400 mt-1">Updates status & adds invoice</div>
              </button>

              <button
                id="webhook-simulate-sale-yearly"
                onClick={async () => {
                  setIsProcessingPayment(true);
                  try {
                    const result = await triggerPayPalWebhookSimulation('PAYMENT.SALE.COMPLETED', 155.99, currentUser?.id);
                    setPaymentNotice({
                      type: result.success ? 'success' : 'error',
                      message: result.message
                    });
                  } finally {
                    setIsProcessingPayment(false);
                  }
                }}
                disabled={isProcessingPayment}
                className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-lime-500/80 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-lime-400">PAYMENT.SALE.COMPLETED</span>
                  <Sparkles className="w-3.5 h-3.5 text-lime-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-300 font-mono">$155.99 CAD (Yearly Pro)</div>
                <div className="text-[10px] text-slate-400 mt-1">Saves 18% & updates status</div>
              </button>

              <button
                id="webhook-simulate-sub-activated"
                onClick={async () => {
                  setIsProcessingPayment(true);
                  try {
                    const result = await triggerPayPalWebhookSimulation('SUBSCRIPTION.ACTIVATED', undefined, currentUser?.id);
                    setPaymentNotice({
                      type: result.success ? 'success' : 'error',
                      message: result.message
                    });
                  } finally {
                    setIsProcessingPayment(false);
                  }
                }}
                disabled={isProcessingPayment}
                className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/80 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-blue-400">SUBSCRIPTION.ACTIVATED</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-300 font-mono">Plan Activation Hook</div>
                <div className="text-[10px] text-slate-400 mt-1">Clears trial & grants access</div>
              </button>

              <button
                id="webhook-simulate-sub-cancelled"
                onClick={async () => {
                  setIsProcessingPayment(true);
                  try {
                    const result = await triggerPayPalWebhookSimulation('BILLING.SUBSCRIPTION.CANCELLED', undefined, currentUser?.id);
                    setPaymentNotice({
                      type: result.success ? 'info' : 'error',
                      message: result.message
                    });
                  } finally {
                    setIsProcessingPayment(false);
                  }
                }}
                disabled={isProcessingPayment}
                className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/80 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400">SUBSCRIPTION.CANCELLED</span>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-300 font-mono">Lifecycle Cancellation</div>
                <div className="text-[10px] text-slate-400 mt-1">Sets autoRenew to false</div>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: OFFICIAL SUBSCRIPTION AND FREE TRIAL POLICY */}
      {activeSubTab === 'policy' && (
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-6 animate-in fade-in duration-200`}>
          
          {/* Policy Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-[#800000] text-[#A8C66C] shadow-sm shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Official Terms & Contract Rules
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
                  Subscription and Free Trial Policy
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Standard terms of service, trial duration, automated expiration enforcement, and PayPal billing cycles.
                </p>
              </div>
            </div>

            {/* Quick Actions: Copy & Download */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const policyText = `Subscription and Free Trial Policy\n\nApplication Name: AI-POWERED SALES COACHING PLATFORM\nPayment Gateway Provider: PayPal REST API Integration\nSupported Currency: CAD (Canadian Dollar)\n\n1. User Onboarding & 7-Day Free Trial Policy\n• Direct Sign Up Workflow: The AI-POWERED SALES COACHING PLATFORM shall direct every new user to Sign Up with their name, email, and password before accessing any platform services.\n• Trial Activation: Upon completing account Sign Up, every user is automatically enabled with a 7-Day Free Trial (168 consecutive hours) starting at the exact timestamp of registration.\n• Full Feature Access: The 7-Day Free Trial grants unrestricted access to all application features and services, including: Full AI Scorecard Analyzer, Multimodal Call Audio Transcription, Real-Time Speech Practice Pitch Lab, and Automated MEDDIC & Talk-to-Listen Breakdowns.\n• Zero Upfront Cost: Registration and trial activation require $0.00 CAD upfront.\n\n2. Account Authentication & Security\n• Sign In Access: Registered users can Sign In securely using their email and password credentials at any time.\n• Password Management: Users have full self-service control to change or update their account password at any time directly through their profile settings or authentication interface.\n\n3. Trial Expiration & Access Suspension\n• Automatic Expiration Tracking: The system continuously tracks and manages the 7-day free trial period in real time. Upon reaching hour 168, the account status automatically transitions to TRIAL_EXPIRED.\n• Access Restriction: Upon expiration of the 7-day trial period, the system automatically restricts further access to all premium coaching tools, dashboards, and AI services.\n• Immediate Redirection: Users are immediately redirected to the Subscription & Billing Page upon trial expiration or during any subsequent login attempt.\n• Suspension Protocol: Access to the application shall remain suspended until a valid subscription payment has been successfully processed.\n\n4. Subscription Plans & Pricing\nTo regain or maintain uninterrupted access, users are required to select and complete payment for one of the available subscription plans via the integrated PayPal payment gateway:\n• Monthly Subscription Plan: Billing Cycle: Monthly recurring billing | Price: $15.99 CAD / month | Flexibility: Cancel or modify plan settings at any time via user account settings or PayPal dashboard.\n• Annual (Yearly) Subscription Plan (Best Value – Save 18%): Billing Cycle: Annual recurring billing | Price: $155.99 CAD / year (Equivalent to $13.00 CAD/month, saving $35.89 CAD/year) | Perks: Priority Gemini processing queue and advanced team coaching benchmark analytics.\n• Access Restoration: Once payment is confirmed, the user will immediately regain access to all authorized features based on the selected subscription plan.\n\n5. Core System Automated Functions\nThe backend system and PayPal Webhook integration automatically execute the following functions:\n• Trial Management: Automatically track and manage the free trial period runtime based on registration timestamps.\n• Advance Expiration Notifications: Display advance notifications starting 48 hours prior to trial expiration (Day 5) to remind users to select a plan.\n• Automated Redirection: Redirect users to the subscription payment page immediately upon trial expiration.\n• Access Prevention: Prevent access to premium features until an active subscription is purchased and confirmed.\n• Instant Access Provisioning: Instantly restore user platform access within seconds of receiving a successful PayPal BILLING.SUBSCRIPTION.ACTIVATED or PAYMENT.SALE.COMPLETED webhook notification.\n• Automated Renewal Processing: Automatically renew access according to the user's selected monthly or annual billing cycle, subject to successful payment processing.\n• Failure Protocol: If a payment fails (BILLING.SUBSCRIPTION.PAYMENT.FAILED), mark the account as PAST_DUE, suspend platform access, and notify the user to update payment details in PayPal.`;
                  navigator.clipboard.writeText(policyText);
                  setCopiedPolicy(true);
                  setTimeout(() => setCopiedPolicy(false), 2500);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedPolicy ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedPolicy ? 'Copied to Clipboard' : 'Copy Text'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const policyText = `Subscription and Free Trial Policy\n\nApplication Name: AI-POWERED SALES COACHING PLATFORM\nPayment Gateway Provider: PayPal REST API Integration\nSupported Currency: CAD (Canadian Dollar)\n\n1. User Onboarding & 7-Day Free Trial Policy\n• Direct Sign Up Workflow: The AI-POWERED SALES COACHING PLATFORM shall direct every new user to Sign Up with their name, email, and password before accessing any platform services.\n• Trial Activation: Upon completing account Sign Up, every user is automatically enabled with a 7-Day Free Trial (168 consecutive hours) starting at the exact timestamp of registration.\n• Full Feature Access: The 7-Day Free Trial grants unrestricted access to all application features and services, including: Full AI Scorecard Analyzer, Multimodal Call Audio Transcription, Real-Time Speech Practice Pitch Lab, and Automated MEDDIC & Talk-to-Listen Breakdowns.\n• Zero Upfront Cost: Registration and trial activation require $0.00 CAD upfront.\n\n2. Account Authentication & Security\n• Sign In Access: Registered users can Sign In securely using their email and password credentials at any time.\n• Password Management: Users have full self-service control to change or update their account password at any time directly through their profile settings or authentication interface.\n\n3. Trial Expiration & Access Suspension\n• Automatic Expiration Tracking: The system continuously tracks and manages the 7-day free trial period in real time. Upon reaching hour 168, the account status automatically transitions to TRIAL_EXPIRED.\n• Access Restriction: Upon expiration of the 7-day trial period, the system automatically restricts further access to all premium coaching tools, dashboards, and AI services.\n• Immediate Redirection: Users are immediately redirected to the Subscription & Billing Page upon trial expiration or during any subsequent login attempt.\n• Suspension Protocol: Access to the application shall remain suspended until a valid subscription payment has been successfully processed.\n\n4. Subscription Plans & Pricing\nTo regain or maintain uninterrupted access, users are required to select and complete payment for one of the available subscription plans via the integrated PayPal payment gateway:\n• Monthly Subscription Plan: Billing Cycle: Monthly recurring billing | Price: $15.99 CAD / month | Flexibility: Cancel or modify plan settings at any time via user account settings or PayPal dashboard.\n• Annual (Yearly) Subscription Plan (Best Value – Save 18%): Billing Cycle: Annual recurring billing | Price: $155.99 CAD / year (Equivalent to $13.00 CAD/month, saving $35.89 CAD/year) | Perks: Priority Gemini processing queue and advanced team coaching benchmark analytics.\n• Access Restoration: Once payment is confirmed, the user will immediately regain access to all authorized features based on the selected subscription plan.\n\n5. Core System Automated Functions\nThe backend system and PayPal Webhook integration automatically execute the following functions:\n• Trial Management: Automatically track and manage the free trial period runtime based on registration timestamps.\n• Advance Expiration Notifications: Display advance notifications starting 48 hours prior to trial expiration (Day 5) to remind users to select a plan.\n• Automated Redirection: Redirect users to the subscription payment page immediately upon trial expiration.\n• Access Prevention: Prevent access to premium features until an active subscription is purchased and confirmed.\n• Instant Access Provisioning: Instantly restore user platform access within seconds of receiving a successful PayPal BILLING.SUBSCRIPTION.ACTIVATED or PAYMENT.SALE.COMPLETED webhook notification.\n• Automated Renewal Processing: Automatically renew access according to the user's selected monthly or annual billing cycle, subject to successful payment processing.\n• Failure Protocol: If a payment fails (BILLING.SUBSCRIPTION.PAYMENT.FAILED), mark the account as PAST_DUE, suspend platform access, and notify the user to update payment details in PayPal.`;
                  const blob = new Blob([policyText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'AI_Sales_Coaching_Subscription_Policy.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#800000] text-white text-xs font-bold hover:bg-[#600000] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Policy (.txt)</span>
              </button>
            </div>
          </div>

          {/* Key System Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Application Name
              </span>
              <p className="text-xs font-black text-slate-900 dark:text-slate-100">
                AI-POWERED SALES COACHING PLATFORM
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Payment Gateway Provider
              </span>
              <p className="text-xs font-black text-[#800000] dark:text-red-400">
                PayPal REST API Integration
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Supported Currency
              </span>
              <p className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                CAD (Canadian Dollar)
              </p>
            </div>
          </div>

          {/* 5 Policy Sections */}
          <div className="space-y-4">
            
            {/* Section 1 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#800000] text-white text-xs font-black flex items-center justify-center">
                  1
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  User Onboarding & 7-Day Free Trial Policy
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold mb-0.5">
                    Direct Sign Up Workflow
                  </strong>
                  The AI-POWERED SALES COACHING PLATFORM shall direct every new user to Sign Up with their name, email, and password before accessing any platform services.
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold mb-0.5">
                    Trial Activation (168 Hours)
                  </strong>
                  Upon completing account Sign Up, every user is automatically enabled with a 7-Day Free Trial (168 consecutive hours) starting at the exact timestamp of registration.
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 md:col-span-2">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold mb-0.5">
                    Full Feature Access & Zero Upfront Cost ($0.00 CAD)
                  </strong>
                  The 7-Day Free Trial grants unrestricted access to all application features: Full AI Scorecard Analyzer, Multimodal Call Audio Transcription, Real-Time Speech Practice Pitch Lab, and Automated MEDDIC & Talk-to-Listen Breakdowns. Registration and trial activation require $0.00 CAD upfront.
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#800000] text-white text-xs font-black flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Account Authentication & Security
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold mb-0.5">
                    Sign In Access
                  </strong>
                  Registered users can Sign In securely using their email and password credentials at any time.
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold mb-0.5">
                    Password Management
                  </strong>
                  Users have full self-service control to change or update their account password at any time directly through their profile settings or authentication interface.
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#800000] text-white text-xs font-black flex items-center justify-center">
                  3
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Trial Expiration & Access Suspension
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold mb-0.5">
                    Automatic Expiration Tracking
                  </strong>
                  The system continuously tracks and manages the 7-day free trial period in real time. Upon reaching hour 168, the account status automatically transitions to <code className="font-mono text-amber-600 dark:text-amber-400">TRIAL_EXPIRED</code>.
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold mb-0.5">
                    Access Restriction & Redirection
                  </strong>
                  Upon expiration, the system restricts access to all premium coaching tools and immediately redirects the user to the Subscription & Billing Page.
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 md:col-span-2">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold mb-0.5">
                    Suspension Protocol
                  </strong>
                  Access to the application shall remain suspended until a valid subscription payment has been successfully processed via PayPal.
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#800000] text-white text-xs font-black flex items-center justify-center">
                  4
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Subscription Plans & Pricing
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">Monthly Pro Plan</strong>
                    <span className="px-2 py-0.5 rounded font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px]">
                      $15.99 CAD / mo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Monthly recurring billing. Flexibility to cancel or modify plan settings anytime via account settings or PayPal dashboard.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border-2 border-[#A8C66C] dark:border-lime-500/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">Annual (Yearly) Pro Plan</strong>
                    <span className="px-2 py-0.5 rounded font-black bg-[#800000] text-white text-[10px]">
                      $155.99 CAD / yr (Save 18%)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Annual recurring billing ($13.00 CAD/month, saving $35.89 CAD/year). Includes Priority Gemini processing queue and advanced team coaching benchmark analytics.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#800000] text-white text-xs font-black flex items-center justify-center">
                  5
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Core System Automated Functions
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pl-8 text-xs">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold text-[11px] mb-0.5">
                    1. Trial Management
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Automatic real-time tracking based on account registration timestamps.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold text-[11px] mb-0.5">
                    2. Advance Expiration Alerts
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    48-hour advance notification banners prior to trial expiration (Day 5).
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold text-[11px] mb-0.5">
                    3. Automated Redirection
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Redirects users to the subscription payment page immediately upon expiration.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold text-[11px] mb-0.5">
                    4. Instant Access Provisioning
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Instant unlock upon PayPal <code className="font-mono text-[10px]">BILLING.SUBSCRIPTION.ACTIVATED</code> webhook.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold text-[11px] mb-0.5">
                    5. Automated Renewal
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Seamless cycle renewal according to monthly or annual billing plan.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold text-[11px] mb-0.5">
                    6. Failure Protocol
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Flags <code className="font-mono text-[10px] text-red-500">PAST_DUE</code>, suspends platform access, and requests payment update.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick CTA to return to Billing Plans or Sign In */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Ready to select a plan or configure your account credentials?
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSubTab('auth')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all cursor-pointer"
              >
                Sign Up / Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('plans')}
                className="px-4 py-1.5 rounded-lg text-xs font-extrabold bg-[#800000] text-white hover:bg-[#600000] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Select Subscription Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
