import React from 'react';
import { ShieldAlert, History, Settings, User, PlusCircle, Sparkles } from 'lucide-react';

export const Navbar = ({ onNewDocument, onOpenHistory, onOpenSettings, onOpenAuth, currentUser, historyCount, onLogout }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#060814]/80 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3.5 cursor-pointer group" onClick={onNewDocument}>
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-600 p-[1px] shadow-[0_0_20px_rgba(56,189,248,0.35)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300">
            <div className="w-full h-full bg-[#080b1a] rounded-[11px] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                AI Terms Explainer
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 flex items-center gap-1 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                3D Neural
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Automated Legal Risk Flagging & Plain-English Explainer</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onNewDocument}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 transition-all shadow-sm group"
            title="Analyze new document"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden md:inline">New Analysis</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-indigo-500/40 transition-all shadow-sm"
            title="View saved analyses"
          >
            <History className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Saved Audits</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all shadow-sm"
            title="Configure API Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-sm">
                <div className="w-full h-full bg-[#080b1a] rounded-full flex items-center justify-center text-xs font-bold text-cyan-300">
                  {currentUser.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-xs text-slate-400 hover:text-rose-400 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:scale-[1.02]"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
