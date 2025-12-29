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
    <div className="min-h-screen bg-industrial-50">
      {/* Header */}
      <header className="bg-industrial-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">🏭 Manufacturing SOP & Safety Explainer Bot</h1>
          <p className="text-industrial-200 mt-2">AI-powered safety procedure explanation system</p>
        </div>
      </header>

      {/* Safety Disclaimer Banner */}
      <div className="bg-safety-yellow bg-opacity-10 border-l-4 border-safety-yellow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-safety-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-industrial-800">
                ⚠️ Important Safety Notice
              </h3>
              <div className="mt-2 text-sm text-industrial-700 space-y-1">
                <p className="font-medium">This bot provides EXPLANATIONS ONLY. It cannot:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Approve or authorize any actions</li>
                  <li>Provide real-time operational guidance</li>
                  <li>Validate safety or compliance</li>
                  <li>Replace supervisors or safety officers</li>
                </ul>
                <p className="mt-2 font-semibold">
                  Always consult authorized personnel before performing any work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* SOP Selector */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <label htmlFor="sop-select" className="block text-sm font-medium text-industrial-700 mb-2">
              Select SOP (Optional)
            </label>
            <select
              id="sop-select"
              value={selectedSOPId || ''}
              onChange={(e) => setSelectedSOPId(e.target.value || null)}
              disabled={loading}
              className="w-full px-4 py-2 border border-industrial-300 rounded-lg focus:ring-2 focus:ring-safety-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">General Safety Questions</option>
              {sops.map((sop) => (
                <option key={sop.id} value={sop.id}>
                  {sop.title}
                </option>
              ))}
            </select>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-lg shadow-md flex flex-col" style={{ height: '600px' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-industrial-400 mt-12">
                  <p className="text-lg">Ask me anything about manufacturing SOPs and safety procedures!</p>
                  <p className="text-sm mt-2">Select an SOP above for context-specific explanations.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-safety-blue text-white'
                          : message.filtered
                          ? 'bg-safety-yellow bg-opacity-20 border-2 border-safety-yellow'
                          : 'bg-industrial-100 text-industrial-900'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {message.role === 'user' ? (
                            <div className="w-8 h-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                              <span className="text-sm font-bold">👤</span>
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-industrial-600 flex items-center justify-center">
                              <span className="text-sm">🤖</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs mt-2 opacity-75">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-industrial-100 rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-industrial-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-industrial-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-industrial-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-industrial-200 p-4">
              {error && (
                <div className="mb-3 p-3 bg-safety-red bg-opacity-10 border border-safety-red rounded-lg text-safety-red text-sm">
                  {error}
                </div>
              )}
              <div className="flex space-x-3">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about SOPs, safety procedures, PPE, emergency protocols..."
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-industrial-300 rounded-lg focus:ring-2 focus:ring-safety-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                  rows={3}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !inputValue.trim()}
                  className="px-6 py-2 bg-safety-blue text-white rounded-lg hover:bg-blue-600 disabled:bg-industrial-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
              <p className="text-xs text-industrial-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-industrial-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-industrial-300 text-sm">
            © 2025 Manufacturing SOP & Safety Explainer Bot | For Educational Use Only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;