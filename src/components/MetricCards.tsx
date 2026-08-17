import React, { useState, useMemo } from 'react';
import { Download, TrendingUp, DollarSign, Award, Clock, ChevronDown, ChevronUp, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { CoachingSessionResult } from '../types';

interface MetricCardsProps {
  coachingData: CoachingSessionResult | null;
  onDownloadPdf: () => void;
  isDarkMode?: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ coachingData, onDownloadPdf, isDarkMode = false }) => {
  const [showTrendChart, setShowTrendChart] = useState<boolean>(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '14d' | '30d' | 'sessions'>('30d');

  const currentScore = coachingData?.pipeline_health_score || 88;

  // Generate historical pipeline health data based on coaching score
  const trendData = useMemo(() => {
    if (selectedTimeframe === 'sessions') {
      return [
        { label: 'Session 1', date: 'Jul 28', score: Math.max(60, currentScore - 16), baseline: 72, note: 'Initial Discovery Baseline' },
        { label: 'Session 2', date: 'Aug 02', score: Math.max(62, currentScore - 11), baseline: 72, note: 'MEDDPICC Framework Applied' },
        { label: 'Session 3', date: 'Aug 07', score: Math.max(68, currentScore - 7), baseline: 72, note: 'Objection Handling Playbook' },
        { label: 'Session 4', date: 'Aug 12', score: Math.max(72, currentScore - 3), baseline: 72, note: 'Pitch Lab Refinements' },
        { label: 'Session 5 (Latest)', date: 'Today', score: currentScore, baseline: 72, note: 'Executive Multi-Threading' },
      ];
    }

    if (selectedTimeframe === '7d') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
      const deltas = [-6, -4, -5, -2, -1, 0, 0];
      return days.map((day, idx) => ({
        label: day,
        date: `Aug ${10 + idx}`,
        score: Math.min(100, Math.max(50, currentScore + deltas[idx])),
        baseline: 75,
        note: `Daily Coaching Check-in: ${day}`
      }));
    }

    if (selectedTimeframe === '14d') {
      const dates = [
        'Aug 03', 'Aug 05', 'Aug 07', 'Aug 09', 'Aug 11', 'Aug 13', 'Today'
      ];
      const scores = [
        Math.max(65, currentScore - 12),
        Math.max(68, currentScore - 9),
        Math.max(70, currentScore - 8),
        Math.max(73, currentScore - 5),
        Math.max(78, currentScore - 3),
        Math.max(82, currentScore - 1),
        currentScore
      ];
      return dates.map((date, idx) => ({
        label: date,
        date,
        score: scores[idx],
        baseline: 75,
        note: `Bi-weekly Coaching Milestone`
      }));
    }

    // 30D (Default)
    const points = [
      { label: 'Week 1', date: 'Jul 18', score: Math.max(64, currentScore - 18), baseline: 70, note: 'Pre-coaching baseline' },
      { label: 'Week 2', date: 'Jul 25', score: Math.max(70, currentScore - 12), baseline: 70, note: 'Playbook grounding implemented' },
      { label: 'Week 3', date: 'Aug 01', score: Math.max(76, currentScore - 8), baseline: 70, note: 'Pre-call prep routine active' },
      { label: 'Week 4', date: 'Aug 08', score: Math.max(82, currentScore - 3), baseline: 70, note: 'High velocity closing phase' },
      { label: 'Current', date: 'Today', score: currentScore, baseline: 70, note: 'Peak pipeline velocity' }
    ];
    return points;
  }, [currentScore, selectedTimeframe]);

  const scoreVelocity = useMemo(() => {
    if (trendData.length < 2) return '+0';
    const start = trendData[0].score;
    const end = trendData[trendData.length - 1].score;
    const diff = end - start;
    return diff >= 0 ? `+${diff}` : `${diff}`;
  }, [trendData]);

  const avgScore = useMemo(() => {
    if (trendData.length === 0) return currentScore;
    const total = trendData.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(total / trendData.length);
  }, [trendData, currentScore]);

  return (
    <div
      id="metric-cards-container"
      className={`rounded-2xl border p-4 sm:p-5 shadow-sm mb-6 transition-all duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Top Header Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#800000] text-[#A8C66C] shadow-xs">
            <Activity className="w-4 h-4 text-[#A8C66C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold tracking-tight">Revenue Performance Snapshot</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Live Data
              </span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Pipeline health score velocity, time management efficiency, and real-time revenue indicators.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="toggle-pipeline-trend-btn"
            onClick={() => setShowTrendChart(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              showTrendChart
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#800000] dark:text-red-400" />
            <span>{showTrendChart ? 'Hide Trend Chart' : 'Show Trend Chart'}</span>
            {showTrendChart ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            id="metric-download-pdf-btn"
            onClick={onDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold bg-[#800000] text-white hover:bg-[#600000] transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#A8C66C]" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Card 1: Pipeline Health */}
        <div
          id="stat-pipeline-health-card"
          className={`p-3.5 rounded-xl border transition-all relative overflow-hidden ${
            isDarkMode ? 'bg-emerald-950/30 border-[#A8C66C]/40 text-slate-100' : 'bg-[#F3F8EA] border-[#A8C66C] text-slate-900'
          }`}
        >
          <div className={`font-semibold text-[11px] flex items-center justify-between ${
            isDarkMode ? 'text-emerald-300' : 'text-slate-600'
          }`}>
            <span>Pipeline Health</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#8BA854]" />
          </div>
          <div className={`text-2xl font-black mt-1 tracking-tight ${
            isDarkMode ? 'text-emerald-400' : 'text-[#800000]'
          }`}>
            {currentScore} <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px]">
            <span className={`font-extrabold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Top Tier
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {scoreVelocity} pts trend
            </span>
          </div>
        </div>

        {/* Card 2: Time Management Score */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <div className={`font-semibold text-[11px] flex items-center justify-between ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span>Time Mgmt Score</span>
            <Clock className="w-3.5 h-3.5 text-[#800000] dark:text-red-400" />
          </div>
          <div className="text-2xl font-black mt-1 tracking-tight">
            {coachingData?.time_management_score || 84} <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </div>
          <div className={`text-[10px] mt-1 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            90min focus recommended
          </div>
        </div>

        {/* Card 3: Active Pipeline */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <div className={`font-semibold text-[11px] flex items-center justify-between ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span>Active Pipeline</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black mt-1 tracking-tight">
            $715,000
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">
            5 Qualified Deals
          </div>
        </div>

        {/* Card 4: Risk Deals */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <div className={`font-semibold text-[11px] flex items-center justify-between ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span>Risk Deals</span>
            <Award className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 tracking-tight">
            {coachingData?.risk_deals?.length || 2} <span className="text-xs font-semibold text-slate-400">Deals</span>
          </div>
          <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium mt-1">
            Requires intervention
          </div>
        </div>
      </div>

      {/* Embedded Recharts Pipeline Health Score Trend Visualization */}
      {showTrendChart && (
        <div
          id="pipeline-health-trend-section"
          className={`mt-4 pt-4 border-t transition-all ${
            isDarkMode ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#800000] dark:text-red-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#800000] dark:text-red-400" />
                Pipeline Health Score Trend Analysis
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-[#F3F8EA] dark:bg-slate-800 text-[#800000] dark:text-red-400 border border-[#A8C66C]/40">
                Avg: {avgScore} / 100
              </span>
            </div>

            {/* Timeframe selector controls */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200/60 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 px-1.5 uppercase font-semibold">Range:</span>
              <button
                onClick={() => setSelectedTimeframe('7d')}
                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                  selectedTimeframe === '7d'
                    ? 'bg-[#800000] text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setSelectedTimeframe('14d')}
                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                  selectedTimeframe === '14d'
                    ? 'bg-[#800000] text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                14 Days
              </button>
              <button
                onClick={() => setSelectedTimeframe('30d')}
                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                  selectedTimeframe === '30d'
                    ? 'bg-[#800000] text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setSelectedTimeframe('sessions')}
                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] flex items-center gap-1 ${
                  selectedTimeframe === 'sessions'
                    ? 'bg-[#800000] text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#A8C66C]" />
                <span>Sessions</span>
              </button>
            </div>
          </div>

          {/* Recharts Area/Line Chart */}
          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="metricScoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A8C66C" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#A8C66C" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: isDarkMode ? '#94A3B8' : '#64748B', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[50, 100]}
                  tick={{ fontSize: 10, fill: isDarkMode ? '#94A3B8' : '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className={`p-3 rounded-xl border shadow-xl text-xs space-y-1 z-50 ${
                          isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                        }`}>
                          <div className="flex items-center justify-between gap-4 border-b pb-1.5 border-slate-200 dark:border-slate-800">
                            <span className="font-extrabold text-[#800000] dark:text-red-400">
                              {data.label} ({data.date})
                            </span>
                            <span className="px-2 py-0.5 rounded font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950">
                              {data.score} / 100
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                            {data.note}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span>Target Threshold: 75</span>
                            <span className={data.score >= 75 ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                              {data.score >= 75 ? '✓ On Track' : '⚠ Below Target'}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={75} stroke="#800000" strokeDasharray="3 3" strokeOpacity={0.4} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#800000"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#metricScoreGradient)"
                  dot={{ r: 4, fill: '#A8C66C', stroke: '#800000', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#800000', stroke: '#A8C66C', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Velocity: <strong>{scoreVelocity} pts</strong> improvement over selected timeline</span>
            </span>
            <span className="font-medium text-[10px]">
              Dashed line represents target baseline (75/100)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
