import React, { useState } from 'react';
import { BookOpen, CheckCircle, Sparkles, Copy, Check } from 'lucide-react';

export const SummarySection = ({ summary, modelUsed }) => {
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.summary_text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 mb-8 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Executive Plain-Language Summary</h3>
            <p className="text-xs text-slate-500">Translated from dense legal language into plain everyday terms</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] border border-slate-200 font-medium">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>{modelUsed || 'AI Engine'}</span>
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition shadow-2xs"
            title="Copy summary text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main summary paragraphs */}
      <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6 font-normal">
        {summary.summary_text}
      </div>

      {/* Bulleted Key Takeaways */}
      {summary.key_takeaways && summary.key_takeaways.length > 0 && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3.5 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Key User Takeaways & Rights</span>
          </h4>
          <ul className="space-y-3">
            {summary.key_takeaways.map((point, index) => (
              <li key={index} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-800">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
