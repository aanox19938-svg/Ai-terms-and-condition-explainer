import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, AlertTriangle, CheckCircle2, MessageSquare, Filter, Search, Lightbulb } from 'lucide-react';
import { TiltWave3D } from './TiltWave3D';

export const ClauseList = ({ clauses, onAskClause }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!clauses || clauses.length === 0) return null;

  const categories = ['All', ...new Set(clauses.map(c => c.category).filter(Boolean))];

  const filteredClauses = clauses.filter(c => {
    const matchCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchRisk = selectedRisk === 'All' || c.risk_level === selectedRisk;
    const matchSearch = searchQuery.trim() === '' ||
      c.clause_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.explanation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchRisk && matchSearch;
  });

  const getRiskBadge = (level) => {
    switch (level) {
      case 'High':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>High Risk</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Medium Risk</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Low Risk</span>
          </span>
        );
    }
  };

  return (
    <div className="mb-8">
      {/* 3D Wave Floating Header & Filter Bar */}
      <TiltWave3D maxTilt={6} floatAmplitude={4} floatSpeed={1.0} phase={1.4} className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10 translate-z-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.25)]">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Flagged Risky Clauses ({filteredClauses.length} of {clauses.length})</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Clauses impacting privacy, continuous billing, dispute rights, or ownership transfer
            </p>
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Filter clauses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-sm transition-all"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="py-4 flex flex-wrap items-center gap-2 border-b border-white/10 translate-z-4">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mr-2 font-medium">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Category:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="h-4 w-px bg-white/10 mx-2 hidden sm:block"></div>

          {/* Risk Level Filter */}
          <div className="flex items-center space-x-1.5 ml-auto">
            {['All', 'High', 'Medium', 'Low'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRisk(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedRisk === r
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === 'All' ? 'All Severities' : r}
              </button>
            ))}
          </div>
        </div>
      </TiltWave3D>

      {/* 3D Wave Floating Clause Items */}
      <div className="mt-6 space-y-4">
        {filteredClauses.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No clauses match your filter criteria.
          </div>
        ) : (
          filteredClauses.map((item, idx) => (
            <TiltWave3D
              key={item.clause_id || idx}
              maxTilt={5}
              floatAmplitude={3}
              floatSpeed={0.9}
              phase={idx * 0.35}
              className="mb-4"
            >
              <div
                className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 hover:scale-[1.005] preserve-3d ${
                  item.risk_level === 'High'
                    ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.12)]'
                    : item.risk_level === 'Medium'
                    ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.12)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className="flex items-center space-x-2.5 translate-z-6">
                    <span className="text-xs font-bold text-slate-200 px-3 py-1 rounded-lg bg-white/10 border border-white/10">
                      {item.category || 'General Terms'}
                    </span>
                    {getRiskBadge(item.risk_level)}
                  </div>

                  <button
                    onClick={() => onAskClause(item)}
                    className="flex items-center space-x-1.5 text-xs text-cyan-300 hover:text-cyan-200 font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all shadow-sm translate-z-8"
                    title="Ask the AI chatbot about this specific clause"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Ask AI About This</span>
                  </button>
                </div>

                {/* Original Clause Quote */}
                <div className="relative pl-4 border-l-2 border-cyan-400 my-3.5 bg-black/30 p-3.5 rounded-r-xl translate-z-4">
                  <p className="text-xs sm:text-sm text-slate-200 italic font-mono leading-relaxed">
                    "{item.clause_text}"
                  </p>
                </div>

                {/* Plain-English Explanation */}
                <div className="mt-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/10 translate-z-4">
                  <span className="font-bold text-white block mb-1 text-xs uppercase tracking-wider text-cyan-300">Why this matters:</span>
                  {item.explanation}
                </div>

                {/* Recommendation */}
                {item.recommendation && (
                  <div className="mt-3 flex items-start space-x-2.5 text-xs text-cyan-200 bg-cyan-950/30 border border-cyan-500/30 p-3.5 rounded-xl translate-z-6">
                    <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-cyan-300">Recommendation: </span>
                      {item.recommendation}
                    </div>
                  </div>
                )}
              </div>
            </TiltWave3D>
          ))
        )}
      </div>
    </div>
  );
};
