import React, { useState, useRef } from 'react';
import { Upload, FileText, Type, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { sampleTerms } from '../data/sampleTerms';

export const UploadZone = ({ onAnalyze, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      alert('Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    setFile(selectedFile);
    if (!documentTitle) {
      setDocumentTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleLoadSample = (sample) => {
    setActiveTab('paste');
    setRawText(sample.text);
    setDocumentTitle(sample.title);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'upload') {
      if (!file) {
        alert('Please select a PDF or DOCX file first.');
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_name', documentTitle || file.name);
      onAnalyze(formData, true);
    } else {
      if (!rawText || rawText.trim().length < 30) {
        alert('Please paste at least 30 characters of document text.');
        return;
      }
      onAnalyze({
        raw_text: rawText,
        file_name: documentTitle || 'Pasted Terms & Conditions'
      }, false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Legal Document Audit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Understand What You're Agreeing To
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Upload any contract, privacy policy, or Terms of Service. Our AI translates legal jargon into plain English and flags hidden clauses and risks.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 mb-6 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document (PDF/DOCX)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'paste'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Paste Raw Text</span>
          </button>
        </div>

        {/* Document Title input */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Document Name (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Netflix Subscription Terms, Instagram Privacy Policy..."
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
          />
        </div>

        {/* Upload Mode */}
        {activeTab === 'upload' ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-indigo-500 bg-indigo-950/20 scale-[1.01]'
                : file
                ? 'border-emerald-500/50 bg-emerald-950/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFileSelected(e.target.files[0])}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-semibold text-white">{file.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB • Ready for AI Audit</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="mt-3 text-xs text-rose-400 hover:underline"
                >
                  Change File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-base font-semibold text-white">
                  Drop your contract here, or <span className="text-indigo-400 underline">browse</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF (.pdf), Microsoft Word (.docx), and Plain Text (.txt) up to 15MB
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Paste Mode */
          <div className="space-y-2">
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste the Terms of Service, Privacy Policy, or End User License Agreement text here..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-mono transition resize-y"
            />
            <div className="flex justify-between text-xs text-slate-500 px-1">
              <span>Supports agreements of any length</span>
              <span>{rawText.length.toLocaleString()} characters</span>
            </div>
          </div>
        )}

        {/* Preset Sample Quick Loader (Great for live presentations!) */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
            <span>Or test immediately with pre-loaded agreement samples:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sampleTerms.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className="text-left p-3 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 hover:border-slate-700 transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition flex items-center gap-2">
                    {sample.title}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                      {sample.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{sample.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            disabled={isAnalyzing}
            onClick={handleSubmit}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 text-white shadow-lg transition-all ${
              isAnalyzing
                ? 'bg-indigo-700/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
            }`}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Parsing & Analyzing with Gemini LLM...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Explain & Audit Terms</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
