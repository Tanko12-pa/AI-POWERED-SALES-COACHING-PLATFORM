import React from 'react';
import { Download, TrendingUp, DollarSign, Award, Clock } from 'lucide-react';
import { CoachingSessionResult } from '../types';

interface MetricCardsProps {
  coachingData: CoachingSessionResult | null;
  onDownloadPdf: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ coachingData, onDownloadPdf }) => {
  return (
    <div id="metric-cards-container" className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Revenue Performance Snapshot</h3>
          <p className="text-[11px] text-slate-500">Live evaluation score, pipeline health, and time management metrics.</p>
        </div>

        <button
          id="metric-download-pdf-btn"
          onClick={onDownloadPdf}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#800000] text-white hover:bg-[#600000] transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-[#A8C66C]" />
          <span>Download PDF Report</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-[#F3F8EA] p-3 rounded-lg border border-[#A8C66C]">
          <div className="text-slate-600 font-semibold text-[11px] flex items-center justify-between">
            <span>Pipeline Health</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#8BA854]" />
          </div>
          <div className="text-xl font-extrabold text-[#800000] mt-1">
            {coachingData?.pipeline_health_score || 88} / 100
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Top Tier</div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-slate-600 font-semibold text-[11px] flex items-center justify-between">
            <span>Time Mgmt Score</span>
            <Clock className="w-3.5 h-3.5 text-[#800000]" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            {coachingData?.time_management_score || 84} / 100
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">90min block recommended</div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-slate-600 font-semibold text-[11px] flex items-center justify-between">
            <span>Active Pipeline</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            $715,000
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">5 Opportunities</div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-slate-600 font-semibold text-[11px] flex items-center justify-between">
            <span>Risk Deals</span>
            <Award className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-700 mt-1">
            {coachingData?.risk_deals?.length || 2} Deals
          </div>
          <div className="text-[10px] text-amber-800 font-medium mt-0.5">Requires outreach</div>
        </div>
      </div>
    </div>
  );
};
