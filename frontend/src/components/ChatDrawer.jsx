import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, HelpCircle } from 'lucide-react';
import { apiService } from '../services/api';

export const ChatDrawer = ({ isOpen, onClose, document, initialQuestion }) => {
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && document) {
      loadHistory();
      if (initialQuestion) {
        setInputQuestion(initialQuestion);
      }
    }
  }, [isOpen, document, initialQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadHistory = async () => {
    try {
      const history = await apiService.getChatHistory(document.doc_id);
      if (history && history.length > 0) {
        const formatted = [];
        history.forEach(h => {
          formatted.push({ sender: 'user', text: h.question, time: h.timestamp });
          formatted.push({ sender: 'assistant', text: h.answer, time: h.timestamp });
        });
        setMessages(formatted);
      } else {
        setMessages([
          {
            sender: 'assistant',
            text: `Hello! I have analyzed **${document.file_name}**. Ask me any question about your rights, privacy risks, subscription renewal terms, or liability limits in this contract!`,
            time: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.warn('Could not load chat history:', err);
    }
  };

  const handleSend = async (qToSend) => {
    const question = (qToSend || inputQuestion).trim();
    if (!question || isLoading || !document) return;

    const userMsg = { sender: 'user', text: question, time: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await apiService.askQuestion(document.doc_id, question);
      const botMsg = { sender: 'assistant', text: res.answer, time: res.timestamp };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Sorry, I encountered an issue querying the document: ' + (err.response?.data?.error || err.message),
          time: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const quickPrompts = [
    "Can they sell or share my personal data with third parties?",
    "How do I cancel my subscription and avoid auto-renewal?",
    "Who owns the photos and content I upload?",
    "Can I sue them in court or participate in a class action?"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-[#080b1a]/95 border-l border-white/10 backdrop-blur-2xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <div className="w-full h-full bg-[#080b1a] rounded-[11px] flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-tight">AI Document Assistant</h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                  Grounded Q&A
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[260px]">{document?.file_name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 text-white rounded-br-none shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-white/[0.04] border border-white/10 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/[0.04] border border-white/10 text-slate-400 rounded-2xl rounded-bl-none px-4 py-3 text-xs flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></div>
                <span className="ml-1 text-cyan-300 font-mono">Checking contract clauses...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-black/40 border-t border-white/10">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Suggested Inquiries:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                disabled={isLoading}
                onClick={() => handleSend(p)}
                className="text-[11px] text-left px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all shadow-sm"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-white/10 bg-black/50">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask anything about this agreement..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className={`p-2.5 rounded-xl text-white transition-all ${
                !inputQuestion.trim() || isLoading
                  ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-105'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
