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
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-lg bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">AI Document Assistant</h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 font-semibold">
                  Grounded Q&A
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[260px]">{document?.file_name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-none px-4 py-3 text-xs flex items-center space-x-2 shadow-2xs">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></div>
                <span className="ml-1">Checking terms...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                disabled={isLoading}
                onClick={() => handleSend(p)}
                className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 transition shadow-2xs"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
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
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className={`p-2.5 rounded-xl text-white transition ${
                !inputQuestion.trim() || isLoading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
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
