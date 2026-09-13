import React, { useState, useRef } from 'react';
import { Upload, Type, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { sampleTerms } from '../data/sampleTerms';

export const UploadZone = ({ onAnalyze, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState('upload');
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
    <div className="glass-card rounded-3xl p-7 sm:p-11 relative overflow-hidden">
      {/* Background ambient lighting orbs */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Neural Legal Analysis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-indigo-200 bg-clip-text text-transparent glow-text-cyan">
            Deconstruct & Understand Contracts
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Upload any contract, privacy policy, or End User License Agreement. Our neural engine translates dense legalese into plain English and flags hidden liabilities.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 mb-7 max-w-md mx-auto backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
              activeTab === 'paste'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Paste Raw Text</span>
          </button>
        </div>

        {/* Document Title input */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-2 tracking-wide">
            Document Title (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Netflix Subscription Terms, Instagram Privacy Policy..."
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="w-full bg-black/35 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-md transition-all"
          />
        </div>

        {/* Upload Mode */}
        {activeTab === 'upload' ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
              dragOver
                ? 'border-cyan-400 bg-cyan-500/[0.08] scale-[1.01] shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                : file
                ? 'border-emerald-500/60 bg-emerald-500/[0.06] shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                : 'border-white/15 hover:border-cyan-400/60 bg-white/[0.02] hover:bg-cyan-500/[0.04] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]'
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
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3.5 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-base font-bold text-white">{file.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB • Ready for 3D Neural Audit</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="mt-3.5 text-xs text-rose-400 hover:text-rose-300 hover:underline font-semibold"
                >
                  Choose Different File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_25px_rgba(6,182,212,0.25)] group-hover:scale-105 transition-transform duration-300">
                  <Upload className="w-8 h-8 animate-bounce [animation-duration:2.5s]" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Drop your legal agreement here, or <span className="text-cyan-400 underline">browse</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1.5">
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
              className="w-full bg-black/35 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20 font-mono transition-all resize-y"
            />
            <div className="flex justify-between text-xs text-slate-400 px-1">
              <span>Supports contracts of any length</span>
              <span className="font-mono">{rawText.length.toLocaleString()} characters</span>
            </div>
          </div>
        )}

        {/* Preset Sample Quick Loader */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Or test immediately with pre-configured agreement templates:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sampleTerms.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className="text-left p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-cyan-500/40 transition-all duration-300 flex items-center justify-between group shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition flex items-center gap-2">
                    {sample.title}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-normal">
                      {sample.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{sample.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-2" />
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
            className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-300 ${
              isAnalyzing
                ? 'bg-indigo-900/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-[1.02]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing Clauses with 3D Neural Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-200 animate-pulse" />
                <span>Explain & Audit Terms</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
