import React from 'react';
import { Bell, X, AlertTriangle, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { PushNotification } from '../types';

interface NotificationsDrawerProps {
  notifications: PushNotification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  notifications,
  onMarkRead,
  onClearAll,
  onClose
}) => {
  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col no-print">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#A8C66C]" />
          <h3 className="text-sm font-bold">Push Notifications & Critical Alerts</h3>
        </div>
        <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium">{notifications.length} Total Alerts</span>
        <button onClick={onClearAll} className="text-[#800000] font-bold hover:underline">
          Clear All
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => onMarkRead(n.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              n.read ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-[#A8C66C] shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                {n.type === 'deal_alert' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                {n.type === 'coaching' && <Sparkles className="w-4 h-4 text-[#8BA854]" />}
                {n.type === 'security' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                <span>{n.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
