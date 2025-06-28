import React, { useState } from 'react';
import { usePoll } from '../contexts/PollContext';
import { useSocket } from '../contexts/SocketContext';
import { 
  Plus, 
  StopCircle, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Send,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

const TeacherDashboard = () => {
  const { currentPoll, isPollActive, startPoll, endPoll, sendChatMessage, chatMessages } = usePoll();
  const { isConnected } = useSocket();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [chatInput, setChatInput] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreatePoll = () => {
    if (!question.trim() || options.filter(opt => opt.trim()).length < 2) {
      alert('Please enter a question and at least 2 options');
      return;
    }
    
    const validOptions = options.filter(opt => opt.trim());
    startPoll(question, validOptions);
    setQuestion('');
    setOptions(['', '', '', '']);
    setShowCreateForm(false);
  };

  const handleSendChat = () => {
    if (chatInput.trim()) {
      sendChatMessage('Teacher', chatInput, 'teacher');
      setChatInput('');
    }
  };

  const calculateOptionStats = () => {
    if (!currentPoll) return {};
    
    const stats = {};
    currentPoll.options.forEach(option => {
      stats[option] = 0;
    });
    
    currentPoll.responses.forEach(response => {
      if (stats.hasOwnProperty(response.answer)) {
        stats[response.answer]++;
      }
    });
    
    return stats;
  };

  const optionStats = calculateOptionStats();
  const totalResponses = currentPoll?.responses?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Teacher Dashboard</h1>
          <p className="text-xl text-gray-600">Create and manage live polls for your students</p>
        </div>
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-3 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3 px-4 py-2 bg-red-50 text-red-700 rounded-xl border border-red-200">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Disconnected</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Poll Management */}
        <div className="lg:col-span-2 space-y-8">
          {/* Create Poll Section */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Poll Management</h2>
              {!isPollActive && (
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Poll</span>
                </button>
              )}
            </div>

            {showCreateForm && !isPollActive && (
              <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700">Question</label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your poll question..."
                    className="input-field text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700">Options</label>
                  {options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="input-field mb-3"
                    />
                  ))}
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleCreatePoll}
                    className="btn-primary flex-1"
                  >
                    Start Poll
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {isPollActive && (
              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Active Poll</h3>
                  <p className="text-xl text-gray-600">{currentPoll?.question}</p>
                </div>
                <button
                  onClick={endPoll}
                  className="btn-secondary flex items-center space-x-2 mx-auto"
                >
                  <StopCircle className="w-5 h-5" />
                  <span>End Poll</span>
                </button>
              </div>
            )}
          </div>

          {/* Live Results */}
          {isPollActive && currentPoll && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Live Results</h2>
              <div className="space-y-6">
                {currentPoll.options.map((option, index) => {
                  const count = optionStats[option] || 0;
                  const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
                  
                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg text-gray-900">{option}</span>
                        <span className="text-lg font-bold text-purple-600">
                          {count} votes ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-8 text-lg text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">{totalResponses} responses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">Live updates</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Responses */}
          {isPollActive && currentPoll && currentPoll.responses.length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent Responses</h2>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {currentPoll.responses.slice(-10).reverse().map((response, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-white rounded-xl border border-purple-100">
                    <span className="font-semibold text-gray-900">{response.studentName}</span>
                    <span className="text-purple-600 font-bold">{response.answer}</span>
                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(response.timestamp).toLocaleTimeString()}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Chat */}
        <div className="card h-fit">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3 text-gray-900">
            <MessageSquare className="w-6 h-6 text-purple-600" />
            <span>Class Chat</span>
          </h2>
          
          <div className="space-y-4">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No messages yet</p>
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      message.senderType === 'teacher' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`chat-bubble ${
                        message.senderType === 'teacher' ? 'teacher' : 'student'
                      }`}
                    >
                      <div className="text-xs opacity-75 mb-2 font-medium">{message.senderName}</div>
                      <div className="text-sm">{message.message}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="flex space-x-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Type a message..."
                className="input-field flex-1"
              />
              <button
                onClick={handleSendChat}
                className="btn-primary px-4"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 