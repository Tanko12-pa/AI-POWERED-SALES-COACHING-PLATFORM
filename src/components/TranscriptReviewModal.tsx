import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Search,
  Download,
  Copy,
  X,
  Check,
  Clock,
  User,
  Mic,
  Filter,
  Sparkles,
  Tag
} from 'lucide-react';

export interface TranscriptReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcriptText: string;
  repName: string;
  prospectName: string;
  opportunityName: string;
  evidenceQuotes?: string[];
  initialSearchQuery?: string;
}

export const TranscriptReviewModal: React.FC<TranscriptReviewModalProps> = ({
  isOpen,
  onClose,
  transcriptText,
  repName,
  prospectName,
  opportunityName,
  evidenceQuotes = [],
  initialSearchQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filterMatchesOnly, setFilterMatchesOnly] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Sync initial query when opened
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery, isOpen]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Format helper for dynamic timestamps (e.g., 85 -> "00:01:25")
  const formatSecondsToTimestamp = (totalSeconds: number): string => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Parse transcript into structured turns with speaker labels & timestamps
  const parsedTurns = useMemo(() => {
    if (!transcriptText) return [];

    const lines = transcriptText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    let cumulativeSeconds = 12; // Start call at 00:00:12

    return lines.map((line, index) => {
      // Check if line already has an explicit timestamp like [01:23] or (01:23)
      const timestampMatch = line.match(/^\[?\(?(\d{1,2}:\d{2}(?::\d{2})?)\)?\]?\s*/);
      let timeStr = '';
      let cleanLine = line;

      if (timestampMatch) {
        timeStr = timestampMatch[1];
        cleanLine = line.replace(timestampMatch[0], '').trim();
      } else {
        timeStr = formatSecondsToTimestamp(cumulativeSeconds);
        // Estimate turn length: 15 to 30 seconds based on word count
        const wordCount = cleanLine.split(/\s+/).length;
        cumulativeSeconds += Math.max(12, Math.min(45, Math.round(wordCount * 0.8)));
      }

      // Determine speaker role & clean text
      let speakerRole: 'rep' | 'prospect' | 'coach' | 'other' = 'other';
      let speakerDisplayName = 'Speaker';
      let utteranceText = cleanLine;

      const lower = cleanLine.toLowerCase();
      if (lower.startsWith('rep:') || lower.startsWith('sales rep:') || lower.includes('alex') || lower.startsWith('rep (')) {
        speakerRole = 'rep';
        speakerDisplayName = repName || 'Sales Representative';
        utteranceText = cleanLine.replace(/^(rep|sales rep|rep\s*\([^)]*\)):\s*/i, '').trim();
      } else if (lower.startsWith('prospect:') || lower.startsWith('client:') || lower.includes('sarah') || lower.includes('john') || lower.startsWith('prospect (')) {
        speakerRole = 'prospect';
        speakerDisplayName = prospectName || 'Prospect / Client';
        utteranceText = cleanLine.replace(/^(prospect|client|prospect\s*\([^)]*\)):\s*/i, '').trim();
      } else if (lower.startsWith('coach:') || lower.startsWith('ai coach:')) {
        speakerRole = 'coach';
        speakerDisplayName = 'AI Sales Coach';
        utteranceText = cleanLine.replace(/^(coach|ai coach):\s*/i, '').trim();
      }

      return {
        id: index + 1,
        turnNumber: index + 1,
        timestamp: timeStr,
        speakerRole,
        speakerDisplayName,
        utteranceText,
        originalLine: line
      };
    });
  }, [transcriptText, repName, prospectName]);

  // Calculate matching turns count & match highlighting
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return { matchingTurnIds: new Set<number>(), count: 0 };
    const q = searchQuery.trim().toLowerCase();
    const matchingIds = new Set<number>();
    let totalOccurrences = 0;

    parsedTurns.forEach(turn => {
      const textLower = turn.utteranceText.toLowerCase();
      const speakerLower = turn.speakerDisplayName.toLowerCase();
      if (textLower.includes(q) || speakerLower.includes(q) || turn.timestamp.includes(q)) {
        matchingIds.add(turn.id);
        // Count substring occurrences
        const matches = textLower.split(q).length - 1;
        totalOccurrences += Math.max(1, matches);
      }
    });

    return { matchingTurnIds: matchingIds, count: totalOccurrences };
  }, [parsedTurns, searchQuery]);

  // Filtered turns list for rendering
  const displayedTurns = useMemo(() => {
    if (filterMatchesOnly && searchQuery.trim()) {
      return parsedTurns.filter(t => searchMatches.matchingTurnIds.has(t.id));
    }
    return parsedTurns;
  }, [parsedTurns, filterMatchesOnly, searchQuery, searchMatches]);

  // Helper to render text with highlighted search keywords
  const renderHighlightedText = (text: string) => {
    if (!searchQuery.trim()) return text;

    const query = searchQuery.trim();
    // Escape regex special characters
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={i}
              className="bg-amber-300 dark:bg-amber-400 text-slate-950 font-black px-1 py-0.5 rounded shadow-2xs border border-amber-500/50 inline-block my-0.5"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Export Transcript as formatted .TXT file download
  const handleExportToTxt = () => {
    if (!transcriptText) return;

    const nowStr = new Date().toLocaleString();
    const header = [
      '================================================================',
      '              AI SALES COACHING - CALL TRANSCRIPT               ',
      '================================================================',
      `Opportunity:   ${opportunityName}`,
      `Sales Rep:     ${repName}`,
      `Prospect:      ${prospectName}`,
      `Exported On:   ${nowStr}`,
      `Total Turns:   ${parsedTurns.length}`,
      '================================================================\n\n'
    ].join('\n');

    const formattedBody = parsedTurns
      .map(t => {
        const roleLabel = t.speakerRole === 'rep' ? `🎙️ [${t.speakerDisplayName}]` : t.speakerRole === 'prospect' ? `👤 [${t.speakerDisplayName}]` : `🤖 [${t.speakerDisplayName}]`;
        return `[${t.timestamp}] ${roleLabel}\n${t.utteranceText}\n`;
      })
      .join('\n');

    const fullExportText = header + formattedBody;

    const blob = new Blob([fullExportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeFilename = `transcript-${opportunityName.toLowerCase().replace(/[^a-z0-9]/g, '_')}-${Date.now().toString().slice(-6)}.txt`;
    
    link.href = url;
    link.download = safeFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  // Copy Full Transcript to Clipboard
  const handleCopyTranscript = () => {
    if (!transcriptText) return;

    const formattedBody = parsedTurns
      .map(t => `[${t.timestamp}] ${t.speakerDisplayName}: ${t.utteranceText}`)
      .join('\n');

    navigator.clipboard.writeText(formattedBody);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#800000] text-[#A8C66C] shadow-xs shrink-0">
              <FileText className="w-5 h-5 text-[#A8C66C]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Full Call Transcript & Speaker Analysis</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                  {parsedTurns.length} Speaker Turns
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Rep: <strong className="text-slate-800 dark:text-slate-200">{repName}</strong> | Prospect: <strong className="text-slate-800 dark:text-slate-200">{prospectName}</strong> ({opportunityName})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title="Close Modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Toolbar: Search Bar + Filter Options + Evidence Quotes */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shrink-0">
          
          {/* Search Input Bar with Match Counter & Clear Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transcript by keyword (e.g., 'pricing', 'SOC2', 'budget')..."
                className="w-full pl-10 pr-20 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#A8C66C] shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Match Counter Badge & Filter Toggle */}
            {searchQuery.trim() && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-extrabold text-[11px] shadow-2xs">
                  {searchMatches.count} Match{searchMatches.count !== 1 ? 'es' : ''} in {searchMatches.matchingTurnIds.size} Turn{searchMatches.matchingTurnIds.size !== 1 ? 's' : ''}
                </span>

                <button
                  onClick={() => setFilterMatchesOnly(!filterMatchesOnly)}
                  className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    filterMatchesOnly
                      ? 'bg-[#800000] text-white border-[#800000] shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                  title="Filter view to only show turns containing the search query"
                >
                  <Filter className="w-3.5 h-3.5 text-[#A8C66C]" />
                  <span>{filterMatchesOnly ? 'Show All Turns' : 'Matches Only'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Evidence Quotes Verification Pills */}
          {evidenceQuotes && evidenceQuotes.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#800000] dark:text-red-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#A8C66C]" />
                  <span>QA Evidence Quotes Verification:</span>
                </span>
                <span className="text-slate-400 font-normal">Click any quote to search and highlight in transcript</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1">
                {evidenceQuotes.map((q, qIdx) => {
                  const cleanedQuote = q.replace(/^(Prospect|Rep):\s*/i, '').trim().substring(0, 24);
                  const isActive = searchQuery.toLowerCase().includes(cleanedQuote.toLowerCase());
                  return (
                    <button
                      key={qIdx}
                      onClick={() => {
                        setSearchQuery(cleanedQuote);
                        setFilterMatchesOnly(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all text-left truncate max-w-xs cursor-pointer ${
                        isActive
                          ? 'bg-[#800000] text-white border-[#800000] font-bold shadow-xs'
                          : 'bg-[#F3F8EA] dark:bg-slate-800/90 border-[#A8C66C]/60 text-slate-800 dark:text-slate-200 hover:border-[#800000]'
                      }`}
                      title={`Click to highlight quote: "${q}"`}
                    >
                      <span className="font-bold text-[#800000] dark:text-red-400 mr-1">"</span>
                      {q}
                      <span className="font-bold text-[#800000] dark:text-red-400 ml-1">"</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Dialogue Body with Timestamps, Speaker Badges & Highlighted Keywords */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
          {displayedTurns.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                No speaker turns found matching "{searchQuery}"
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterMatchesOnly(false);
                }}
                className="text-xs font-extrabold text-[#800000] dark:text-red-400 hover:underline cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            displayedTurns.map((turn) => {
              const isMatch = searchQuery.trim().length > 0 && searchMatches.matchingTurnIds.has(turn.id);
              const isRep = turn.speakerRole === 'rep';
              const isProspect = turn.speakerRole === 'prospect';

              return (
                <div
                  key={turn.id}
                  className={`p-3.5 sm:p-4 rounded-xl border text-xs leading-relaxed transition-all ${
                    isMatch
                      ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-slate-900 dark:text-slate-100 shadow-xs scale-[1.005]'
                      : isRep
                      ? 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 pl-4 border-l-4 border-l-[#800000]'
                      : isProspect
                      ? 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 pl-4 border-l-4 border-l-[#A8C66C]'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {/* Speaker Label & Timestamp Header Line */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-2">
                      {isRep ? (
                        <span className="p-1 rounded-md bg-[#800000] text-[#A8C66C]">
                          <Mic className="w-3 h-3" />
                        </span>
                      ) : isProspect ? (
                        <span className="p-1 rounded-md bg-[#A8C66C] text-[#800000]">
                          <User className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="p-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          <Sparkles className="w-3 h-3" />
                        </span>
                      )}

                      <span className={`text-[11px] font-black uppercase tracking-wider ${
                        isRep
                          ? 'text-[#800000] dark:text-red-400'
                          : isProspect
                          ? 'text-emerald-700 dark:text-lime-400'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}>
                        {turn.speakerDisplayName}
                      </span>

                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                        {isRep ? 'Sales Rep' : isProspect ? 'Prospect' : 'Speaker'}
                      </span>
                    </div>

                    {/* Timestamp Tag */}
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{turn.timestamp}</span>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span>Turn #{turn.turnNumber}</span>
                    </div>
                  </div>

                  {/* Utterance Text with Keyword Match Highlighting */}
                  <p className="font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {renderHighlightedText(turn.utteranceText)}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer: Export to Text (.txt) + Copy + Close */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-2">
            {/* Export to Text (.txt) Download Button */}
            <button
              onClick={handleExportToTxt}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#800000] hover:bg-[#600000] text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer"
              title="Download full session transcript with timestamps and speaker labels as a .txt file"
            >
              <Download className="w-4 h-4 text-[#A8C66C]" />
              <span>{exportSuccess ? 'Downloaded .TXT!' : 'Export to Text (.txt)'}</span>
            </button>

            {/* Copy Full Transcript Button */}
            <button
              onClick={handleCopyTranscript}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-all cursor-pointer"
              title="Copy session transcript to clipboard"
            >
              {copySuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-extrabold text-xs transition-all cursor-pointer"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
};
