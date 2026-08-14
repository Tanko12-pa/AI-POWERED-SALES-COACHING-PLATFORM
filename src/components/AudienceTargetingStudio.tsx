import React, { useState } from 'react';
import {
  Target,
  Users,
  Tv,
  Globe,
  Radio,
  Plus,
  Trash2,
  TrendingUp,
  BarChart,
  Lightbulb
} from 'lucide-react';
import { AudienceSegment, AudienceTargetingResult } from '../types';

interface AudienceTargetingStudioProps {
  targetingResult: AudienceTargetingResult | null;
  segments: AudienceSegment[];
  onAddSegment: (segment: AudienceSegment) => void;
  onDeleteSegment: (id: string) => void;
  onDesignPlan: () => void;
}

export const AudienceTargetingStudio: React.FC<AudienceTargetingStudioProps> = ({
  targetingResult,
  segments,
  onAddSegment,
  onDeleteSegment,
  onDesignPlan
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [demographics, setDemographics] = useState('');
  const [behaviors, setBehaviors] = useState('');
  const [reach, setReach] = useState('1.0M Decision Makers');

  const handleCreateSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newSeg: AudienceSegment = {
      id: `seg-custom-${Date.now()}`,
      name,
      demographics: demographics || 'US Enterprise Leaders',
      behaviors: behaviors || 'Open internet tech research & executive news',
      budgetShare: '30%',
      recommendedChannels: ['Programmatic Open Web', 'Connected TV'],
      estimatedReach: reach
    };

    onAddSegment(newSeg);
    setName('');
    setDemographics('');
    setBehaviors('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#800000]" />
            <h3 className="text-lg font-bold text-[#800000]">Audience Targeting Studio</h3>
          </div>
          <button
            onClick={onDesignPlan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#A8C66C] text-white hover:bg-[#8BA854] transition-colors shadow-xs"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Generate Data-Driven Targeting Strategy</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Open internet contextual intelligence targeting business leaders, SaaS buyers, and commercial decision-makers across programmatic web, connected TV (CTV), and audio environments.
        </p>
      </div>

      {/* Recommended Channels & Placements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Channels */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#800000]" /> Recommended Channels
          </h4>
          <div className="space-y-2">
            {(targetingResult?.channels || [
              "Programmatic Display & Native",
              "Connected TV (Business Cable Nets)",
              "Digital Out-of-Home (Financial Hubs)",
              "High-Impact Executive Newsletters"
            ]).map((ch, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs p-2 bg-slate-50 rounded border border-slate-200/80 font-medium text-slate-800">
                <span className="w-2 h-2 rounded-full bg-[#A8C66C]"></span>
                <span>{ch}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Bidding Strategy */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <BarChart className="w-4 h-4 text-[#800000]" /> Algorithmic Bidding Strategy
          </h4>
          <p className="text-xs text-slate-700 bg-[#F3F8EA] p-3 rounded-lg border border-[#A8C66C] font-medium leading-relaxed">
            {targetingResult?.bidding_strategy ||
              "Target CPA with real-time impression scoring. Bids automatically cap during off-peak hours and scale up on high-converting B2B publishers."}
          </p>
        </div>

        {/* Card 3: Live Optimization Tips */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-[#800000]" /> Live Campaign Optimization Tips
          </h4>
          <div className="space-y-2 text-xs">
            {(targetingResult?.live_optimization_tips || [
              "Shift 15% budget to CTV video overlay cards during morning business hours.",
              "Exclude non-converting weekend inventory to improve overall ROAS."
            ]).map((tip, idx) => (
              <div key={idx} className="p-2 bg-amber-50 text-amber-900 rounded border border-amber-200/80 text-[11px] font-medium">
                • {tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audience Segments Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Open Internet Audience Segments</h3>
            <p className="text-xs text-slate-500">Targeting profiles based on contextual research and intent signals.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#A8C66C] text-white hover:bg-[#8BA854] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add / Import Segment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {segments.map((seg) => (
            <div key={seg.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:border-[#A8C66C] transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#800000] text-white flex items-center justify-center font-bold">
                      <Users className="w-4 h-4 text-[#A8C66C]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{seg.name}</h4>
                      <span className="text-[11px] text-slate-500">{seg.estimatedReach}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteSegment(seg.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Delete Segment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 my-2">
                  <div><strong>Demographics:</strong> {seg.demographics}</div>
                  <div><strong>Behaviors:</strong> {seg.behaviors}</div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
                <span className="font-bold text-[#800000]">Budget Allocation: {seg.budgetShare}</span>
                <div className="flex items-center gap-1">
                  {seg.recommendedChannels.map((c, i) => (
                    <span key={i} className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Adding Segment */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#800000] mb-1">Add Audience Segment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Define a new target audience segment for open web advertising.
            </p>

            <form onSubmit={handleCreateSegment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Segment Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Healthcare IT Decision Makers"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Demographics & Geography</label>
                <input
                  type="text"
                  value={demographics}
                  onChange={(e) => setDemographics(e.target.value)}
                  placeholder="e.g. US & EU, Chief Medical Officers, Hospitals > 100 beds"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intent & Behaviors</label>
                <textarea
                  rows={2}
                  value={behaviors}
                  onChange={(e) => setBehaviors(e.target.value)}
                  placeholder="e.g. Reading healthtech security journals, cloud compliance searchers"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Reach</label>
                <input
                  type="text"
                  value={reach}
                  onChange={(e) => setReach(e.target.value)}
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
                  Create Segment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
