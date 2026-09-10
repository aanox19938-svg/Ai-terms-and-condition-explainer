import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Download, MessageSquare, FileText } from 'lucide-react';
import { apiService } from '../services/api';

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
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          gauge: 'text-rose-500',
          border: 'border-rose-500/20',
          title: 'Predatory or High-Risk Terms Detected',
          icon: <ShieldAlert className="w-6 h-6 text-rose-400" />
        };
      case 'Medium':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          gauge: 'text-amber-500',
          border: 'border-amber-500/20',
          title: 'Moderate Clauses Requiring Caution',
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />
        };
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          gauge: 'text-emerald-500',
          border: 'border-emerald-500/20',
          title: 'Generally Standard & Fair Terms',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        };
    }
  };

  const style = getBadgeStyle();

  const handleDownloadPdf = () => {
    const url = apiService.downloadReportUrl(document.doc_id);
    window.open(url, '_blank');
  };

  return (
    <div className={`bg-slate-900 border rounded-2xl p-6 shadow-xl mb-8 transition-all ${style.border}`}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left: Overall Risk Gauge & Info */}
        <div className="flex items-center space-x-5 w-full lg:w-auto">
          {/* Circular Score Dial */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={style.gauge}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white">{score}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${style.bg}`}>
                {level} Risk
              </span>
              <span className="text-xs text-slate-400">
                • {new Date(document.upload_date).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">{document.file_name}</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{style.title}</p>
          </div>
        </div>

        {/* Center: Stat Badges */}
        <div className="flex items-center space-x-3 w-full lg:w-auto justify-around lg:justify-start">
          <div className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="block text-xl font-bold text-rose-400">{highCount}</span>
            <span className="text-[11px] text-slate-400">High Risk</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="block text-xl font-bold text-amber-400">{mediumCount}</span>
            <span className="text-[11px] text-slate-400">Medium Risk</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="block text-xl font-bold text-emerald-400">{lowCount}</span>
            <span className="text-[11px] text-slate-400">Low / Fair</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          <button
            onClick={onToggleOriginal}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
              showOriginal
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Toggle between AI Summary and Raw Agreement Text"
          >
            <FileText className="w-4 h-4" />
            <span>{showOriginal ? 'View AI Analysis' : 'View Original Contract'}</span>
          </button>

          <button
            onClick={onOpenChat}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-md shadow-cyan-600/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Q&A Bot</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition"
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
