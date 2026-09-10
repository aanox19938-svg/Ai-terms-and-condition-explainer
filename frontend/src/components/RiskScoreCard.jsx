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
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          gauge: 'text-rose-500',
          title: 'Predatory or High-Risk Terms Detected',
          icon: <ShieldAlert className="w-5 h-5 text-rose-600" />
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          gauge: 'text-amber-500',
          title: 'Moderate Clauses Requiring Caution',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />
        };
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          gauge: 'text-emerald-500',
          title: 'Generally Standard & Fair Terms',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        };
    }
  };

  const style = getBadgeStyle();

  const handleDownloadPdf = () => {
    const url = apiService.downloadReportUrl(document.doc_id);
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm mb-8 transition-all">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left: Overall Risk Gauge & Info */}
        <div className="flex items-center space-x-5 w-full lg:w-auto">
          {/* Circular Score Dial */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
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
              <span className="text-2xl font-black text-slate-900">{score}</span>
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
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">{document.file_name}</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{style.title}</p>
          </div>
        </div>

        {/* Center: Stat Badges */}
        <div className="flex items-center space-x-3 w-full lg:w-auto justify-around lg:justify-start">
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="block text-xl font-bold text-rose-600">{highCount}</span>
            <span className="text-[11px] text-slate-500 font-medium">High Risk</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="block text-xl font-bold text-amber-600">{mediumCount}</span>
            <span className="text-[11px] text-slate-500 font-medium">Medium Risk</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="block text-xl font-bold text-emerald-600">{lowCount}</span>
            <span className="text-[11px] text-slate-500 font-medium">Low / Fair</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          <button
            onClick={onToggleOriginal}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
              showOriginal
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-200 shadow-2xs'
            }`}
            title="Toggle between AI Summary and Raw Agreement Text"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>{showOriginal ? 'View AI Analysis' : 'View Original Contract'}</span>
          </button>

          <button
            onClick={onOpenChat}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Q&A Bot</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 transition shadow-2xs"
            title="Download formatted PDF Audit Report"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export Report (PDF)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
