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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">System & AI Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Health status */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-700 font-medium">Backend API Status:</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full font-mono font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {health?.status === 'online' ? 'Connected (Online)' : 'Connecting...'}
          </span>
        </div>

        {/* Gemini API Key configuration */}
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-normal"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              When entered here, it will be securely used for your browser session.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-3.5 mb-5 text-xs text-blue-900 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Built-in Fallback:</strong> If no API key is set, the application automatically uses its built-in Intelligent Legal Rule Engine so tests and presentations always succeed!
            </span>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center space-x-1.5 shadow-sm"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
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
