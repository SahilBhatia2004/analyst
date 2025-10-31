import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileCheck, ChevronDown, ChevronUp, Trash2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../../config/supabase';
import { useNavigate } from 'react-router-dom';

const Chatbot = ({ uploadedFiles, onVisualizationGenerated, colorTheme, onDeleteFile, loadingFiles, userId, currentChatId, onChatIdChange, messages, onMessagesChange, dashboardData, currentDashboardId }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-select all files when uploadedFiles changes
    setSelectedFiles(uploadedFiles.map(f => f.path));
  }, [uploadedFiles]);

  useEffect(() => {
    // Fetch subscription info when userId changes
    const fetchSubscription = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/subscription/get/`,
            { params: { user_id: userId } }
          );
          setSubscription(response.data.subscription);
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      }
    };
    
    fetchSubscription();
  }, [userId]);


  const saveChatHistory = async () => {
    if (!userId) return;
    
    try {
      const chatJson = JSON.stringify({
        messages: messages,
        dashboardData: dashboardData,
        theme: colorTheme,
        dashboardId: currentDashboardId,
        timestamp: new Date().toISOString(),
      });

      let fileName;
      let uploadPath;

      if (currentChatId) {
        // Update existing chat
        uploadPath = currentChatId;
        // Delete the old version first
        await supabase.storage.from('files').remove([currentChatId]);
      } else {
        // Create new chat
        fileName = `chat_${Date.now()}.json`;
        uploadPath = `chats/${userId}/${fileName}`;
      }

      const blob = new Blob([chatJson], { type: 'application/json' });

      // Upload chat history
      await supabase.storage
        .from('files')
        .upload(uploadPath, blob);

      // Update current chat ID if it was a new chat
      if (!currentChatId && onChatIdChange) {
        onChatIdChange(uploadPath);
      }

      console.log('Chat history saved successfully');
      
      // Trigger refresh of chat history
      window.dispatchEvent(new Event('chatSaved'));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const toggleFileSelection = (filePath) => {
    setSelectedFiles(prev => 
      prev.includes(filePath)
        ? prev.filter(f => f !== filePath)
        : [...prev, filePath]
    );
  };

  const selectAllFiles = () => {
    setSelectedFiles(uploadedFiles.map(f => f.path));
  };

  const deselectAllFiles = () => {
    setSelectedFiles([]);
  };

  const parseQueries = (text) => {
    // Parse numbered queries from user input
    const lines = text.split('\n');
    const queries = [];
    
    lines.forEach(line => {
      const match = line.match(/^(\d+)\.\s*(.+?)(?:\s*\((.+?)\))?$/);
      if (match) {
        queries.push({
          number: parseInt(match[1]),
          query: match[2].trim(),
          chartType: match[3]?.trim().toLowerCase() || 'bar chart',
        });
      }
    });
    
    return queries;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (uploadedFiles.length === 0) {
      alert('Please upload data files first!');
      return;
    }
    if (selectedFiles.length === 0) {
      alert('Please select at least one file to query!');
      return;
    }

    const userMessage = { role: 'user', content: input };
    onMessagesChange([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const queries = parseQueries(input);
      
      if (queries.length === 0) {
        throw new Error('Please format your queries with numbers. Example:\n1. Show sales by month (bar chart)');
      }

      // Process each query
      for (const query of queries) {
        console.log('Sending query:', query.query);
        console.log('Chart type:', query.chartType);
        
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/analyze/`,
          {
            query: query.query,
            chart_type: query.chartType,
            files: selectedFiles,
            user_id: userId,
          }
        );

        const { sql_query, chart_data, insights, subscription: updatedSubscription } = response.data;
        console.log('Received chart_data:', chart_data);
        
        // Update subscription info if available
        if (updatedSubscription) {
          setSubscription(updatedSubscription);
        }

        // Add to chat
        const assistantMessage = {
          role: 'assistant',
          content: `**Query ${query.number}:** ${query.query}\n\n**SQL Generated:**\n\`\`\`sql\n${sql_query}\n\`\`\`\n\n**Insights:**\n${insights}`,
        };
        onMessagesChange(prev => [...prev, assistantMessage]);

        // Add visualization to dashboard
        onVisualizationGenerated({
          id: Date.now() + query.number,
          title: query.query,
          type: query.chartType,
          data: chart_data,
          sql: sql_query,
          insights: insights,
        });
      }

      const completionMessage = {
        role: 'assistant',
        content: `✅ Processed ${queries.length} ${queries.length === 1 ? 'query' : 'queries'} successfully! Check the dashboard on the right.`,
      };
      onMessagesChange(prev => [...prev, completionMessage]);

      // Save chat history after successful query processing
      setTimeout(() => saveChatHistory(), 500);

    } catch (error) {
      let errorContent = `❌ Error: ${error.response?.data?.error || error.message}`;
      let showUpgradeButton = false;
      
      // Check if it's a message limit error
      if (error.response?.status === 403 && error.response?.data?.error === 'Message limit reached') {
        errorContent = `🚫 **Message Limit Reached**\n\n${error.response.data.message}\n\n`;
        showUpgradeButton = true;
        
        // Update subscription to show 0 remaining
        if (subscription) {
          setSubscription({
            ...subscription,
            messages_remaining: 0
          });
        }
      }
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        showUpgradeButton: showUpgradeButton
      };
      onMessagesChange(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b" style={{ borderColor: colorTheme.border }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Analyst</h3>
              <p className="text-xs text-gray-400">
                {loadingFiles ? (
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Loading files...
                  </span>
                ) : (
                  `${uploadedFiles.length} file${uploadedFiles.length !== 1 ? 's' : ''} uploaded`
                )}
              </p>
              {subscription && (
                <p className="text-xs mt-1">
                  <span className={`font-semibold ${subscription.messages_remaining <= 1 ? 'text-red-400' : 'text-green-400'}`}>
                    {subscription.messages_remaining} / {subscription.message_limit}
                  </span>
                  <span className="text-gray-500"> messages left</span>
                  {subscription.plan === 'free' && subscription.messages_remaining === 0 && (
                    <span className="text-yellow-400 ml-2">• Upgrade to continue</span>
                  )}
                </p>
              )}
            </div>
          </div>
          {uploadedFiles.length > 0 && (
            <button
              onClick={() => setShowFileSelector(!showFileSelector)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
            >
              <FileCheck className="w-4 h-4" />
              Select Files ({selectedFiles.length})
              {showFileSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
        
        {/* File Selector */}
        {showFileSelector && uploadedFiles.length > 0 && (
          <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">Select files to query:</h4>
              <div className="flex gap-2">
                <button
                  onClick={selectAllFiles}
                  className="text-xs text-green-400 hover:text-green-300 transition-colors"
                >
                  Select All
                </button>
                <span className="text-gray-500">|</span>
                <button
                  onClick={deselectAllFiles}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.path)}
                    onChange={() => toggleFileSelection(file.path)}
                    className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => toggleFileSelection(file.path)}>
                    <p className="text-sm text-white">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  {onDeleteFile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete ${file.name}?`)) {
                          onDeleteFile(file.path);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {selectedFiles.length === 0 && (
              <p className="text-xs text-yellow-400 mt-2">⚠️ Please select at least one file to query</p>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-lg h-8 w-8 flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <div className="text-sm prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <div className="mb-2" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline ? 
                        <code className="bg-gray-700 px-1 py-0.5 rounded text-green-400" {...props} /> : 
                        <code className="block bg-gray-900 p-2 rounded my-2 overflow-x-auto" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {message.showUpgradeButton && (
                  <button
                    onClick={() => navigate('/upgrade')}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-2"
                  >
                    Upgrade Plan
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            {message.role === 'user' && (
              <div className="bg-blue-600 p-2 rounded-lg h-8 w-8 flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-lg h-8 w-8 flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t" style={{ borderColor: colorTheme.border }}>
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your queries in numbered format...&#10;1. Show sales by month (bar chart)&#10;2. Display top products (table)"
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows="3"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
