import React, { useState, useEffect } from 'react';
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
import { MessageSquare, ArrowLeft, FileText, Shield } from 'lucide-react';

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
      setModelUsed(res.modelUsed || 'AI Engine');
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onNewDocument={handleNewDocument}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        historyCount={documentsList.length}
        onLogout={() => { apiService.logout(); setCurrentUser(null); }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Legal Disclaimer */}
        <DisclaimerBanner />

        {/* Global Error Banner if any */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-xs underline text-rose-800 font-medium">Dismiss</button>
          </div>
        )}

        {/* Conditional View: Upload Zone vs Analyzed Results */}
        {!currentDocument ? (
          <UploadZone onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        ) : (
          <div>
            {/* Action Bar for Active Document */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handleNewDocument}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium transition"
              >
                <ArrowLeft className="w-4 h-4" />
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
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-bold text-slate-900">Original Contract Text</h3>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {currentDocument.raw_text?.length.toLocaleString()} characters
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-[600px] overflow-y-auto">
                  <pre className="text-xs sm:text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
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
          className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-full shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all hover:scale-105"
          title="Ask Questions about this Document"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs font-bold pr-1 hidden sm:inline">Ask AI Explainer</span>
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

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">AI Terms & Conditions Explainer</span>
          </div>
          <p className="text-slate-600">
            Developed by <span className="text-blue-600 font-bold">Mahesh</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
