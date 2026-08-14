import React, { useState } from 'react';
import {
  Megaphone,
  Wand2,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  TrendingUp,
  Sliders,
  Award
} from 'lucide-react';
import { CopyVariant, IndustryType, MarketingLabResult } from '../types';

interface MarketingLanguageLabProps {
  marketingResult: MarketingLabResult | null;
  copyVariants: CopyVariant[];
  onAddCopyVariant: (variant: CopyVariant) => void;
  onDeleteCopyVariant: (id: string) => void;
  onGenerateCopy: (product: string, industry: IndustryType, persona: string) => void;
}

export const MarketingLanguageLab: React.FC<MarketingLanguageLabProps> = ({
  marketingResult,
  copyVariants,
  onAddCopyVariant,
  onDeleteCopyVariant,
  onGenerateCopy
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('retail');
  const [targetPersona, setTargetPersona] = useState('VP of Marketing / Sales');
  const [productDesc, setProductDesc] = useState('AI-Powered Sales Coaching Platform');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCopy, setCustomCopy] = useState('');
  const [customCta, setCustomCta] = useState('');

  const industries: { id: IndustryType; label: string }[] = [
    { id: 'retail', label: 'Retail & Omnichannel' },
    { id: 'e-commerce', label: 'E-Commerce' },
    { id: 'travel', label: 'Travel & Hospitality' },
    { id: 'health', label: 'Health & Life Sciences' },
    { id: 'finance', label: 'Banking & FinTech' },
    { id: 'technology', label: 'B2B Software & AI' }
  ];

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateCustomCopy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customCopy) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newVar: CopyVariant = {
      id: `copy-custom-${Date.now()}`,
      title: customTitle,
      copy: customCopy,
      tone: 'Custom Enterprise Tone',
      targetPersona: targetPersona,
      industry: selectedIndustry,
      performanceEstimate: '+25% Projected Uplift',
      callToAction: customCta || 'Learn More',
      createdDate: todayStr
    };

    onAddCopyVariant(newVar);
    setCustomTitle('');
    setCustomCopy('');
    setCustomCta('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Input Generator Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#800000]" />
            <h3 className="text-lg font-bold text-[#800000]">Marketing Language Optimizer</h3>
          </div>
          <span className="text-xs bg-[#F3F8EA] text-[#8BA854] font-semibold px-2.5 py-1 rounded-full border border-[#A8C66C]">
            Gemini Copy Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Industry</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value as IndustryType)}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#A8C66C] bg-white font-medium"
            >
              {industries.map((ind) => (
                <option key={ind.id} value={ind.id}>{ind.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Persona</label>
            <input
              type="text"
              value={targetPersona}
              onChange={(e) => setTargetPersona(e.target.value)}
              placeholder="e.g. CMO, Chief Revenue Officer"
              className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#A8C66C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Focus</label>
            <input
              type="text"
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#A8C66C]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => onGenerateCopy(productDesc, selectedIndustry, targetPersona)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#A8C66C] text-white hover:bg-[#8BA854] transition-colors shadow-sm"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate Industry Copy Variants</span>
          </button>
        </div>
      </div>

      {/* Industry Tone Guidelines & Optimization Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#F3F8EA] rounded-xl border border-[#A8C66C] p-5 shadow-xs">
          <h4 className="text-xs font-bold text-[#800000] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#A8C66C]" /> Industry Tone Guidelines ({selectedIndustry.toUpperCase()})
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {marketingResult?.tone_guidelines ||
              `For ${selectedIndustry}, focus on clear ROI evidence, speed-to-value, and zero compliance friction. Avoid passive language; use imperative action verbs.`}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#800000]" /> Real-time Optimization Tip
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {marketingResult?.optimization_notes ||
              "Top performing headlines in this sector highlight a specific percentage metric (e.g. '35% faster deal cycles') in the first 5 words."}
          </p>
        </div>
      </div>

      {/* Copy Variants Cards List */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Top-Performing Copy Variants</h3>
            <p className="text-xs text-slate-500">Ready for open internet campaign deployment or sales outreach.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#A8C66C] text-white hover:bg-[#8BA854] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add / Import Copy Variant</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {copyVariants.map((v) => (
            <div key={v.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:border-[#A8C66C] transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{v.title}</h4>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#800000] bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      {v.industry.toUpperCase()} • {v.tone}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteCopyVariant(v.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Delete Copy Variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 my-2 leading-relaxed font-mono">
                  "{v.copy}"
                </p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2 mt-2">
                  <span>Persona: <strong>{v.targetPersona}</strong></span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {v.performanceEstimate}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-[#800000]">CTA: {v.callToAction}</span>

                <button
                  onClick={() => handleCopyText(v.id, v.copy)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  {copiedId === v.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for adding custom copy */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#800000] mb-1">Add Marketing Copy Variant</h3>
            <p className="text-xs text-slate-500 mb-4">
              Import existing ad headline or campaign email copy for tracking and optimization.
            </p>

            <form onSubmit={handleCreateCustomCopy} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Variant Headline / Title</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Q3 Omnichannel Growth Headline"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Copy Content</label>
                <textarea
                  required
                  rows={3}
                  value={customCopy}
                  onChange={(e) => setCustomCopy(e.target.value)}
                  placeholder="Insert copy text..."
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Call to Action (CTA)</label>
                <input
                  type="text"
                  value={customCta}
                  onChange={(e) => setCustomCta(e.target.value)}
                  placeholder="e.g. Book Demo Now"
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
                  Save Copy Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
