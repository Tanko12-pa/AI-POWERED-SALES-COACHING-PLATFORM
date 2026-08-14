import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart, CheckCircle2, ShieldCheck, Sparkles, RefreshCw, ExternalLink } from 'lucide-react';
import { useAuthSubscription } from '../context/AuthSubscriptionContext';

declare global {
  interface Window {
    paypal?: any;
    cartPaypal?: any;
  }
}

interface PayPalHostedButtonsCheckoutProps {
  onPlanSelected?: (planType: 'monthly' | 'yearly') => void;
}

export const PayPalHostedButtonsCheckout: React.FC<PayPalHostedButtonsCheckoutProps> = ({
  onPlanSelected
}) => {
  const { currentUser, subscribeMonthly, subscribeYearly } = useAuthSubscription();
  const [isLoaded, setIsLoaded] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [cartInitialized, setCartInitialized] = useState(false);

  const monthlyContainerRef = useRef<HTMLDivElement>(null);
  const yearlyContainerRef = useRef<HTMLDivElement>(null);
  const cartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let checkCount = 0;
    const interval = setInterval(() => {
      checkCount++;
      const hasPayPal = typeof window !== 'undefined' && window.paypal && window.paypal.HostedButtons;
      const hasCart = typeof window !== 'undefined' && window.cartPaypal && window.cartPaypal.Cart;

      if (hasPayPal) {
        setIsLoaded(true);
        clearInterval(interval);
        renderButtons();
      } else if (checkCount > 15) {
        clearInterval(interval);
        // If not loaded from CDN yet, set fallback state
        setIsLoaded(true);
        renderButtons();
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const renderButtons = () => {
    try {
      // 1. Initialize Cart Button
      if (window.cartPaypal && typeof window.cartPaypal.Cart === 'function') {
        try {
          window.cartPaypal.Cart({ id: 'pp-view-cart' });
          setCartInitialized(true);
        } catch (cartErr) {
          console.warn('Cart initialization notice:', cartErr);
        }
      }

      // 2. Render Monthly Hosted Button (UQL32X2486VFE)
      if (window.paypal && typeof window.paypal.HostedButtons === 'function') {
        if (monthlyContainerRef.current) {
          monthlyContainerRef.current.innerHTML = '';
          try {
            window.paypal.HostedButtons({
              hostedButtonId: 'UQL32X2486VFE'
            }).render('#paypal-container-UQL32X2486VFE');
          } catch (err: any) {
            console.warn('Monthly button render:', err);
          }
        }

        // 3. Render Yearly Hosted Button (9PNWMPCYHANUA)
        if (yearlyContainerRef.current) {
          yearlyContainerRef.current.innerHTML = '';
          try {
            window.paypal.HostedButtons({
              hostedButtonId: '9PNWMPCYHANUA'
            }).render('#paypal-container-9PNWMPCYHANUA');
          } catch (err: any) {
            console.warn('Yearly button render:', err);
          }
        }
      }
    } catch (e: any) {
      console.error('Error rendering PayPal hosted buttons:', e);
      setInitError(e?.message || 'Initialization notice');
    }
  };

  const handleSimulateMonthly = () => {
    subscribeMonthly();
    if (onPlanSelected) onPlanSelected('monthly');
  };

  const handleSimulateYearly = () => {
    subscribeYearly();
    if (onPlanSelected) onPlanSelected('yearly');
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-2 px-1">
      {/* Top Header Bar with View Cart */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Select a Subscription Plan
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-[10px] uppercase">
              CAD Currency
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Instant activation powered by PayPal Hosted Buttons & Shopping Cart Gateway
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Custom element for PayPal Shopping Cart button */}
          <div
            ref={cartContainerRef}
            className="relative flex items-center min-w-[120px]"
            dangerouslySetInnerHTML={{ __html: '<paypal-cart-button data-id="pp-view-cart"></paypal-cart-button>' }}
          />

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Merchant ID: VPDDGW7BB8CAW</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Monthly Subscription Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between text-center relative transition-all hover:shadow-md">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-black uppercase tracking-wider mb-3">
              Flexible Monthly
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1">
              Monthly Plan
            </h3>
            <div className="text-lg font-extrabold text-[#0070ba] dark:text-blue-400 my-3">
              Billed Monthly (CAD)
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto mb-4">
              Full access to AI Studio sales coaching features with flexible monthly billing.
            </p>

            <ul className="text-left text-xs text-slate-600 dark:text-slate-300 space-y-2 py-3 border-y border-slate-100 dark:border-slate-800 my-4 max-w-xs mx-auto">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Unlimited AI Roleplay Pitch Simulations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Full Access to Sales Objection Playbooks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Real-time Speech Pace & Transcript Analytics</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* PayPal Hosted Button container (UQL32X2486VFE) */}
            <div className="min-h-[140px] flex flex-col justify-center">
              <div id="paypal-container-UQL32X2486VFE" ref={monthlyContainerRef} className="w-full my-auto"></div>
            </div>

            {/* Direct fallback trigger for sandbox testing */}
            <button
              onClick={handleSimulateMonthly}
              className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#0070ba] hover:bg-[#003087] text-white text-xs font-black transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <span className="italic font-black text-sm">PayPal</span>
              <span>Direct Monthly Checkout (CAD)</span>
            </button>
          </div>
        </div>

        {/* Yearly Subscription Card (Popular / Best Value) */}
        <div className="bg-white dark:bg-slate-900 border-2 border-[#0070ba] rounded-2xl p-6 shadow-md flex flex-col justify-between text-center relative transition-all hover:shadow-lg">
          {/* Best Value Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0070ba] text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Best Value
          </div>

          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0070ba] dark:text-blue-300 text-[11px] font-black uppercase tracking-wider mb-3 mt-1">
              Save with Annual Billing
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1">
              Yearly Plan
            </h3>
            <div className="text-lg font-extrabold text-[#0070ba] dark:text-blue-400 my-3">
              Billed Annually (CAD)
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto mb-4">
              Save on long-term access to all AI Studio features and advanced executive tools.
            </p>

            <ul className="text-left text-xs text-slate-600 dark:text-slate-300 space-y-2 py-3 border-y border-slate-100 dark:border-slate-800 my-4 max-w-xs mx-auto">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0070ba] shrink-0" />
                <span>Everything in Monthly Plan included</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0070ba] shrink-0" />
                <span>18% Annual Discount Applied Automatically</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0070ba] shrink-0" />
                <span>Priority Speech Model Fine-Tuning & Audio Exports</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0070ba] shrink-0" />
                <span>Executive Performance Reports & Certificate Badges</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* PayPal Hosted Button container (9PNWMPCYHANUA) */}
            <div className="min-h-[140px] flex flex-col justify-center">
              <div id="paypal-container-9PNWMPCYHANUA" ref={yearlyContainerRef} className="w-full my-auto"></div>
            </div>

            {/* Direct fallback trigger for sandbox testing */}
            <button
              onClick={handleSimulateYearly}
              className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#0070ba] hover:bg-[#003087] text-white text-xs font-black transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <span className="italic font-black text-sm">PayPal</span>
              <span>Direct Yearly Checkout (CAD - Best Value)</span>
            </button>
          </div>
        </div>

      </div>

      {/* Security & Credentials Footer */}
      <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-[#003087] text-white font-black text-xs italic">
            PayPal
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">
              Hosted Buttons SDK Active (Client: BAAQYP2n500D...Vsr4gv4)
            </div>
            <div className="text-[11px] text-slate-500">
              Button IDs: Monthly (UQL32X2486VFE) • Yearly (9PNWMPCYHANUA) • Shopping Cart (pp-view-cart)
            </div>
          </div>
        </div>

        <button
          onClick={renderButtons}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Buttons</span>
        </button>
      </div>
    </div>
  );
};
