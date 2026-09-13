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
    <div className="mb-8">
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/10">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Executive Plain-Language Summary</h3>
            <p className="text-xs text-slate-400">Translated from dense legal language into plain everyday consumer terms</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] text-slate-300 text-xs border border-white/10 font-medium">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{modelUsed || '3D Neural Engine'}</span>
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all shadow-sm"
            title="Copy summary text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main summary text */}
      <div className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6 font-normal">
        {summary.summary_text}
      </div>

      {/* Bulleted Key Takeaways */}
      {summary.key_takeaways && summary.key_takeaways.length > 0 && (
        <div className="bg-black/35 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>Key User Rights & Obligations</span>
          </h4>
          <ul className="space-y-3">
            {summary.key_takeaways.map((point, index) => (
              <li key={index} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
