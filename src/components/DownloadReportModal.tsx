import React from 'react';
import jsPDF from 'jspdf';
import { Download, X, Printer, FileText } from 'lucide-react';
import { CoachingSessionResult, CrmOpportunity } from '../types';

interface DownloadReportModalProps {
  coachingData: CoachingSessionResult | null;
  crmOpportunities: CrmOpportunity[];
  onClose: () => void;
}

export const DownloadReportModal: React.FC<DownloadReportModalProps> = ({
  coachingData,
  crmOpportunities,
  onClose
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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#800000]" />
            <h3 className="text-lg font-bold text-[#800000]">Formatted Executive Report Snapshot</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Preview */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg text-xs space-y-4 max-h-96 overflow-y-auto">
          <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
            <span className="font-extrabold text-[#800000] text-sm">
              AI-Powered Sales Coaching Platform
            </span>
            <span className="text-slate-500 font-mono text-[11px]">{new Date().toLocaleDateString()}</span>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">Executive Coaching Summary:</h4>
            <p className="text-slate-700 leading-relaxed font-medium">
              {coachingData?.summary || "Activity logs and CRM records analyzed. You have 3 high-priority proposal follow-ups today."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-500 font-semibold">Pipeline Health:</span>
              <div className="text-base font-extrabold text-[#800000]">{coachingData?.pipeline_health_score || 88} / 100</div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Time Management:</span>
              <div className="text-base font-extrabold text-slate-900">{coachingData?.time_management_score || 84} / 100</div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">Priority Action Plan:</h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              {(coachingData?.priority_actions || ["Follow up with ACME Corp regarding pricing proposal"]).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
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
