import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/index.css';

// Types
interface SOPInfo {
  id: string;
  title: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  filtered?: boolean;
}

const API_BASE_URL = 'http://localhost:8000';

const App: React.FC = () => {
  const [sops, setSOPs] = useState<SOPInfo[]>([]);
  const [selectedSOPId, setSelectedSOPId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch SOPs on mount
  useEffect(() => {
    fetchSOPs();
  }, []);

  const fetchSOPs = async () => {
    try {
      const response = await axios.get<SOPInfo[]>(`${API_BASE_URL}/api/sops`);
      setSOPs(response.data);
    } catch (err) {
      console.error('Error fetching SOPs:', err);
      setError('Failed to load SOPs');
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        question: inputValue,
        sop_id: selectedSOPId,
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
        filtered: response.data.filtered,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or consult your supervisor.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Professional Header */}
      <header className="bg-navy-900 border-b-4 border-safety-blue-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Manufacturing SOP & Safety Assistant
              </h1>
              <p className="text-steel-300 text-sm mt-1 font-medium">
                Educational Explanation System
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-navy-800 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              <span className="text-steel-300 text-xs font-medium">SYSTEM ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Critical Safety Disclaimer Banner */}
      <div className="bg-warning-50 border-y border-warning-400">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-warning-900 uppercase tracking-wide">
                Safety Notice - Explanation Only
              </h3>
              <div className="mt-2 text-sm text-warning-800 space-y-1">
                <p className="font-semibold">This system provides educational explanations only and cannot:</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-warning-600">✗</span>
                    <span>Approve or authorize actions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-warning-600">✗</span>
                    <span>Provide operational guidance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-warning-600">✗</span>
                    <span>Validate safety compliance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-warning-600">✗</span>
                    <span>Replace human supervision</span>
                  </div>
                </div>
                <p className="mt-2 font-bold text-warning-900 bg-warning-100 px-2 py-1 rounded inline-block">
                  ⚠ Always consult authorized personnel before performing work
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="grid grid-cols-1 gap-6">
          
          {/* SOP Selection Card */}
          <div className="bg-white rounded-lg shadow-sm border border-steel-200">
            <div className="px-6 py-4 border-b border-steel-200 bg-steel-50">
              <h2 className="text-sm font-bold text-steel-900 uppercase tracking-wide">
                Document Selection
              </h2>
            </div>
            <div className="p-6">
              <label htmlFor="sop-select" className="block text-sm font-semibold text-steel-700 mb-3">
                Select Standard Operating Procedure (Optional)
              </label>
              <select
                id="sop-select"
                value={selectedSOPId || ''}
                onChange={(e) => setSelectedSOPId(e.target.value || null)}
                disabled={loading}
                className="w-full px-4 py-3 bg-white border-2 border-steel-300 rounded-lg text-steel-900 font-medium focus:outline-none focus:ring-2 focus:ring-safety-blue-500 focus:border-transparent disabled:bg-steel-100 disabled:cursor-not-allowed transition-all"
              >
                  <option value="">General Safety Questions</option>
                {sops.map((sop) => (
                  <option key={sop.id} value={sop.id}>
                    {sop.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chat Interface Card */}
          <div className="bg-white rounded-lg shadow-sm border border-steel-200 flex flex-col" style={{ height: '580px' }}>
            
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-steel-200 bg-gradient-to-r from-navy-900 to-navy-800">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                  Conversation
                </h2>
                <div className="text-xs text-steel-300 font-medium">
                  {messages.length} message{messages.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-safety-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-safety-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-steel-800 mb-2">
                      Ready to Assist
                    </h3>
                    <p className="text-sm text-steel-600 leading-relaxed">
                      Ask questions about manufacturing SOPs, safety procedures, PPE requirements, or emergency protocols.
                    </p>
                    <p className="text-xs text-steel-500 mt-3 italic">
                      Select a document above for context-specific explanations
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl rounded-lg shadow-sm ${
                        message.role === 'user'
                          ? 'bg-safety-blue-500 text-white'
                          : message.filtered
                          ? 'bg-warning-50 border-2 border-warning-400'
                          : 'bg-white border border-steel-200'
                      }`}
                    >
                      <div className="px-5 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {message.role === 'user' ? (
                              <div className="w-9 h-9 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-2 border-white border-opacity-40">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-safety-blue-600 flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between mb-2">
                              <span className={`text-xs font-bold uppercase tracking-wide ${
                                message.role === 'user' ? 'text-white text-opacity-90' : 'text-steel-700'
                              }`}>
                                {message.role === 'user' ? 'You' : 'AI Assistant'}
                              </span>
                              <span className={`text-xs ${
                                message.role === 'user' ? 'text-white text-opacity-70' : 'text-steel-500'
                              }`}>
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                              message.role === 'user' ? 'text-white' : message.filtered ? 'text-warning-900' : 'text-steel-800'
                            }`}>
                              {message.content}
                            </p>
                            {message.filtered && (
                              <div className="mt-3 pt-3 border-t border-warning-300">
                                <p className="text-xs font-semibold text-warning-800 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  Safety filter triggered
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-steel-200 rounded-lg shadow-sm px-5 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-safety-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-safety-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-2 h-2 bg-safety-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                      <span className="text-xs text-steel-600 font-medium">Processing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t-2 border-steel-200 bg-white px-6 py-4">
              {error && (
                <div className="mb-4 p-3 bg-error-50 border-l-4 border-error-500 rounded-r text-error-800 text-sm flex items-start space-x-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              )}
              <div className="flex space-x-3">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about safety procedures, PPE requirements, emergency protocols..."
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-white border-2 border-steel-300 rounded-lg text-steel-900 placeholder-steel-400 focus:outline-none focus:ring-2 focus:ring-safety-blue-500 focus:border-transparent disabled:bg-steel-100 disabled:cursor-not-allowed resize-none transition-all"
                  rows={2}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !inputValue.trim()}
                  className="px-8 py-3 bg-safety-blue-600 text-white rounded-lg font-bold uppercase tracking-wide text-sm hover:bg-safety-blue-700 disabled:bg-steel-300 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md disabled:shadow-none"
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending</span>
                    </span>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
              <p className="text-xs text-steel-500 mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Professional Footer */}
      <footer className="bg-navy-900 border-t-4 border-steel-700 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-steel-400 text-sm font-medium">
                Manufacturing SOP & Safety Assistant
              </p>
              <p className="text-steel-500 text-xs mt-1">
                For Educational and Training Purposes Only
              </p>
            </div>
            <div className="flex items-center space-x-6 text-xs text-steel-400">
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Human supervision required</span>
              </span>
              <span className="hidden md:block">•</span>
              <span className="font-medium">© 2025</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;