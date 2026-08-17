import React from 'react';
import { X, Sparkles, CreditCard } from 'lucide-react';
import { useAuthSubscription } from '../context/AuthSubscriptionContext';
import { SubscriptionBillingSection } from './SubscriptionBillingSection';

interface SubscriptionPlansModalProps {
  isDarkMode?: boolean;
}

export const SubscriptionPlansModal: React.FC<SubscriptionPlansModalProps> = ({ isDarkMode = false }) => {
  const { isSubscriptionModalOpen, closeSubscriptionModal } = useAuthSubscription();

  if (!isSubscriptionModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className={`border rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-auto max-h-[90vh] animate-in zoom-in-95 duration-200 transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 shrink-0 transition-colors ${
          isDarkMode ? 'border-slate-800 bg-slate-800/80 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#800000] text-[#A8C66C] shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">
                Subscription & Billing
              </h3>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Sign up, sign in, or pay for Monthly ($15.99) or Yearly ($155.99) with PayPal Gateway.
              </p>
            </div>
          </div>

          <button
            onClick={closeSubscriptionModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <SubscriptionBillingSection isDarkMode={isDarkMode} />
        </div>

      </div>
    </div>
  );
};

