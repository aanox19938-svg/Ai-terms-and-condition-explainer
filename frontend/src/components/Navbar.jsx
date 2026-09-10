import React from 'react';
import { ShieldAlert, History, Settings, User, PlusCircle, Sparkles } from 'lucide-react';

export const Navbar = ({ onNewDocument, onOpenHistory, onOpenSettings, onOpenAuth, currentUser, historyCount, onLogout }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewDocument}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">AI Terms & Conditions Explainer</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Gemini LLM
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Automated Legal Risk Flagging & Plain-English Summarizer</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onNewDocument}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-all"
            title="Analyze new document"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">New Document</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-all"
            title="View saved analyses"
          >
            <History className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-all"
            title="Configure API Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-semibold text-indigo-300">
                {currentUser.full_name?.charAt(0).toUpperCase() || 'U'}
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
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
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
