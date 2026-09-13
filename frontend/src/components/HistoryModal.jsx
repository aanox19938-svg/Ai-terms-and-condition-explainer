import React from 'react';
import { X, FileText, Trash2, Clock } from 'lucide-react';

export const HistoryModal = ({ isOpen, onClose, documents, onSelectDocument, onDeleteDocument }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="bg-[#0a0d1f]/95 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Saved Audits & Document History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {(!documents || documents.length === 0) ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No saved document analyses found. Upload or paste a contract to create one!
            </div>
          ) : (
            documents.map((doc) => {
              const score = doc.risk_score ?? 50;
              const level = doc.risk_level || (score > 70 ? 'High' : score > 40 ? 'Medium' : 'Low');
              
              return (
                <div
                  key={doc.doc_id}
                  className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-cyan-500/40 transition-all duration-300 flex items-center justify-between gap-4 group shadow-sm"
                >
                  <div
                    onClick={() => { onSelectDocument(doc.doc_id); onClose(); }}
                    className="flex items-center space-x-3.5 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition truncate">
                        {doc.file_name}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                        <span>{new Date(doc.upload_date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="uppercase text-[10px] font-mono">{doc.file_type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      level === 'High'
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                        : level === 'Medium'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    }`}>
                      {score} / 100 ({level})
                    </span>

                    <button
                      onClick={() => onDeleteDocument(doc.doc_id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all"
                      title="Delete saved document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
