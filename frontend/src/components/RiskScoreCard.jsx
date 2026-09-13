import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Download, MessageSquare, FileText } from 'lucide-react';
import { apiService } from '../services/api';
import { TextWave3D } from './TextWave3D';

export const RiskScoreCard = ({ document, summary, clauses, onOpenChat, onToggleOriginal, showOriginal }) => {
  if (!document) return null;

  const score = document.risk_score ?? 50;
  const level = document.risk_level || (score > 70 ? 'High' : score > 40 ? 'Medium' : 'Low');

  const highCount = (clauses || []).filter(c => c.risk_level === 'High').length;
  const mediumCount = (clauses || []).filter(c => c.risk_level === 'Medium').length;
  const lowCount = (clauses || []).filter(c => c.risk_level === 'Low').length;

  const getBadgeStyle = () => {
    switch (level) {
      case 'High':
        return {
          bg: 'bg-rose-500/15 border-rose-500/35 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)]',
          gauge: 'text-rose-500',
          title: 'Predatory or High-Risk Terms Detected',
          icon: <ShieldAlert className="w-5 h-5 text-rose-400" />
        };
      case 'Medium':
        return {
          bg: 'bg-amber-500/15 border-amber-500/35 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
          gauge: 'text-amber-400',
          title: 'Moderate Clauses Requiring Caution',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
        };
      default:
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
          gauge: 'text-emerald-400',
          title: 'Generally Fair & Standard Terms',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        };
    }
  };

  const style = getBadgeStyle();

  const handleDownloadPdf = () => {
    const url = apiService.downloadReportUrl(document.doc_id);
    window.open(url, '_blank');
  };

  return (
    <div className="mb-8 relative">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left: Overall Risk Gauge & Info */}
        <div className="flex items-center space-x-6 w-full lg:w-auto">
          {/* 3D-styled Circular Score Dial with Neon Glow */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl"></div>
            <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" viewBox="0 0 36 36">
              <path
                className="text-slate-800/80"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={style.gauge}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{score}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${style.bg}`}>
                {level} Risk
              </span>
              <span className="text-xs text-slate-400">
                • {new Date(document.upload_date).toLocaleDateString()}
              </span>
            </div>
            <div>
              <TextWave3D text={document.file_name} as="h3" mode="words" waveAmplitude={3} className="text-xl sm:text-2xl font-bold text-white tracking-tight" />
            </div>
            <div>
              <TextWave3D text={style.title} as="p" mode="words" waveAmplitude={2} className="text-xs sm:text-sm text-slate-400 mt-1" />
            </div>
          </div>
        </div>

        {/* Center: Stat Badges */}
        <div className="flex items-center space-x-3.5 w-full lg:w-auto justify-around lg:justify-start">
          <div className="px-5 py-3 rounded-2xl bg-black/40 border border-white/10 text-center backdrop-blur-md">
            <span className="block text-2xl font-black text-rose-400">{highCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">High Risk</span>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-black/40 border border-white/10 text-center backdrop-blur-md">
            <span className="block text-2xl font-black text-amber-400">{mediumCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Medium</span>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-black/40 border border-white/10 text-center backdrop-blur-md">
            <span className="block text-2xl font-black text-emerald-400">{lowCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Low Risk</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          <button
            onClick={onToggleOriginal}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-300 ${
              showOriginal
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border-white/10 hover:border-white/20'
            }`}
            title="Toggle between AI Summary and Raw Agreement Text"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>{showOriginal ? 'View AI Summary' : 'View Original Contract'}</span>
          </button>

          <button
            onClick={onOpenChat}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 text-white transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-[1.02]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Q&A Bot</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
            title="Download formatted PDF Audit Report"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Report (PDF)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
