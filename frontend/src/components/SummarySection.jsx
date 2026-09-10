import React from 'react';
import { BookOpen, CheckCircle, Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const SummarySection = ({ summary, modelUsed }) => {
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.summary_text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Executive Plain-Language Summary</h3>
            <p className="text-xs text-slate-400">Translated from dense legal language into plain everyday terms</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{modelUsed || 'Gemini 1.5 Flash'}</span>
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Copy summary text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main summary paragraphs */}
      <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6 font-normal">
        {summary.summary_text}
      </div>

      {/* Bulleted Key Takeaways */}
      {summary.key_takeaways && summary.key_takeaways.length > 0 && (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 sm:p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>Key User Takeaways & Rights</span>
          </h4>
          <ul className="space-y-2.5">
            {summary.key_takeaways.map((point, index) => (
              <li key={index} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
