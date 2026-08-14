import React, { useState, useMemo } from 'react';
import { Users, Trophy, TrendingUp, DollarSign, Award, Target, Search, BarChart3, ChevronUp, ChevronDown, CheckCircle2, Shield, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Legend } from 'recharts';
import { TeamMemberPerformance, TeamAggregateMetrics } from '../types';

interface TeamLeaderboardWidgetProps {
  isDarkMode?: boolean;
  onOpenBadgesModal?: () => void;
}

const DEFAULT_TEAM_MEMBERS: TeamMemberPerformance[] = [
  {
    id: 'rep-1',
    name: 'You (Current User)',
    role: 'Admin / Sales Leader',
    pipelineHealthScore: 92,
    closedWonValue: 380000,
    activeDealsCount: 6,
    coachingSessionsCompleted: 8,
    campaignSuccessRate: 84,
    badgesCount: 5,
    badges: ['Pipeline Prodigy', 'Coaching Champion', 'Streak Master', 'Closing Expert', 'Pitch Master'],
    topSkill: 'SOC2 Security & Enterprise Closing',
    rank: 1
  },
  {
    id: 'rep-2',
    name: 'Sarah Chen',
    role: 'Senior Enterprise AE',
    pipelineHealthScore: 89,
    closedWonValue: 345000,
    activeDealsCount: 5,
    coachingSessionsCompleted: 7,
    campaignSuccessRate: 81,
    badgesCount: 4,
    badges: ['Pipeline Prodigy', 'Streak Master', 'Closing Expert', 'Pitch Master'],
    topSkill: 'Handling Price Objections',
    rank: 2
  },
  {
    id: 'rep-3',
    name: 'Marcus Vance',
    role: 'Commercial Account Exec',
    pipelineHealthScore: 86,
    closedWonValue: 290000,
    activeDealsCount: 4,
    coachingSessionsCompleted: 6,
    campaignSuccessRate: 77,
    badgesCount: 3,
    badges: ['Coaching Champion', 'Streak Master', 'Pitch Master'],
    topSkill: 'Technical Discovery & Demos',
    rank: 3
  },
  {
    id: 'rep-4',
    name: 'Alex Morgan',
    role: 'Mid-Market Sales Rep',
    pipelineHealthScore: 81,
    closedWonValue: 210000,
    activeDealsCount: 5,
    coachingSessionsCompleted: 5,
    campaignSuccessRate: 72,
    badgesCount: 2,
    badges: ['Streak Master', 'Coaching Champion'],
    topSkill: 'Inbound Discovery Follow-up',
    rank: 4
  },
  {
    id: 'rep-5',
    name: 'David Kim',
    role: 'SDR / Business Development',
    pipelineHealthScore: 78,
    closedWonValue: 195000,
    activeDealsCount: 4,
    coachingSessionsCompleted: 4,
    campaignSuccessRate: 69,
    badgesCount: 2,
    badges: ['Streak Master', 'Pitch Master'],
    topSkill: 'Cold Email & Pitch Practice',
    rank: 5
  }
];

