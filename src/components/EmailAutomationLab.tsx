import React, { useState } from 'react';
import {
  Mail,
  Send,
  Sparkles,
  Plus,
  Trash2,
  TrendingUp,
  BarChart2,
  CheckCircle,
  Clock
} from 'lucide-react';
import { EmailCampaign } from '../types';

interface EmailAutomationLabProps {
  campaigns: EmailCampaign[];
  onAddCampaign: (campaign: EmailCampaign) => void;
  onDeleteCampaign: (id: string) => void;
  onGenerateEmailContent: (campaignName: string, targetAudience: string) => void;
}

export const EmailAutomationLab: React.FC<EmailAutomationLabProps> = ({
  campaigns,
  onAddCampaign,
  onDeleteCampaign,
  onGenerateEmailContent
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [targetAudience, setTargetAudience] = useState('Stalled Deals > $50k');
  const [template, setTemplate] = useState('');

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newCamp: EmailCampaign = {
      id: `email-${Date.now()}`,
      campaignName,
      subject: subject || 'Accelerate deal momentum with AI coaching',
      template: template || 'Hi {{First_Name}}, based on our recent discussion regarding {{Company}}...',
      targetAudience,
      openRate: 51.2,
      clickRate: 18.6,
      conversionRate: 8.4,
      status: 'Automated',
      lastSentDate: todayStr
    };

    onAddCampaign(newCamp);
    setCampaignName('');
    setSubject('');
    setTemplate('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#800000]" />
            <h3 className="text-lg font-bold text-[#800000]">Automated Email Management</h3>
          </div>
          <span className="text-xs bg-[#F3F8EA] text-[#8BA854] font-semibold px-2.5 py-1 rounded-full border border-[#A8C66C]">
            AI Personalization & Engagement Analytics
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Automate re-engagement email sequences, track real-time open and click rates, and personalize communication with AI-driven content recommendations grounded in deal playbooks.
        </p>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#F3F8EA] text-[#8BA854] flex items-center justify-center font-bold">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Avg Open Rate</div>
            <div className="text-xl font-extrabold text-[#800000]">55.3%</div>
            <div className="text-[10px] text-emerald-600 font-bold">+14% vs industry avg</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Avg Click-Through</div>
            <div className="text-xl font-extrabold text-slate-900">21.3%</div>
            <div className="text-[10px] text-slate-400">Tracked in real time</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Meeting Conversion</div>
            <div className="text-xl font-extrabold text-emerald-700">9.6%</div>
            <div className="text-[10px] text-emerald-600 font-bold">High performance</div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Email Campaigns</h3>
            <p className="text-xs text-slate-500">Automated sequences with dynamic deal grounding placeholders.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#A8C66C] text-white hover:bg-[#8BA854] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create / Import Campaign</span>
          </button>
        </div>

        <div className="space-y-4">
          {campaigns.map((camp) => (
            <div key={camp.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:border-[#A8C66C] transition-all">
              <div>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{camp.campaignName}</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                        {camp.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#800000] font-semibold mt-0.5">
                      Subject: "{camp.subject}"
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onGenerateEmailContent(camp.campaignName, camp.targetAudience)}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-[#A8C66C] text-[#8BA854] hover:bg-[#F3F8EA] rounded flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> AI Personalize
                    </button>
                    <button
                      onClick={() => onDeleteCampaign(camp.id)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 font-mono my-2 whitespace-pre-line">
                  {camp.template}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                <span>Target Audience: <strong>{camp.targetAudience}</strong></span>
                <div className="flex items-center gap-3">
                  <span>Open: <strong className="text-slate-900">{camp.openRate}%</strong></span>
                  <span>Click: <strong className="text-slate-900">{camp.clickRate}%</strong></span>
                  <span>Conv: <strong className="text-emerald-700">{camp.conversionRate}%</strong></span>
                  <span className="text-[11px] text-slate-400">Last sent: {camp.lastSentDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#800000] mb-1">Create Email Campaign</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add automated email campaign with current date tracking.
            </p>

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Q3 Executive Nudge Sequence"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Accelerating deal cycle times for {{Company}}"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Audience Segment</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Body Template</label>
                <textarea
                  rows={3}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder="Insert template with {{First_Name}}, {{Company}} placeholders..."
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#800000] text-white font-bold hover:bg-[#600000]"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
