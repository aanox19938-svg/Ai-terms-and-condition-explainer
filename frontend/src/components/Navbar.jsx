import React from 'react';
import { ShieldAlert, History, Settings, User, PlusCircle, Sparkles } from 'lucide-react';

export const Navbar = ({ onNewDocument, onOpenHistory, onOpenSettings, onOpenAuth, currentUser, historyCount, onLogout }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewDocument}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">AI Terms & Conditions Explainer</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                AI Assistant
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Plain-English Legal Contract & Privacy Audit</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onNewDocument}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all shadow-2xs"
            title="Analyze new document"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span className="hidden md:inline">New Document</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all shadow-2xs"
            title="View saved analyses"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span className="hidden md:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-blue-600 text-white">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all shadow-2xs"
            title="Configure API Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-semibold text-blue-700">
                {currentUser.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button
                onClick={onLogout}
                className="text-xs text-slate-500 hover:text-rose-600 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm"
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
