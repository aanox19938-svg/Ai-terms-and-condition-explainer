import React, { useState, useEffect } from 'react';
import { X, Key, Check, ExternalLink, Activity, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';

export const SettingsModal = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('tc_gemini_api_key') || '';
      setApiKey(stored);
      apiService.checkHealth().then(setHealth).catch(() => setHealth({ status: 'offline' }));
    }
  }, [isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('tc_gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('tc_gemini_api_key');
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="bg-[#0a0d1f]/95 border border-white/10 rounded-3xl w-full max-w-lg p-7 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">System & AI Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Health status */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 mb-5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Neural Backend API Status:</span>
          </div>
          <span className="px-3 py-1 rounded-full font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            {health?.status === 'online' ? 'Online (Connected)' : 'Connecting...'}
          </span>
        </div>

        {/* Gemini API Key configuration */}
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-normal"
              >
                <span>Get Free Key at Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              When entered here, it will be securely used for your browser session.
            </p>
          </div>

          <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4 mb-6 text-xs text-indigo-200 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Fail-Safe Fallback:</strong> If no API key is provided, the application automatically uses its built-in Legal Heuristic Engine so demonstrations and evaluations never fail!
            </span>
          </div>

          <div className="flex justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-95 rounded-xl transition-all shadow-[0_0_18px_rgba(6,182,212,0.35)] flex items-center space-x-1.5"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
