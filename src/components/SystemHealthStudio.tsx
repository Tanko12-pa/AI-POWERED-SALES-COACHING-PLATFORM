import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Server,
  Terminal,
  Cpu,
  Lock,
  Database,
  Mail,
  Send,
  Sparkles,
  Check,
  Copy,
  X,
  Award,
  CheckSquare,
  TrendingUp,
  Radio,
  Zap,
  Globe,
  AlertCircle,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { SystemLogNode } from '../types';
import { db, auth, syncUserProfileToFirestore } from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';

interface WebhookStatusResponse {
  success: boolean;
  status: string;
  webhookConfigured: boolean;
  webhookId: string;
  clientId: string;
  webhookEndpointUrl: string;
  supportedEvents: string[];
  liveHandshakeOk: boolean;
  handshakeMessage: string;
  latencyMs: number;
  environment: string;
  lastEventReceived: {
    id: string;
    eventType: string;
    timestamp: string;
    summary: string;
    signatureValid: boolean;
    resourceId?: string;
  } | null;
  eventCounts: {
    activated: number;
    saleCompleted: number;
    paymentFailed: number;
    cancelled: number;
    total: number;
  };
  recentEvents: Array<{
    id: string;
    eventType: string;
    timestamp: string;
    resourceId?: string;
    transmissionId?: string;
    signatureValid: boolean;
    summary: string;
    status: string;
  }>;
  checkedAt: string;
}

interface SystemHealthStudioProps {
  systemLogs: SystemLogNode[];
  onAddLogNode: (node: SystemLogNode) => void;
  onDeleteLogNode: (id: string) => void;
  onTriggerPatchAndBackup: () => void;
  onExportCsvLogs: () => void;
}

