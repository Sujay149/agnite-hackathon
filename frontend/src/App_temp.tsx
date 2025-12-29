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
    <div className="min-h-screen bg-white flex flex-col">
      {/* ChatGPT-style Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-gray-800">
              Manufacturing Safety Assistant
            </h1>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Compact Warning Banner */}
      <div className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-3xl mx-auto px-4 py-2">
          <p className="text-xs text-amber-900 text-center">
            <span className="font-semibold">⚠️ Educational use only.</span> Cannot approve actions, provide operational guidance, or replace human supervision.
          </p>
        </div>
      </div>

      {/* Main Content Area - ChatGPT Style */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4">
            
            {/* Document Selector */}
            {sops.length > 0 && (
              <div className="py-4">
                <select
                  value={selectedSOPId || ''}
                  onChange={(e) => setSelectedSOPId(e.target.value || null)}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                >
                  <option value="">General Safety Questions</option>
                  {sops.map((sop) => (
                    <option key={sop.id} value={sop.id}>
                      {sop.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Messages */}
            <div className="py-8 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mb-4">
                    <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    How can I help you today?
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ask about manufacturing SOPs, safety procedures, or emergency protocols
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="group">
                    <div className={`flex gap-4 ${message.role === 'user' ? 'bg-gray-50' : 'bg-white'} px-4 py-6 -mx-4`}>
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {message.role === 'user' ? (
                          <div className="w-8 h-8 rounded-sm bg-gray-700 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-sm bg-green-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 mb-1">
                          {message.role === 'user' ? 'You' : 'Assistant'}
                        </div>
                        <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </div>
                        {message.filtered && (
                          <div className="mt-3 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded border border-amber-200">
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>Safety filter applied</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {loading && (
                <div className="group">
                  <div className="flex gap-4 bg-white px-4 py-6 -mx-4">
                    <div className="w-8 h-8 rounded-sm bg-green-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900 mb-1">Assistant</div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

