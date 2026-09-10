import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, AlertTriangle, CheckCircle2, MessageSquare, Filter, Search, Lightbulb } from 'lucide-react';

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
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>High Risk</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Medium Risk</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Low Risk</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 mb-8 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-bold text-slate-900">Flagged Concerning Clauses ({filteredClauses.length} of {clauses.length})</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Specific terms that impact privacy, billing, dispute rights, or ownership
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search clauses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="py-4 flex flex-wrap items-center gap-2 border-b border-slate-100">
        <div className="flex items-center space-x-1 text-xs text-slate-500 mr-2 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block"></div>

        {/* Risk Level Filter */}
        <div className="flex items-center space-x-1.5 ml-auto">
          {['All', 'High', 'Medium', 'Low'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRisk(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                selectedRisk === r
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
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
              className={`rounded-xl border p-5 transition-all hover:shadow-xs ${
                item.risk_level === 'High'
                  ? 'bg-rose-50/40 border-rose-200'
                  : item.risk_level === 'Medium'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-700 px-2.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs">
                    {item.category || 'General Terms'}
                  </span>
                  {getRiskBadge(item.risk_level)}
                </div>

                <button
                  onClick={() => onAskClause(item)}
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-medium px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200/80 transition shadow-2xs"
                  title="Ask the AI chatbot about this specific clause"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Ask AI About This</span>
                </button>
              </div>

              {/* Original Clause Quote */}
              <div className="relative pl-4 border-l-2 border-slate-400 my-3 bg-white/70 py-2 pr-3 rounded-r-md">
                <p className="text-xs sm:text-sm text-slate-800 italic font-serif leading-relaxed">
                  "{item.clause_text}"
                </p>
              </div>

              {/* Plain-English Explanation */}
              <div className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="font-semibold text-slate-900 block mb-1">Why this is concerning:</span>
                {item.explanation}
              </div>

              {/* Recommendation */}
              {item.recommendation && (
                <div className="mt-2.5 flex items-start space-x-2 text-xs text-blue-900 bg-blue-50 border border-blue-200/80 p-3 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-blue-950">Recommendation: </span>
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
