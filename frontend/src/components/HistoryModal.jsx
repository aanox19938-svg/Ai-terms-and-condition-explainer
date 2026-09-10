import React from 'react';
import { X, FileText, Trash2, Clock } from 'lucide-react';

export const HistoryModal = ({ isOpen, onClose, documents, onSelectDocument, onDeleteDocument }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Saved Audits & Document History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/40">
          {(!documents || documents.length === 0) ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No saved document analyses found. Upload or paste a contract to create one!
            </div>
          ) : (
            documents.map((doc) => {
              const score = doc.risk_score ?? 50;
              const level = doc.risk_level || (score > 70 ? 'High' : score > 40 ? 'Medium' : 'Low');
              
              return (
                <div
                  key={doc.doc_id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition flex items-center justify-between gap-4 group"
                >
                  <div
                    onClick={() => { onSelectDocument(doc.doc_id); onClose(); }}
                    className="flex items-center space-x-3.5 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition truncate">
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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      level === 'High'
                        ? 'bg-rose-100 border-rose-200 text-rose-800'
                        : level === 'Medium'
                        ? 'bg-amber-100 border-amber-200 text-amber-800'
                        : 'bg-emerald-100 border-emerald-200 text-emerald-800'
                    }`}>
                      {score} / 100 ({level})
                    </span>

                    <button
                      onClick={() => onDeleteDocument(doc.doc_id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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
