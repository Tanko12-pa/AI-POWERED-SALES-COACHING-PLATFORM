import React from 'react';
import { Award, CheckCircle2, Lock, Sparkles, X, Trophy, Shield, Zap, Target, Mic, DollarSign, TrendingUp } from 'lucide-react';
import { BadgeItem } from '../types';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: BadgeItem[];
  userRole: string;
  isDarkMode?: boolean;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  badges,
  userRole,
  isDarkMode = false
}) => {
  if (!isOpen) return null;

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return <Trophy className="w-6 h-6 text-amber-500" />;
      case 'Zap': return <Zap className="w-6 h-6 text-yellow-500" />;
      case 'Target': return <Target className="w-6 h-6 text-emerald-500" />;
      case 'DollarSign': return <DollarSign className="w-6 h-6 text-emerald-600" />;
      case 'Mic': return <Mic className="w-6 h-6 text-indigo-500" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-blue-500" />;
      default: return <Award className="w-6 h-6 text-[#A8C66C]" />;
    }
  };

  const categories = ['All', 'Pipeline', 'Coaching', 'Prep', 'Closing', 'Pitch'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredBadges = badges.filter(b => 
    selectedCategory === 'All' ? true : b.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className={`rounded-xl border shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] flex flex-col ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#800000] text-[#A8C66C] flex items-center justify-center font-bold shadow-md">
              <Trophy className="w-5 h-5 text-[#A8C66C]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold flex items-center gap-2">
                <span>Top Performer Badges & Achievements</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#A8C66C] text-white font-bold">
                  {unlockedCount}/{totalCount} Unlocked
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                User Profile ({userRole}) • Earn digital badges by reaching high pipeline health and pitch mastery.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Progress Bar Header */}
        <div className="my-4 p-4 rounded-xl bg-[#F3F8EA] dark:bg-slate-800/80 border border-[#A8C66C]/60 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-[#800000] dark:text-red-400">Top Performer Achievement Rank</span>
              <span className="text-slate-700 dark:text-slate-300">{completionPercentage}% Mastered</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#800000] dark:bg-red-500 h-full transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xl font-black text-[#800000] dark:text-red-400">#{unlockedCount >= 4 ? '1' : '3'}</span>
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Team Rank</div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-4 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#800000] text-white shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Badge Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 relative ${
                badge.unlocked
                  ? isDarkMode
                    ? 'bg-slate-800/90 border-emerald-500/50 shadow-xs'
                    : 'bg-white border-[#A8C66C] shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-900/60 border-slate-800 opacity-60'
                    : 'bg-slate-50 border-slate-200 opacity-70'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                badge.unlocked
                  ? 'bg-[#F3F8EA] border-[#A8C66C]'
                  : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
              }`}>
                {badge.unlocked ? getBadgeIcon(badge.iconName) : <Lock className="w-5 h-5 text-slate-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-extrabold truncate">{badge.name}</h4>
                  {badge.unlocked ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      Locked ({badge.progress}%)
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {badge.description}
                </p>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  <span>Target: {badge.criteriaText}</span>
                  {badge.unlockedAt && <span>Awarded: {badge.unlockedAt}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Badges automatically update during live coaching sessions.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
