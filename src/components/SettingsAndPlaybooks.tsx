import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle,
  ExternalLink,
  Shield,
  Key,
  Database,
  Calendar,
  MessageSquare,
  Sparkles,
  Plus,
  Zap,
  CreditCard,
  UserCheck,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Clock,
  ArrowRight
} from 'lucide-react';
import { PlaybookDoc } from '../types';
import { useAuthSubscription } from '../context/AuthSubscriptionContext';

interface SettingsAndPlaybooksProps {
  playbooks: PlaybookDoc[];
  onUploadDoc: (doc: PlaybookDoc) => void;
  onDeleteDoc: (id: string) => void;
  onSyncIntegrations: () => void;
}

export const SettingsAndPlaybooks: React.FC<SettingsAndPlaybooksProps> = ({
  playbooks,
  onUploadDoc,
  onDeleteDoc,
  onSyncIntegrations
}) => {
  const {
    currentUser,
    isAuthenticated,
    openAuthModal,
    openSubscriptionModal,
    subscribeMonthly,
    subscribeYearly,
    subscribeWithPayPal,
    signOut,
    registeredUsers
  } = useAuthSubscription();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<'playbook' | 'product_sheet' | 'pricing' | 'objection_handling'>('playbook');
  const [snippet, setSnippet] = useState('');
  const [showPasswordInMemory, setShowPasswordInMemory] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newDoc: PlaybookDoc = {
      id: `doc-${Date.now()}`,
      title,
      type: docType,
      fileSize: '1.5 MB',
      uploadDate: todayStr,
      contentSnippet: snippet || 'Grounded sales playbook document for Gemini File Search indexing.',
      indexedInSearch: true
    };

    onUploadDoc(newDoc);
    setTitle('');
    setSnippet('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 7-DAY FREE TRIAL, UNCONNECTED PLANS & AUTHENTICATION CENTER */}
      <div className="bg-white rounded-xl border-2 border-[#A8C66C] p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#800000] text-white text-[10px] font-black uppercase tracking-wider">
                Account & Billing
              </span>
              <h3 className="text-base font-extrabold text-[#800000] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#A8C66C]" />
                7-Day Free Trial & Standalone Subscriptions ($15.99 / $155.99)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your trial period, view auto-transition settings, reveal or update credentials, and subscribe to standalone plans.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Sign In (Reveal Password)
                </button>
                <button
                  onClick={() => openAuthModal('trial')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#800000] text-white text-xs font-black hover:bg-[#600000] shadow-xs cursor-pointer"
                >
                  Start 7-Day Free Trial
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('profile')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#800000]" />
                  <span>Reveal Password</span>
                </button>
                <button
                  onClick={() => openSubscriptionModal('plans')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#800000] text-white text-xs font-black hover:bg-[#600000] shadow-xs cursor-pointer"
                >
                  Subscription Plans
                </button>
              </>
            )}
          </div>
        </div>

        {/* Current User Status & Password Info Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* User & Password Status */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Active User & Credential Access
              </span>
              <strong className="text-sm font-extrabold text-slate-900 block">
                {currentUser?.name || 'Guest User'}
              </strong>
              <span className="text-xs text-slate-500 block truncate">{currentUser?.email || 'akindewum@gmail.com'}</span>
              
              {/* Password in Sign In button feature */}
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#800000]" />
                  <span className="text-xs font-semibold text-slate-700">Account Password:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {showPasswordInMemory ? (currentUser?.password || '••••••••') : '••••••••'}
                  </span>
                  <button
                    onClick={() => setShowPasswordInMemory(!showPasswordInMemory)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    title={showPasswordInMemory ? 'Hide password' : 'Reveal password'}
                  >
                    {showPasswordInMemory ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => openAuthModal('profile')}
              className="mt-3 text-left text-xs font-bold text-[#800000] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Manage password & login settings</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 7-Day Free Trial Details */}
          <div className="p-4 rounded-xl bg-[#F3F8EA] border border-[#A8C66C] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8BA854] block mb-1">
                  7-Day Free Trial
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#800000] text-white text-[9px] font-black">
                  {currentUser?.subscription.status === 'trialing' ? 'Active' : 'Available'}
                </span>
              </div>
              <strong className="text-sm font-extrabold text-[#800000] block">
                {currentUser?.subscription.status === 'trialing'
                  ? `${currentUser.subscription.trialDaysRemaining} Days Remaining`
                  : 'Start 7-Day Free Trial'}
              </strong>
              <p className="text-xs text-slate-600 mt-1">
                Full unlimited access to AI sales coaching, Gemini 3.6 Flash reasoning, and CRM sync.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#A8C66C]/40 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Auto-transition to:</span>
              <span className="font-extrabold text-[#800000]">
                {currentUser?.subscription.autoTransitionPlan === 'yearly' ? 'Yearly ($155.99/yr)' : 'Monthly ($15.99/mo)'}
              </span>
            </div>
          </div>

          {/* Standalone Plans summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Standalone Subscriptions
              </span>
              <strong className="text-sm font-extrabold text-slate-900 block">
                {currentUser?.subscription.status === 'active_monthly'
                  ? 'Monthly Plan ($15.99/mo)'
                  : currentUser?.subscription.status === 'active_yearly'
                  ? 'Yearly Plan ($155.99/yr)'
                  : 'Monthly & Yearly (Standalone)'}
              </strong>
              <p className="text-xs text-slate-600 mt-1">
                Plans are not connected. Choose either $15.99/monthly or $155.99/yearly with independent billing.
              </p>
            </div>
            <button
              onClick={() => openSubscriptionModal('transition_settings')}
              className="mt-3 w-full py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#A8C66C] text-xs font-bold text-slate-800 text-center transition-all cursor-pointer shadow-xs"
            >
              Simulate 7-Day Expiry →
            </button>
          </div>
        </div>

        {/* Action Buttons Row: 7-Day Trial, $15.99 Monthly, $155.99 Yearly, PayPal Hosted Checkout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => {
              if (isAuthenticated) {
                openSubscriptionModal('plans');
              } else {
                openAuthModal('trial');
              }
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#800000] text-white hover:bg-[#600000] transition-all font-black text-xs shadow-sm cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#A8C66C]" />
            <span>7-Day Free Trial ($0.00)</span>
          </button>

          <button
            onClick={() => {
              if (isAuthenticated) {
                subscribeMonthly();
              } else {
                openAuthModal('signup');
              }
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white border-2 border-slate-300 hover:border-[#A8C66C] text-slate-900 font-extrabold text-xs transition-all shadow-xs cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#800000]" />
            <span>Monthly Plan: $15.99/mo</span>
          </button>

          <button
            onClick={() => {
              if (isAuthenticated) {
                subscribeYearly();
              } else {
                openAuthModal('signup');
              }
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-300 hover:border-emerald-500 text-emerald-950 font-extrabold text-xs transition-all shadow-xs cursor-pointer relative"
          >
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <span>Yearly: $155.99/yr (-18%)</span>
          </button>

          <button
            onClick={() => {
              openSubscriptionModal('hosted_buttons' as any);
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0070ba] hover:bg-[#003087] text-white font-black text-xs transition-all shadow-xs cursor-pointer"
          >
            <span className="italic text-xs font-black">PayPal</span>
            <span>Hosted Buttons (CAD) & Cart</span>
          </button>
        </div>
      </div>

      {/* Upload Playbooks Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#800000]" />
              Sales Playbooks & Product Docs (Gemini File Search Grounding)
            </h3>
            <p className="text-xs text-slate-500">
              Upload documents to ground AI sales coaching in real product sheets and pricing frameworks.
            </p>
          </div>

          <button
            id="upload-doc-btn"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#A8C66C] text-white hover:bg-[#8BA854] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Upload / Refresh Document</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {playbooks.map((doc) => (
            <div key={doc.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-[#A8C66C] transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#800000]" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                      <span className="text-[10px] font-semibold text-[#800000] bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                        {doc.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteDoc(doc.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200 my-2 italic text-[11px]">
                  "{doc.contentSnippet}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Size: {doc.fileSize} • {doc.uploadDate}</span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle className="w-3 h-3" /> File Search Indexed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations & Function Calling Credentials */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">CRM & Tool Integrations (Function Calling)</h3>
            <p className="text-xs text-slate-500">Function calling stubs enabled for real-time reads/updates.</p>
          </div>

          <button
            onClick={onSyncIntegrations}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#800000] text-white hover:bg-[#600000] transition-colors"
          >
            Test All API Connections
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#800000]" />
              <div>
                <div className="font-bold">Salesforce / CRM</div>
                <div className="text-[10px] text-slate-500">getCrmRecord / updateCrmRecord</div>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#800000]" />
              <div>
                <div className="font-bold">Google Calendar</div>
                <div className="text-[10px] text-slate-500">getCalendarEvents</div>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#800000]" />
              <div>
                <div className="font-bold">Slack / Activity Logs</div>
                <div className="text-[10px] text-slate-500">getSlackThread</div>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-1.5 py-0.5 rounded bg-[#003087] text-white font-black italic text-[10px]">
                PP
              </div>
              <div>
                <div className="font-bold text-slate-900">PayPal REST API</div>
                <div className="text-[10px] text-slate-500">createOrder / captureOrder</div>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Sandbox Connected"></span>
          </div>
        </div>
      </div>

      {/* External Documentation Footer Links */}
      <div className="bg-[#F3F8EA] rounded-xl border border-[#A8C66C] p-5">
        <h4 className="text-xs font-bold text-[#800000] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#A8C66C]" /> Platform Resources & Documentation
        </h4>

        <div className="flex flex-wrap gap-4 text-xs">
          <a
            href="https://ai.google.dev/aistudio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold text-[#800000] hover:underline"
          >
            <span>Learn about Google AI Studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href="https://ai.google.dev/gemini-api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold text-[#800000] hover:underline"
          >
            <span>Gemini API reference</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href="https://ai.google.dev/gemini-api/docs/function-calling"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold text-[#800000] hover:underline"
          >
            <span>File Search & function calling examples</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#800000] mb-1">Upload Playbook / Document</h3>
            <p className="text-xs text-slate-500 mb-4">
              Upload and index sales playbooks for Gemini File Search grounding.
            </p>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q4 Competitor Battlecard vs Salesforce Agentforce"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Tag / Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                >
                  <option value="playbook">playbook</option>
                  <option value="product_sheet">product_sheet</option>
                  <option value="pricing">pricing</option>
                  <option value="objection_handling">objection_handling</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Content Snippet / Key Guidelines</label>
                <textarea
                  rows={3}
                  value={snippet}
                  onChange={(e) => setSnippet(e.target.value)}
                  placeholder="Provide brief guidelines or upload file text..."
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#800000] text-white font-bold hover:bg-[#600000]"
                >
                  Upload & Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
