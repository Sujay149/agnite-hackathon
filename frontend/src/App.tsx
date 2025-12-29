import React, { useState, useEffect } from 'react';

interface Message {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  filtered?: boolean;
}

interface SOP {
  id: string;
  title: string;
  content: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sops, setSops] = useState<SOP[]>([]);
  const [selectedSOPId, setSelectedSOPId] = useState<string | null>(null);

  useEffect(() => {
    fetchSOPs();
  }, []);

  const fetchSOPs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/sops');
      if (!response.ok) throw new Error('Failed to fetch SOPs');
      const data = await response.json();
      setSops(data);
    } catch (err) {
      console.error('Error fetching SOPs:', err);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    setError(null);

    try {
      const selectedSOP = sops.find((sop) => sop.id === selectedSOPId);
      
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          sop_id: selectedSOPId,
          sop_context: selectedSOP
            ? `${selectedSOP.title}: ${selectedSOP.content}`
            : null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: Date.now() + 1,
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
        filtered: data.filtered || false
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
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
    <div className="min-h-screen bg-gray-900 flex flex-col">
      
      {/* ChatGPT-Style Header - Dark */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 className="text-lg font-semibold text-white">
              Manufacturing Safety Assistant
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">Online</span>
          </div>
        </div>
      </header>

      {/* Compact Warning Banner - Dark */}
      <div className="bg-amber-900 bg-opacity-30 border-b border-amber-800">
        <div className="max-w-3xl mx-auto px-4 py-2">
          <p className="text-xs text-amber-300 text-center font-medium">
            
          </p>
        </div>
      </div>

      {/* Main Content Area - ChatGPT Dark Style */}
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
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 hover:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
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
                    <svg className="w-12 h-12 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-200 mb-2">
                    How can I help you today?
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ask about manufacturing SOPs, safety procedures, or emergency protocols
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="group">
                    <div className={`flex gap-4 ${message.role === 'user' ? 'bg-gray-800' : 'bg-gray-750'} px-4 py-6 -mx-4`}>
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {message.role === 'user' ? (
                          <div className="w-8 h-8 rounded-sm bg-gray-600 flex items-center justify-center">
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
                        <div className="text-sm font-semibold text-gray-200 mb-1">
                          {message.role === 'user' ? 'You' : 'Assistant'}
                        </div>
                        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </div>
                        {message.filtered && (
                          <div className="mt-3 flex items-start gap-2 text-xs text-amber-400 bg-amber-900 bg-opacity-20 px-3 py-2 rounded border border-amber-800">
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
                  <div className="flex gap-4 bg-gray-750 px-4 py-6 -mx-4">
                    <div className="w-8 h-8 rounded-sm bg-green-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-200 mb-1">Assistant</div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Input Area - Fixed at bottom */}
        <div className="border-t border-gray-700 bg-gray-800">
          <div className="max-w-3xl mx-auto px-4 py-4">
            {error && (
              <div className="mb-3 px-4 py-2 bg-red-900 bg-opacity-30 border border-red-800 rounded-lg text-sm text-red-300 flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message Safety Assistant..."
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-800 disabled:cursor-not-allowed resize-none transition-colors"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '200px' }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={loading || !inputValue.trim()}
                className="px-4 py-3 bg-white text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm disabled:shadow-none"
                style={{ minHeight: '44px' }}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              ⚠️ Educational purposes only • Human supervision required


            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