export const TeamLeaderboardWidget: React.FC<TeamLeaderboardWidgetProps> = ({
  isDarkMode = false,
  onOpenBadgesModal
}) => {
  const [viewMode, setViewMode] = useState<'individual' | 'team'>('individual');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'pipelineHealthScore' | 'closedWonValue' | 'coachingSessionsCompleted'>('pipelineHealthScore');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filtered & Sorted Members
  const sortedMembers = useMemo(() => {
    return [...DEFAULT_TEAM_MEMBERS]
      .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.role.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (sortOrder === 'desc') return valB - valA;
        return valA - valB;
      });
  }, [searchQuery, sortBy, sortOrder]);

  // Aggregate Team Calculations
  const teamAggregates: TeamAggregateMetrics = useMemo(() => {
    const totalMembers = DEFAULT_TEAM_MEMBERS.length;
    const avgHealth = Math.round(DEFAULT_TEAM_MEMBERS.reduce((acc, curr) => acc + curr.pipelineHealthScore, 0) / totalMembers);
    const totalClosed = DEFAULT_TEAM_MEMBERS.reduce((acc, curr) => acc + curr.closedWonValue, 0);
    const totalDeals = DEFAULT_TEAM_MEMBERS.reduce((acc, curr) => acc + curr.activeDealsCount, 0);
    const avgCoaching = Math.round((DEFAULT_TEAM_MEMBERS.reduce((acc, curr) => acc + curr.coachingSessionsCompleted, 0) / (totalMembers * 8)) * 100);
    const avgCampaignSuccess = Math.round(DEFAULT_TEAM_MEMBERS.reduce((acc, curr) => acc + curr.campaignSuccessRate, 0) / totalMembers);

    return {
      avgPipelineHealth: avgHealth,
      totalTeamClosedValue: totalClosed,
      totalActiveDeals: totalDeals,
      avgCoachingCompletion: avgCoaching,
      teamCampaignSuccessRate: avgCampaignSuccess,
      topPerformingRegion: 'North America Enterprise',
      timeframe: 'Current Quarter'
    };
  }, []);

  const cardBgClass = isDarkMode
    ? 'bg-slate-900 border-slate-800 text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';

  const chartData = useMemo(() => {
    return DEFAULT_TEAM_MEMBERS.map(m => ({
      name: m.name.split(' ')[0],
      healthScore: m.pipelineHealthScore,
      campaignSuccess: m.campaignSuccessRate,
      closedRevenueK: Math.round(m.closedWonValue / 1000)
    }));
  }, []);

  return (
    <div id="team-leaderboard-widget" className={`rounded-xl border p-5 shadow-sm transition-colors mb-6 ${cardBgClass}`}>
      {/* Header Row & Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#800000] text-[#A8C66C] shadow-xs">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <span>Sales Team Leaderboard & Performance</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#A8C66C] text-white font-bold">
                Q3 Performance
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rankings based on pipeline health scores, coaching sessions, and campaign success rate.
            </p>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-700">
            <button
              id="toggle-individual-view-btn"
              onClick={() => setViewMode('individual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'individual'
                  ? 'bg-white dark:bg-slate-700 text-[#800000] dark:text-red-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Individual View</span>
            </button>

            <button
              id="toggle-team-view-btn"
              onClick={() => setViewMode('team')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'team'
                  ? 'bg-white dark:bg-slate-700 text-[#800000] dark:text-red-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Team-Wide View</span>
            </button>
          </div>

          {onOpenBadgesModal && (
            <button
              onClick={onOpenBadgesModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#A8C66C] text-white hover:bg-[#8BA854] transition-colors shadow-xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Badges</span>
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: INDIVIDUAL VIEW */}
      {viewMode === 'individual' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter rep by name or role..."
                className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:border-[#A8C66C] ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold text-[11px]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`p-1.5 rounded-lg border text-xs font-semibold focus:outline-none ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                <option value="pipelineHealthScore">Pipeline Health Score</option>
                <option value="closedWonValue">Closed Won Value ($)</option>
                <option value="coachingSessionsCompleted">Coaching Sessions</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Toggle Sort Order"
              >
                {sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`uppercase text-[10px] tracking-wider border-b ${
                isDarkMode ? 'bg-slate-800/60 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                <tr>
                  <th className="p-3">Rank & Rep Name</th>
                  <th className="p-3">Pipeline Health</th>
                  <th className="p-3">Closed Won Revenue</th>
                  <th className="p-3">Campaign Success</th>
                  <th className="p-3">Coaching Sessions</th>
                  <th className="p-3">Badges Earned</th>
                  <th className="p-3">Top Skill</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {sortedMembers.map((member, idx) => {
                  const rankBadge = 
                    idx === 0 ? '🥇 #1' :
                    idx === 1 ? '🥈 #2' :
                    idx === 2 ? '🥉 #3' : `#${idx + 1}`;

                  return (
                    <tr
                      key={member.id}
                      className={`transition-colors ${
                        member.name.includes('You')
                          ? isDarkMode ? 'bg-[#800000]/20 font-bold' : 'bg-[#F3F8EA] font-bold'
                          : isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                            idx === 0 ? 'bg-amber-400 text-slate-900' :
                            idx === 1 ? 'bg-slate-300 text-slate-900' :
                            idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {rankBadge}
                          </span>
                          <div>
                            <div className="font-extrabold flex items-center gap-1.5">
                              <span>{member.name}</span>
                              {member.name.includes('You') && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#800000] text-white">YOU</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">{member.role}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-[#800000] dark:text-red-400">
                            {member.pipelineHealthScore}
                          </span>
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#A8C66C] h-full"
                              style={{ width: `${member.pipelineHealthScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-extrabold text-emerald-700 dark:text-emerald-400">
                        ${member.closedWonValue.toLocaleString()}
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {member.campaignSuccessRate}%
                        </span>
                      </td>

                      <td className="p-3 font-bold text-slate-700 dark:text-slate-300">
                        {member.coachingSessionsCompleted} Sessions
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-[#A8C66C]" />
                          <span className="font-bold">{member.badgesCount} Badges</span>
                        </div>
                      </td>

                      <td className="p-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        {member.topSkill}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 2: TEAM-WIDE AGGREGATE VIEW */}
      {viewMode === 'team' && (
        <div className="space-y-5">
          {/* Aggregate Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F3F8EA] dark:bg-slate-800/80 border border-[#A8C66C]">
              <div className="text-slate-600 dark:text-slate-400 font-semibold text-[11px] flex justify-between">
                <span>Team Avg Health</span>
                <TrendingUp className="w-4 h-4 text-[#8BA854]" />
              </div>
              <div className="text-2xl font-black text-[#800000] dark:text-red-400 mt-1">
                {teamAggregates.avgPipelineHealth} / 100
              </div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">+6 pts above benchmark</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="text-slate-600 dark:text-slate-400 font-semibold text-[11px] flex justify-between">
                <span>Total Team Closed</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                ${(teamAggregates.totalTeamClosedValue / 1000000).toFixed(2)}M
              </div>
              <div className="text-[10px] text-emerald-600 font-bold mt-0.5">24 Won Contracts</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="text-slate-600 dark:text-slate-400 font-semibold text-[11px] flex justify-between">
                <span>Coaching Completion</span>
                <CheckCircle2 className="w-4 h-4 text-[#A8C66C]" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {teamAggregates.avgCoachingCompletion}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">30 Total Sessions Completed</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="text-slate-600 dark:text-slate-400 font-semibold text-[11px] flex justify-between">
                <span>Campaign Win Rate</span>
                <Target className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {teamAggregates.teamCampaignSuccessRate}%
              </div>
              <div className="text-[10px] text-indigo-600 font-bold mt-0.5">Top: North America</div>
            </div>
          </div>

          {/* Team Comparative Recharts Bar Chart */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#800000] dark:text-red-400" />
              Team Rep Comparison: Pipeline Health vs Campaign Success (%)
            </h4>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: isDarkMode ? '#94A3B8' : '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[50, 100]}
                    tick={{ fontSize: 11, fill: isDarkMode ? '#94A3B8' : '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                      borderColor: isDarkMode ? '#334155' : '#A8C66C',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="healthScore" name="Pipeline Health Score" fill="#800000" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="campaignSuccess" name="Campaign Success Rate %" fill="#A8C66C" radius={[4, 4, 0, 0]} />
                  <ReferenceLine y={teamAggregates.avgPipelineHealth} stroke="#800000" strokeDasharray="3 3" label={{ value: 'Team Avg Health', fill: '#800000', fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Team Insights Summary */}
          <div className="p-4 rounded-xl bg-[#F3F8EA] dark:bg-slate-800 border border-[#A8C66C] text-xs space-y-2">
            <h5 className="font-extrabold text-[#800000] dark:text-red-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Shield className="w-4 h-4 text-[#A8C66C]" /> Gemini AI Team Leadership Insights
            </h5>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              Overall sales team performance is currently <strong>12% higher than Q2 benchmarks</strong>. Top-performing reps consistently utilize 30-second Pre-Call Prep checklists prior to buyer calls.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
