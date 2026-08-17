import React from 'react';
import { Download, TrendingUp, DollarSign, Award, Clock } from 'lucide-react';
import { CoachingSessionResult } from '../types';

interface MetricCardsProps {
  coachingData: CoachingSessionResult | null;
  onDownloadPdf: () => void;
  isDarkMode?: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ coachingData, onDownloadPdf, isDarkMode = false }) => {
  return (
    <div
      id="metric-cards-container"
      className={`rounded-xl border p-4 shadow-sm mb-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className={`flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div>
          <h3 className="text-sm font-bold">Revenue Performance Snapshot</h3>
          <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Live evaluation score, pipeline health, and time management metrics.
          </p>
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
        <div className={`p-3 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-emerald-950/30 border-[#A8C66C]/40 text-slate-100' : 'bg-[#F3F8EA] border-[#A8C66C] text-slate-900'
        }`}>
          <div className={`font-semibold text-[11px] flex items-center justify-between ${
            isDarkMode ? 'text-emerald-300' : 'text-slate-600'
          }`}>
            <span>Pipeline Health</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#8BA854]" />
          </div>
          <div className={`text-xl font-extrabold mt-1 ${
            isDarkMode ? 'text-emerald-400' : 'text-[#800000]'
          }`}>
            {coachingData?.pipeline_health_score || 88} / 100
          </div>
          <div className={`text-[10px] font-bold mt-0.5 ${
            isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
          }`}>Top Tier</div>
        </div>

        <div className={`p-3 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <div className={`font-semibold text-[11px] flex items-center justify-between ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span>Time Mgmt Score</span>
            <Clock className="w-3.5 h-3.5 text-[#800000] dark:text-red-400" />
          </div>
          <div className="text-xl font-extrabold mt-1">
            {coachingData?.time_management_score || 84} / 100
          </div>
          <div className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>90min block recommended</div>
        </div>

        <div className={`p-3 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <div className={`font-semibold text-[11px] flex items-center justify-between ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span>Active Pipeline</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold mt-1">
            $715,000
          </div>
          <div className="text-[10px] text-emerald-500 font-bold mt-0.5">5 Opportunities</div>
        </div>

        <div className={`p-3 rounded-lg border transition-colors ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <div className={`font-semibold text-[11px] flex items-center justify-between ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span>Risk Deals</span>
            <Award className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {coachingData?.risk_deals?.length || 2} Deals
          </div>
          <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium mt-0.5">Requires outreach</div>
        </div>
      </div>
    </div>
  );
};
