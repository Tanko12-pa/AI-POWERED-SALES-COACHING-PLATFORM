import React from 'react';
import jsPDF from 'jspdf';
import { Download, X, Printer, FileText } from 'lucide-react';
import { CoachingSessionResult, CrmOpportunity } from '../types';

interface DownloadReportModalProps {
  coachingData: CoachingSessionResult | null;
  crmOpportunities: CrmOpportunity[];
  onClose: () => void;
  isDarkMode?: boolean;
}

export const DownloadReportModal: React.FC<DownloadReportModalProps> = ({
  coachingData,
  crmOpportunities,
  onClose,
  isDarkMode = false
}) => {
  const handleExportPdf = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    // Title & Header
    doc.setFillColor(128, 0, 0); // Maroon
    doc.rect(0, 0, 210, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('AI-Powered Sales Coaching Executive Report', 14, 15);

    doc.setFontSize(9);
    doc.text(`Generated: ${today} | Google AI Studio workspace`, 140, 15);

    // Section 1: Summary
    doc.setTextColor(128, 0, 0);
    doc.setFontSize(13);
    doc.text('1. Executive Coaching Summary', 14, 35);

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(
      coachingData?.summary || "Activity logs and CRM records analyzed. You have 3 high-priority proposal follow-ups today.",
      180
    );
    doc.text(summaryLines, 14, 42);

    let yPos = 42 + summaryLines.length * 6;

    // Section 2: Metrics Snapshot
    doc.setTextColor(128, 0, 0);
    doc.setFontSize(13);
    doc.text('2. Key Performance Indicators', 14, yPos);

    yPos += 8;
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.text(`Pipeline Health Score: ${coachingData?.pipeline_health_score || 88} / 100`, 14, yPos);
    doc.text(`Time Management Score: ${coachingData?.time_management_score || 84} / 100`, 110, yPos);

    yPos += 12;
    // Section 3: Recommended Actions
    doc.setTextColor(128, 0, 0);
    doc.setFontSize(13);
    doc.text('3. Recommended Daily Priority Actions', 14, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    const actions = coachingData?.priority_actions || [
      "Follow up with Sarah Jenkins at ACME Corp with SOC2 security report snippet.",
      "Deliver draft 150-seat contract to David Lee at Beta Retail Group."
    ];
    actions.forEach((act, idx) => {
      doc.text(`${idx + 1}. ${act}`, 14, yPos);
      yPos += 6;
    });

    yPos += 6;
    // Section 4: Opportunities Table
    doc.setTextColor(128, 0, 0);
    doc.setFontSize(13);
    doc.text('4. Active Pipeline Opportunities', 14, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text('Deal Name', 14, yPos);
    doc.text('Stage', 80, yPos);
    doc.text('Value ($)', 130, yPos);
    doc.text('Probability', 170, yPos);

    yPos += 4;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, yPos, 195, yPos);

    yPos += 6;
    doc.setTextColor(40, 40, 40);
    crmOpportunities.slice(0, 5).forEach((opp) => {
      doc.text(opp.name.substring(0, 30), 14, yPos);
      doc.text(opp.stage, 80, yPos);
      doc.text(`$${opp.dealValue.toLocaleString()}`, 130, yPos);
      doc.text(`${opp.probability}%`, 170, yPos);
      yPos += 6;
    });

    // Save File
    doc.save(`Sales_Coaching_Report_${today.replace(/\//g, '-')}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
      <div className={`rounded-xl border shadow-2xl max-w-2xl w-full p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#800000] dark:text-red-400" />
            <h3 className="text-lg font-bold text-[#800000] dark:text-red-400">Formatted Executive Report Snapshot</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Preview */}
        <div className={`p-5 rounded-lg text-xs space-y-4 max-h-96 overflow-y-auto border transition-colors ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className={`border-b pb-2 flex justify-between items-center ${
            isDarkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <span className="font-extrabold text-[#800000] dark:text-red-400 text-sm">
              AI-Powered Sales Coaching Platform
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{new Date().toLocaleDateString()}</span>
          </div>

          <div>
            <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Executive Coaching Summary:</h4>
            <p className={`leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {coachingData?.summary || "Activity logs and CRM records analyzed. You have 3 high-priority proposal follow-ups today."}
            </p>
          </div>

          <div className={`grid grid-cols-2 gap-3 p-3 rounded border transition-colors ${
            isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div>
              <span className={`font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pipeline Health:</span>
              <div className="text-base font-extrabold text-[#800000] dark:text-red-400">{coachingData?.pipeline_health_score || 88} / 100</div>
            </div>
            <div>
              <span className={`font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Time Management:</span>
              <div className={`text-base font-extrabold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{coachingData?.time_management_score || 84} / 100</div>
            </div>
          </div>

          <div>
            <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Priority Action Plan:</h4>
            <ul className={`list-disc pl-4 space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {(coachingData?.priority_actions || ["Follow up with ACME Corp regarding pricing proposal"]).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`mt-5 flex items-center justify-end gap-3 pt-3 border-t ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <button
            onClick={handlePrint}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isDarkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#800000] text-white hover:bg-[#600000] transition-colors"
          >
            <Download className="w-4 h-4 text-[#A8C66C]" />
            <span>Download Formatted PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
