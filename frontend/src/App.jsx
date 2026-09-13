import React, { useState, useEffect } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Navbar } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { UploadZone } from './components/UploadZone';
import { RiskScoreCard } from './components/RiskScoreCard';
import { SummarySection } from './components/SummarySection';
import { ClauseList } from './components/ClauseList';
import { ChatDrawer } from './components/ChatDrawer';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { apiService } from './services/api';
import { MessageSquare, ArrowLeft, FileText, Shield, Sparkles } from 'lucide-react';

export function App() {
  const [currentDocument, setCurrentDocument] = useState(null);
  const [summary, setSummary] = useState(null);
  const [clauses, setClauses] = useState([]);
  const [modelUsed, setModelUsed] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [error, setError] = useState('');

  // Modals & Drawers
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [documentsList, setDocumentsList] = useState([]);

  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    loadDocumentsList();
  }, []);

  const loadDocumentsList = async () => {
    try {
      const docs = await apiService.getDocuments();
      setDocumentsList(docs || []);
    } catch (err) {
      console.warn('Could not fetch documents list:', err);
    }
  };

  const handleAnalyze = async (data, isFormData) => {
    setIsAnalyzing(true);
    setError('');
    try {
      const res = await apiService.uploadDocument(data, isFormData);
      setCurrentDocument(res.document);
      setSummary(res.summary);
      setClauses(res.clauses || []);
      setModelUsed(res.modelUsed || '3D Neural Engine');
      setShowOriginal(false);
      loadDocumentsList();
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to analyze document.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectDocument = async (id) => {
    try {
      const res = await apiService.getDocumentDetails(id);
      setCurrentDocument(res.document);
      setSummary(res.summary);
      setClauses(res.clauses || []);
      setShowOriginal(false);
    } catch (err) {
      setError('Could not load selected document: ' + err.message);
    }
  };

  const handleDeleteDocument = async (id) => {
    try {
      await apiService.deleteDocument(id);
      if (currentDocument?.doc_id === id) {
        setCurrentDocument(null);
        setSummary(null);
        setClauses([]);
      }
      loadDocumentsList();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleAskClause = (clause) => {
    setInitialChatPrompt(`Can you explain why this clause is concerning and what I should watch out for: "${clause.clause_text}"`);
    setIsChatOpen(true);
  };

  const handleNewDocument = () => {
    setCurrentDocument(null);
    setSummary(null);
    setClauses([]);
    setShowOriginal(false);
    setError('');
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#060814] text-slate-100 selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      
      {/* Ambient background glow gradient mesh (subtle) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/10 via-indigo-600/10 to-fuchsia-600/10 rounded-full blur-[140px] opacity-25"></div>
      </div>

      {/* Interactive 3D Canvas Background */}
      <ThreeCanvas />

      {/* Top Navbar */}
      <div className="relative z-20">
        <Navbar
          onNewDocument={handleNewDocument}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          currentUser={currentUser}
          historyCount={documentsList.length}
          onLogout={() => { apiService.logout(); setCurrentUser(null); }}
        />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Legal Disclaimer */}
        <DisclaimerBanner />

        {/* Global Error Banner */}
        {error && (
          <div className="bg-rose-500/15 border border-rose-500/35 text-rose-300 p-4 rounded-2xl text-sm mb-6 flex items-center justify-between shadow-[0_0_20px_rgba(244,63,94,0.15)]">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-xs underline text-rose-400 font-semibold">Dismiss</button>
          </div>
        )}

        {/* Conditional View: Upload Zone vs Analyzed Results */}
        {!currentDocument ? (
          <UploadZone onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        ) : (
          <div>
            {/* Action Bar for Active Document */}
            <div className="mb-5 flex items-center justify-between">
              <button
                onClick={handleNewDocument}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3.5 py-1.5 rounded-xl border border-white/10 transition-all shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
                <span>Upload Another Agreement</span>
              </button>
            </div>

            {/* Risk Gauge & Quick Stats */}
            <RiskScoreCard
              document={currentDocument}
              summary={summary}
              clauses={clauses}
              onOpenChat={() => { setInitialChatPrompt(''); setIsChatOpen(true); }}
              onToggleOriginal={() => setShowOriginal(!showOriginal)}
              showOriginal={showOriginal}
            />

            {/* View Mode 1: Original Raw Contract Text */}
            {showOriginal ? (
              <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">Original Contract Text</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentDocument.raw_text?.length.toLocaleString()} characters
                  </span>
                </div>
                <div className="bg-black/45 p-5 rounded-2xl border border-white/10 max-h-[600px] overflow-y-auto">
                  <pre className="text-xs sm:text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {currentDocument.raw_text}
                  </pre>
                </div>
              </div>
            ) : (
              /* View Mode 2: Plain-English Summary & Flagged Clauses */
              <>
                <SummarySection summary={summary} modelUsed={modelUsed} />
                <ClauseList clauses={clauses} onAskClause={handleAskClause} />
              </>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button for Chat if a document is loaded */}
      {currentDocument && !isChatOpen && (
        <button
          onClick={() => { setInitialChatPrompt(''); setIsChatOpen(true); }}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white p-4 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center space-x-2.5 transition-all duration-300 hover:scale-105"
          title="Ask Questions about this Document"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs font-bold pr-1 hidden sm:inline">Ask 3D AI Explainer</span>
        </button>
      )}

      {/* Slide-over Q&A Chatbot Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        document={currentDocument}
        initialQuestion={initialChatPrompt}
      />

      {/* Saved Documents History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        documents={documentsList}
        onSelectDocument={handleSelectDocument}
        onDeleteDocument={handleDeleteDocument}
      />

      {/* Settings Modal (Gemini API Key) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => { setCurrentUser(user); loadDocumentsList(); }}
      />

      {/* Aesthetic Footer with Mahesh Singh Attribution */}
      <footer className="relative z-10 border-t border-white/10 bg-[#060814]/85 backdrop-blur-xl py-7 mt-16 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px]">
              <div className="w-full h-full bg-[#080b1a] rounded-[7px] flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <span className="font-bold text-slate-200 tracking-tight">AI Terms & Conditions Explainer</span>
          </div>

          <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/10 px-4 py-1.5 rounded-full shadow-sm">
            <span className="text-slate-400">Designed and Developed by</span>
            <span className="font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent glow-text-cyan tracking-wide">
              Mahesh Singh
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
