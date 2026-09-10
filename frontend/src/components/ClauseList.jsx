import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, AlertTriangle, CheckCircle2, MessageSquare, Filter, Search, Quote, Lightbulb } from 'lucide-react';

export const ClauseList = ({ clauses, onAskClause }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!clauses || clauses.length === 0) return null;

  // Extract unique categories
  const categories = ['All', ...new Set(clauses.map(c => c.category).filter(Boolean))];

  // Filter clauses
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
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-3 h-3" />
            <span>High Risk</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>Medium Risk</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Low Risk</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white">Flagged Concerning Clauses ({filteredClauses.length} of {clauses.length})</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Specific terms that impact privacy, billing, dispute rights, or ownership
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search clauses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="py-4 flex flex-wrap items-center gap-2 border-b border-slate-800/60">
        <div className="flex items-center space-x-1 text-xs text-slate-400 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-800 mx-2 hidden sm:block"></div>

        {/* Risk Level Filter */}
        <div className="flex items-center space-x-1.5 ml-auto">
          {['All', 'High', 'Medium', 'Low'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRisk(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                selectedRisk === r
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {r === 'All' ? 'All Severities' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Clause Cards Grid */}
      <div className="mt-5 space-y-4">
        {filteredClauses.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            No clauses match your filter criteria.
          </div>
        ) : (
          filteredClauses.map((item, idx) => (
            <div
              key={item.clause_id || idx}
              className={`rounded-xl border p-5 transition-all hover:border-slate-700 ${
                item.risk_level === 'High'
                  ? 'bg-rose-950/10 border-rose-900/30'
                  : item.risk_level === 'Medium'
                  ? 'bg-amber-950/10 border-amber-900/30'
                  : 'bg-slate-950/40 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-300 px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700">
                    {item.category || 'General Terms'}
                  </span>
                  {getRiskBadge(item.risk_level)}
                </div>

                <button
                  onClick={() => onAskClause(item)}
                  className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 rounded-lg hover:bg-cyan-950/30 transition"
                  title="Ask the AI chatbot about this specific clause"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask AI About This</span>
                </button>
              </div>

              {/* Original Clause Quote */}
              <div className="relative pl-4 border-l-2 border-slate-700 my-3">
                <p className="text-xs sm:text-sm text-slate-300 italic font-mono leading-relaxed">
                  "{item.clause_text}"
                </p>
              </div>

              {/* Plain-English Explanation */}
              <div className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                <span className="font-semibold text-white block mb-1">Why this is concerning:</span>
                {item.explanation}
              </div>

              {/* Recommendation */}
              {item.recommendation && (
                <div className="mt-2.5 flex items-start space-x-2 text-xs text-cyan-300/90 bg-cyan-950/20 border border-cyan-900/30 p-2.5 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-cyan-200">Recommendation: </span>
                    {item.recommendation}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
