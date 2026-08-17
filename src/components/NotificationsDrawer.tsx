import React from 'react';
import { Bell, X, AlertTriangle, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { PushNotification } from '../types';

interface NotificationsDrawerProps {
  notifications: PushNotification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  notifications,
  onMarkRead,
  onClearAll,
  onClose,
  isDarkMode = false
}) => {
  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-80 shadow-2xl border-l z-50 flex flex-col no-print transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#A8C66C]" />
          <h3 className="text-sm font-bold">Push Notifications & Critical Alerts</h3>
        </div>
        <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className={`p-3 border-b flex items-center justify-between text-xs transition-colors ${
        isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <span className="font-medium">{notifications.length} Total Alerts</span>
        <button onClick={onClearAll} className="text-[#800000] dark:text-red-400 font-bold hover:underline">
          Clear All
        </button>
      </div>

      <div className={`flex-1 p-3 overflow-y-auto space-y-2 text-xs transition-colors ${
        isDarkMode ? 'bg-slate-950/70' : 'bg-white'
      }`}>
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => onMarkRead(n.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              n.read
                ? isDarkMode
                  ? 'bg-slate-800/40 border-slate-800 opacity-60 text-slate-400'
                  : 'bg-slate-50 border-slate-200 opacity-75'
                : isDarkMode
                  ? 'bg-slate-850 bg-slate-800 border-[#A8C66C]/70 shadow-xs'
                  : 'bg-white border-[#A8C66C] shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className={`flex items-center gap-1.5 font-bold ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {n.type === 'deal_alert' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                {n.type === 'coaching' && <Sparkles className="w-4 h-4 text-[#8BA854]" />}
                {n.type === 'security' && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                <span>{n.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
            </div>
            <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
