import React, { useState, useEffect } from 'react';
import { X, Key, Check, ExternalLink, Activity, Sparkles, ShieldCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">System & AI Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Health status */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 mb-5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Backend API Status:</span>
          </div>
          <span className="px-2 py-0.5 rounded-full font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {health?.status === 'online' ? 'Online (Port 5001)' : 'Connecting...'}
          </span>
        </div>

        {/* Gemini API Key configuration */}
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-normal"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              You can also store this directly in <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">backend/.env</code>. When entered here, it will be securely used for your browser session.
            </p>
          </div>

          <div className="bg-indigo-950/20 border border-indigo-800/40 rounded-xl p-3.5 mb-5 text-xs text-indigo-300 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Fail-Safe Demo Mode:</strong> If no API key is provided, the application automatically uses its built-in Legal Heuristic Engine so your presentation and testing will never crash!
            </span>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-cyan-600/30"
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