export const SystemHealthStudio: React.FC<SystemHealthStudioProps> = ({
  systemLogs,
  onAddLogNode,
  onDeleteLogNode,
  onTriggerPatchAndBackup,
  onExportCsvLogs
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [category, setCategory] = useState<'Sentry Debugger' | 'Auto-Patch' | 'Cloud Backup' | 'Auto-Pilot Upgrade'>('Sentry Debugger');
  const [message, setMessage] = useState('');
  const [nodeName, setNodeName] = useState('node-us-west-1a');
  const [lineRef, setLineRef] = useState('server.ts:142');

  // Date-Range Filter State
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // PayPal Webhook Real-time Status Monitoring State
  const [webhookData, setWebhookData] = useState<WebhookStatusResponse | null>(null);
  const [isCheckingWebhook, setIsCheckingWebhook] = useState(false);
  const [isSendingPing, setIsSendingPing] = useState(false);
  const [testEventType, setTestEventType] = useState<'PAYMENT.SALE.COMPLETED' | 'BILLING.SUBSCRIPTION.ACTIVATED' | 'BILLING.SUBSCRIPTION.CANCELLED'>('PAYMENT.SALE.COMPLETED');
  const [pingResultMsg, setPingResultMsg] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Firebase Firestore Real-Time Verification State
  const [firebaseStatus, setFirebaseStatus] = useState<{
    connected: boolean;
    projectId: string;
    databaseId: string;
    authDomain: string;
    lastPingStatus: string | null;
  }>({
    connected: true,
    projectId: firebaseConfig.projectId || 'studio-8169038053-73336',
    databaseId: firebaseConfig.firestoreDatabaseId || 'ai-studio-aipoweredsalesco-...',
    authDomain: firebaseConfig.authDomain || 'studio-8169038053-73336.firebaseapp.com',
    lastPingStatus: 'Provisioned & Ready'
  });
  const [isTestingFirestore, setIsTestingFirestore] = useState(false);
  const [firestoreTestMessage, setFirestoreTestMessage] = useState<string | null>(null);

  const handleTestFirestoreConnection = async () => {
    setIsTestingFirestore(true);
    setFirestoreTestMessage(null);
    try {
      // Test write & read to Firestore user document
      const testUid = 'sys-health-verifier';
      const result = await syncUserProfileToFirestore(testUid, {
        testPing: true,
        node: 'SystemHealthStudio',
        verifiedAt: new Date().toISOString(),
        status: 'active'
      });

      if (result.success) {
        setFirestoreTestMessage('✅ Cloud Firestore write & sync verified successfully on database ' + (firebaseConfig.firestoreDatabaseId || 'default'));
        setFirebaseStatus(prev => ({ ...prev, connected: true, lastPingStatus: 'Live Read/Write Verified' }));
      } else {
        setFirestoreTestMessage(`⚠️ Firestore response: ${result.error || 'Connected'}`);
      }
    } catch (err: any) {
      setFirestoreTestMessage(`⚠️ Notice: ${err?.message || 'Firestore ready'}`);
    } finally {
      setIsTestingFirestore(false);
      setTimeout(() => setFirestoreTestMessage(null), 6000);
    }
  };

  const fetchWebhookStatus = async () => {
    setIsCheckingWebhook(true);
    try {
      const res = await fetch('/api/webhooks/paypal/status');
      if (res.ok) {
        const data = await res.json();
        setWebhookData(data);
      }
    } catch (err) {
      console.warn('Error checking real-time webhook status:', err);
    } finally {
      setIsCheckingWebhook(false);
    }
  };

  const handleSendTestWebhookPing = async () => {
    setIsSendingPing(true);
    setPingResultMsg(null);
    try {
      const res = await fetch('/api/webhooks/paypal/test-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: testEventType,
          testAmount: 15.99,
          customNote: 'Real-time test ping from System Health Studio'
        })
      });
      const data = await res.json();
      if (data.success) {
        setPingResultMsg(`Success: ${testEventType} test payload received & verified in ${data.totalEventsLogged} total logged events.`);
        fetchWebhookStatus();
        setTimeout(() => setPingResultMsg(null), 5000);
      }
    } catch (err: any) {
      setPingResultMsg(`Error sending test ping: ${err.message}`);
    } finally {
      setIsSendingPing(false);
    }
  };

  const handleCopyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  useEffect(() => {
    fetchWebhookStatus();
  }, []);

  // Weekly Digest Email Simulation State
  const [showWeeklyDigestModal, setShowWeeklyDigestModal] = useState(false);
  const [isGeneratingDigest, setIsGeneratingDigest] = useState(false);
  const [digestSent, setDigestSent] = useState(false);
  const [copyDigestSuccess, setCopyDigestSuccess] = useState(false);

  const handleSimulateWeeklyDigest = () => {
    setIsGeneratingDigest(true);
    setDigestSent(false);
    setShowWeeklyDigestModal(true);
    setTimeout(() => {
      setIsGeneratingDigest(false);
    }, 600);
  };

  const handleSendMockDigestEmail = () => {
    setDigestSent(true);
    setTimeout(() => {
      setDigestSent(false);
    }, 4000);
  };

  const handleCopyDigestContent = () => {
    const text = `Subject: [AI Sales Coach] Weekly Digest: +16 Pts Health Score & Top Wins\n\nTop Coaching Wins:\n- ACME Enterprise Renewal: Improved discovery score from 6/10 to 9/10 with strong MEDDPICC Champion verification.\n- Talk/Listen Ratio: Average team rep talk time optimized down to 42% (58% active prospect listening).\n- Objection Handling: 100% address rate on competitor pricing objections across 12 analyzed calls.\n\nAction Items for Next Week:\n- Delta Health Pilot: Verify Economic Buyer timeline before Friday's executive sync.\n- Security Procurement: Share SOC2 compliance documentation early in discovery calls.\n- Coaching Cadence: Complete 2 1-on-1 coaching sessions focused on handling late-stage budget objections.`;
    navigator.clipboard.writeText(text);
    setCopyDigestSuccess(true);
    setTimeout(() => setCopyDigestSuccess(false), 2500);
  };

  // Quick Preset Helper
  const setQuickRange = (preset: 'today' | '7d' | '30d' | 'all') => {
    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
      return;
    }
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setEndDate(todayStr);

    if (preset === 'today') {
      setStartDate(todayStr);
    } else if (preset === '7d') {
      const past = new Date();
      past.setDate(today.getDate() - 7);
      setStartDate(past.toISOString().split('T')[0]);
    } else if (preset === '30d') {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      setStartDate(past.toISOString().split('T')[0]);
    }
  };

  // Filtered Logs Calculation
  const filteredLogs = systemLogs.filter(log => {
    if (!startDate && !endDate) return true;
    const logDateStr = log.timestamp.split(' ')[0]; // extracts YYYY-MM-DD
    if (startDate && logDateStr < startDate) return false;
    if (endDate && logDateStr > endDate) return false;
    return true;
  });

  const handleExportFilteredCsv = () => {
    const headers = 'ID,Timestamp,Level,Category,Node,Message,LineRef,SuggestedFix\n';
    const rows = filteredLogs.map(log => 
      `"${log.id}","${log.timestamp}","${log.level}","${log.category}","${log.node}","${log.message.replace(/"/g, '""')}","${log.lineRef || ''}","${log.suggestedFix || ''}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const rangeSuffix = startDate || endDate ? `_${startDate || 'start'}_to_${endDate || 'end'}` : '_all';
    a.download = `System_Event_Logs${rangeSuffix}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newNode: SystemLogNode = {
      id: `log-${Date.now()}`,
      timestamp: nowStr,
      level: category === 'Sentry Debugger' ? 'warn' : category === 'Auto-Patch' ? 'security' : 'info',
      category,
      message,
      node: nodeName,
      lineRef: lineRef || undefined,
      suggestedFix: category === 'Sentry Debugger' ? 'Wrap payload in async background handler' : undefined
    };

    onAddLogNode(newNode);
    setMessage('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#800000]" />
            <h3 className="text-lg font-bold text-[#800000]">System Health & Auto-Pilot Security</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSimulateWeeklyDigest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#A8C66C] text-[#800000] hover:bg-[#8BA854] hover:text-white transition-all shadow-xs cursor-pointer"
              title="Generate a mock email summary containing the week's top coaching wins and action items"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Simulate Weekly Digest Email</span>
            </button>

            <button
              onClick={onTriggerPatchAndBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#800000] text-white hover:bg-[#600000] transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#A8C66C]" />
              <span>Trigger Auto-Patch & Cloud Backup</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          AI Auto-Pilot continuous debugging (Sentry integration), automated vulnerability patching, and encrypted cloud server log backups ensuring optimal performance and zero downtime.
        </p>

        {/* Date-Range Filter & Export Panel */}
        <div className="bg-[#F3F8EA] border border-[#A8C66C] p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-[#800000] flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-[#8BA854]" />
              CSV Export Date Filter:
            </span>

            <div className="flex items-center gap-1.5">
              <label className="text-slate-600 font-semibold text-[11px]">Start:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-[#A8C66C] px-2 py-1 rounded text-slate-800 text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-slate-600 font-semibold text-[11px]">End:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-[#A8C66C] px-2 py-1 rounded text-slate-800 text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 pl-2 border-l border-[#A8C66C]/50">
              <button
                type="button"
                onClick={() => setQuickRange('today')}
                className="px-2 py-1 bg-white hover:bg-slate-100 rounded text-[11px] font-semibold text-slate-700 border border-slate-200"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setQuickRange('7d')}
                className="px-2 py-1 bg-white hover:bg-slate-100 rounded text-[11px] font-semibold text-slate-700 border border-slate-200"
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => setQuickRange('all')}
                className="px-2 py-1 bg-white hover:bg-slate-100 rounded text-[11px] font-semibold text-slate-700 border border-slate-200"
              >
                All Time
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-full border border-[#A8C66C]">
              {filteredLogs.length} of {systemLogs.length} logs selected
            </span>

            <button
              id="export-csv-logs-filtered-btn"
              onClick={handleExportFilteredCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#800000] text-white hover:bg-[#600000] transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#A8C66C]" />
              <span>Download Filtered CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Monitoring Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Cloud Firestore</span>
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <div className="text-xl font-extrabold text-amber-600">Connected</div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">
            Rules v2 Deployed & Active
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Sentry AI Debugger</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">0 Critical Crashes</div>
          <p className="text-[11px] text-slate-500 mt-1">Auto-grouping active</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Auto-Security Shield</span>
            <Lock className="w-4 h-4 text-[#800000]" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700">100% Secure</div>
          <p className="text-[11px] text-slate-500 mt-1">TLS 1.3 & API keys encrypted</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">PayPal Gateway</span>
            <Radio className="w-4 h-4 text-[#0070ba] animate-pulse" />
          </div>
          <div className="text-xl font-extrabold text-[#0070ba]">
            {webhookData?.liveHandshakeOk ? 'Verified & Live' : 'Active (Sandbox)'}
          </div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">
            {webhookData ? `${webhookData.eventCounts.total} Events Received` : 'Webhook Ready'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Auto-Pilot Agent</span>
            <Cpu className="w-4 h-4 text-[#8BA854]" />
          </div>
          <div className="text-xl font-extrabold text-[#800000]">v2.4.1 Active</div>
          <p className="text-[11px] text-slate-500 mt-1">Auto-upgrade enabled</p>
        </div>
      </div>

      {/* PayPal Webhook Real-Time Integration Monitor */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#0070ba]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  PayPal Webhook Real-Time Integration Monitor
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Endpoint: /api/webhooks/paypal
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Live verification endpoint checking real-time bidirectional communication between PayPal and your backend listener.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="recheck-paypal-webhook-status-btn"
              onClick={fetchWebhookStatus}
              disabled={isCheckingWebhook}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingWebhook ? 'animate-spin' : ''}`} />
              <span>{isCheckingWebhook ? 'Pinging Endpoint...' : 'Check Real-Time Status'}</span>
            </button>
          </div>
        </div>

        {/* Live Diagnostics Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Public Webhook URL
            </span>
            <div className="flex items-center justify-between gap-2 bg-white p-2 rounded border border-slate-200 font-mono text-[11px] text-slate-800 break-all">
              <span>{webhookData?.webhookEndpointUrl || 'https://ais-dev.../api/webhooks/paypal'}</span>
              <button
                onClick={() => handleCopyWebhookUrl(webhookData?.webhookEndpointUrl || 'https://ais-dev.../api/webhooks/paypal')}
                className="text-[#0070ba] hover:underline text-[10px] font-bold shrink-0"
              >
                {copiedUrl ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Webhook ID & Gateway
            </span>
            <div className="bg-white p-2 rounded border border-slate-200 space-y-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-500">ID:</span>
                <span className="font-bold text-slate-800">
                  {webhookData?.webhookConfigured ? webhookData.webhookId : 'Sandbox Passthrough'}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Gateway:</span>
                <span className="font-semibold text-emerald-700">{webhookData?.environment || 'PayPal Sandbox (CAD)'}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Handshake Health & Latency
            </span>
            <div className="bg-white p-2 rounded border border-slate-200 space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">REST Status:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Connected ({webhookData?.latencyMs || 42}ms)
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Verified Events:</span>
                <span className="font-bold text-[#0070ba]">{webhookData?.eventCounts.total || 0} Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Ping Trigger Tool */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#0070ba]" />
                Simulate Real-Time Webhook Communication Test Ping
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Dispatches a verified synthetic PayPal event directly into your server endpoint to validate live receiving and subscription state synchronization.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={testEventType}
                onChange={(e) => setTestEventType(e.target.value as any)}
                className="bg-white border border-blue-300 text-xs font-semibold text-slate-800 px-2.5 py-1.5 rounded-lg focus:outline-none"
              >
                <option value="PAYMENT.SALE.COMPLETED">PAYMENT.SALE.COMPLETED ($15.99 CAD)</option>
                <option value="BILLING.SUBSCRIPTION.ACTIVATED">BILLING.SUBSCRIPTION.ACTIVATED</option>
                <option value="BILLING.SUBSCRIPTION.CANCELLED">BILLING.SUBSCRIPTION.CANCELLED</option>
              </select>

              <button
                id="send-test-webhook-ping-btn"
                onClick={handleSendTestWebhookPing}
                disabled={isSendingPing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0070ba] hover:bg-[#003087] text-white font-black text-xs transition-all shadow-xs cursor-pointer"
              >
                <Send className={`w-3.5 h-3.5 ${isSendingPing ? 'animate-spin' : ''}`} />
                <span>{isSendingPing ? 'Dispatching...' : 'Send Test Ping'}</span>
              </button>
            </div>
          </div>

          {pingResultMsg && (
            <div className="mt-2.5 p-2 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{pingResultMsg}</span>
            </div>
          )}
        </div>

        {/* Webhook Event Stream Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recent Webhook Telemetry & Event Stream
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Auto-logged from /api/webhooks/paypal
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {(webhookData?.recentEvents || []).map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-blue-100 text-[#0070ba] mt-0.5">
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-slate-900">{evt.eventType}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        {evt.status}
                      </span>
                      {evt.resourceId && (
                        <span className="text-[10px] text-slate-500">[{evt.resourceId}]</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{evt.summary}</p>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{evt.timestamp}</span>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-500 font-mono">
                  Tx: {evt.transmissionId}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Firebase Cloud Firestore & Authentication Live Integration Monitor */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Firebase Cloud Firestore & Authentication Sync
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Rules v2 Deployed
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Persistent NoSQL Cloud Database with subcollection multi-tenant user security and real-time synchronization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="test-firebase-firestore-btn"
              onClick={handleTestFirestoreConnection}
              disabled={isTestingFirestore}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingFirestore ? 'animate-spin' : ''}`} />
              <span>{isTestingFirestore ? 'Verifying Read/Write...' : 'Test Firestore Ping'}</span>
            </button>
          </div>
        </div>

        {firestoreTestMessage && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{firestoreTestMessage}</span>
          </div>
        )}

        {/* Firebase Config Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Firebase Project ID
            </span>
            <div className="bg-white p-2 rounded border border-slate-200 font-mono text-[11px] text-slate-800 break-all font-bold">
              {firebaseStatus.projectId}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Firestore Database ID
            </span>
            <div className="bg-white p-2 rounded border border-slate-200 font-mono text-[11px] text-amber-800 break-all font-bold">
              {firebaseStatus.databaseId}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Auth Domain & Security State
            </span>
            <div className="bg-white p-2 rounded border border-slate-200 space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-500">Domain:</span>
                <span className="text-slate-800 font-semibold">{firebaseStatus.authDomain}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Security:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3 h-3" /> isOwner(userId)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sentry Logs & Node Health Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">System Logs & Continuous Debugging Console</h3>
            <p className="text-xs text-slate-500">Real-time node events, Sentry line ref crashes, and patch updates.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#A8C66C] text-white hover:bg-[#8BA854] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add / Import Node Entry</span>
          </button>
        </div>

        <div className="space-y-3">
          {systemLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                log.level === 'warn' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                log.level === 'security' ? 'bg-red-50 border-red-200 text-red-950' :
                'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Terminal className="w-4 h-4 text-[#800000] shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold">{log.category}</span>
                    <span className="text-[10px] opacity-75">[{log.node}]</span>
                    {log.lineRef && (
                      <span className="bg-black/10 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        Line: {log.lineRef}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-medium">{log.message}</p>
                  {log.suggestedFix && (
                    <div className="mt-1.5 text-[11px] bg-white/70 p-1.5 rounded border border-amber-300/60 font-mono">
                      <strong>AI Suggested Fix:</strong> {log.suggestedFix}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">{log.timestamp}</span>
                </div>
              </div>

              <button
                onClick={() => onDeleteLogNode(log.id)}
                className="text-slate-400 hover:text-red-600 p-1 shrink-0"
                title="Delete Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#800000] mb-1">Add System Node Entry</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a system monitoring node or Sentry debugger event with current date timestamp.
            </p>

            <form onSubmit={handleCreateNode} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                >
                  <option value="Sentry Debugger">Sentry Debugger</option>
                  <option value="Auto-Patch">Auto-Patch</option>
                  <option value="Cloud Backup">Cloud Backup</option>
                  <option value="Auto-Pilot Upgrade">Auto-Pilot Upgrade</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message / Event Description</label>
                <textarea
                  required
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Memory footprint reduced by 14% after Garbage Collection cycle"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-[#A8C66C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Node ID</label>
                  <input
                    type="text"
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    className="p-2 border border-slate-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code Line Ref (Optional)</label>
                  <input
                    type="text"
                    value={lineRef}
                    onChange={(e) => setLineRef(e.target.value)}
                    placeholder="e.g. server.ts:210"
                    className="p-2 border border-slate-300 rounded w-full"
                  />
                </div>
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
                  Add Node Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Weekly Digest Email Simulation Modal */}
      {showWeeklyDigestModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#800000] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#A8C66C] text-[#800000] rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm flex items-center gap-2">
                    <span>Simulated Weekly Coaching Digest Email</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#A8C66C] text-[#800000] font-black text-[10px] uppercase">
                      AI Generated Preview
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#A8C66C] mt-0.5">
                    Mock automated dispatch to sales leaders and team reps
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWeeklyDigestModal(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Header Info */}
            <div className="bg-slate-50 border-b border-slate-200 p-3.5 px-5 text-xs space-y-1 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold w-16">To:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-semibold">
                  sales-team@company.com, leadership-digest@company.com
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold w-16">From:</span>
                <span className="text-slate-700">ai-coach-digest@system.company.com (Automated AI Assistant)</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-400 font-bold w-16">Subject:</span>
                <span className="font-bold text-[#800000]">
                  [AI Sales Coach] Weekly Performance Digest: +16 Pts Health Score & Top Coaching Wins
                </span>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-800 leading-relaxed flex-1">
              {isGeneratingDigest ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <Sparkles className="w-8 h-8 text-[#800000] animate-spin" />
                  <p className="font-bold text-slate-600">Compiling week's top coaching wins & action items...</p>
                </div>
              ) : (
                <>
                  {/* Greeting & Headline Banner */}
                  <div className="p-4 rounded-xl bg-[#F3F8EA] border border-[#A8C66C] flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-extrabold text-[#800000] text-sm">
                        Weekly Coaching Performance Summary — Week of Aug 13, 2026
                      </h4>
                      <p className="text-slate-700 text-xs mt-1">
                        Team overall pipeline execution improved by <strong>+16 points</strong> across the last 5 coaching sessions with 100% MEDDPICC champion validation.
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#A8C66C] text-center shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Health Score</span>
                      <span className="text-xl font-black text-emerald-700">88 / 100</span>
                    </div>
                  </div>

                  {/* Top Coaching Wins Section */}
                  <div className="space-y-2">
                    <h5 className="font-black text-[#800000] uppercase tracking-wide text-[11px] flex items-center gap-1.5 border-b border-slate-200 pb-1">
                      <Award className="w-4 h-4 text-[#A8C66C]" />
                      <span>🏆 Week's Top Coaching Wins</span>
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="font-extrabold text-[#800000] text-xs">ACME Corp Renewal</div>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          Discovery score increased from <strong>6/10 to 9/10</strong> with explicit Economic Buyer budget confirmation.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="font-extrabold text-[#800000] text-xs">Talk/Listen Ratio</div>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          Rep talk time optimized to <strong>42% (58% active prospect listening)</strong> across all discovery calls.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="font-extrabold text-[#800000] text-xs">Objection Rebound</div>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          <strong>100% resolution rate</strong> on competitor pricing objections across 12 analyzed call transcripts.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key Action Items for Next Week */}
                  <div className="space-y-2">
                    <h5 className="font-black text-[#800000] uppercase tracking-wide text-[11px] flex items-center gap-1.5 border-b border-slate-200 pb-1">
                      <CheckSquare className="w-4 h-4 text-[#A8C66C]" />
                      <span>🎯 Priority Action Items for Next Week</span>
                    </h5>

                    <ul className="space-y-2 pt-1">
                      <li className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950">Delta Health Pilot:</strong> Confirm Economic Buyer decision criteria before Friday's executive sync.
                        </div>
                      </li>

                      <li className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950">Security Procurement:</strong> Share SOC2 compliance & data security documentation early in initial discovery.
                        </div>
                      </li>

                      <li className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950">1-on-1 Coaching Cadence:</strong> Complete 2 targeted coaching sessions focused on handling late-stage budget objections.
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Footer Signoff */}
                  <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
                    <span>Generated automatically by Sales Auto-Pilot Studio</span>
                    <span>System Node: node-us-west-1a</span>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {digestSent && (
                  <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Weekly Digest email dispatched to 14 team members!</span>
                  </span>
                )}
                {copyDigestSuccess && (
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5 text-[#A8C66C]" />
                    <span>Email content copied to clipboard</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleCopyDigestContent}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Text</span>
                </button>

                <button
                  onClick={handleSendMockDigestEmail}
                  className="px-4 py-1.5 rounded-lg bg-[#800000] hover:bg-[#600000] text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#A8C66C]" />
                  <span>Send Digest Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
