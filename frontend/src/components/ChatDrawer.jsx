import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles, HelpCircle, MessageSquare } from 'lucide-react';
import { apiService } from '../services/api';

export const ChatDrawer = ({ isOpen, onClose, document, initialQuestion }) => {
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history when drawer opens for a document
  useEffect(() => {
    if (isOpen && document) {
      loadHistory();
      if (initialQuestion) {
        setInputQuestion(initialQuestion);
      }
    }
  }, [isOpen, document, initialQuestion]);

  // Auto-scroll to bottom of chat
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
            text: `Hello! I have analyzed **${document.file_name}**. Ask me any question about your rights, privacy, subscription terms, or hidden fees in this agreement!`,
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

    // Append user message immediately
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
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">AI Document Assistant</h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold">
                  Grounded Q&A
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[260px]">{document?.file_name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
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
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
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
              <div className="bg-slate-950 border border-slate-800 text-slate-400 rounded-2xl rounded-bl-none px-4 py-3 text-xs flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></div>
                <span className="ml-1">Checking terms...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-cyan-400" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                disabled={isLoading}
                onClick={() => handleSend(p)}
                className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
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
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className={`p-2.5 rounded-xl text-white transition ${
                !inputQuestion.trim() || isLoading
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-600/30'
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
