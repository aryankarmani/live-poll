import React, { useState, useEffect } from 'react';
import { usePoll } from '../contexts/PollContext';
import { useSocket } from '../contexts/SocketContext';
import { 
  Users, 
  BarChart3, 
  MessageSquare, 
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  TrendingUp
} from 'lucide-react';

const StudentDashboard = () => {
  const { currentPoll, isPollActive, submitAnswer, sendChatMessage, chatMessages } = usePoll();
  const { isConnected } = useSocket();
  const [studentName, setStudentName] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showNameForm, setShowNameForm] = useState(true);

  useEffect(() => {
    const savedName = localStorage.getItem('studentName');
    if (savedName) {
      setStudentName(savedName);
      setShowNameForm(false);
    }
  }, []);

  useEffect(() => {
    if (currentPoll && studentName) {
      const hasStudentAnswered = currentPoll.responses.some(
        response => response.studentName === studentName
      );
      setHasAnswered(hasStudentAnswered);
      
      if (hasStudentAnswered) {
        const studentResponse = currentPoll.responses.find(
          response => response.studentName === studentName
        );
        setSelectedAnswer(studentResponse.answer);
      }
    }
  }, [currentPoll, studentName]);

  const handleNameSubmit = () => {
    if (studentName.trim()) {
      localStorage.setItem('studentName', studentName);
      setShowNameForm(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer && studentName) {
      submitAnswer(studentName, selectedAnswer);
      setHasAnswered(true);
    }
  };

  const handleSendChat = () => {
    if (chatInput.trim() && studentName) {
      sendChatMessage(studentName, chatInput, 'student');
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

  if (showNameForm) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Welcome Student!</h2>
          <p className="text-lg text-gray-600 mb-8">Please enter your name to join the class</p>
          
          <div className="space-y-6">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name..."
              className="input-field text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
            />
            <button
              onClick={handleNameSubmit}
              className="btn-primary w-full text-lg py-4"
            >
              Join Class
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Student Dashboard</h1>
          <p className="text-xl text-gray-600">Welcome, {studentName}!</p>
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
        {/* Left Column - Poll Participation */}
        <div className="lg:col-span-2 space-y-8">
          {!isPollActive ? (
            <div className="card text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Waiting for Poll</h2>
              <p className="text-lg text-gray-600">Your teacher will start a poll soon...</p>
            </div>
          ) : (
            <>
              {/* Current Poll */}
              <div className="card">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Current Poll</h2>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900">{currentPoll?.question}</h3>
                  
                  {!hasAnswered ? (
                    <div className="space-y-4">
                      {currentPoll?.options.map((option, index) => (
                        <div
                          key={index}
                          className={`poll-option ${
                            selectedAnswer === option ? 'selected' : ''
                          }`}
                          onClick={() => setSelectedAnswer(option)}
                        >
                          <span className="text-lg font-medium">{option}</span>
                          {selectedAnswer === option && (
                            <CheckCircle className="w-6 h-6 text-purple-600" />
                          )}
                        </div>
                      ))}
                      <button
                        onClick={handleAnswerSubmit}
                        disabled={!selectedAnswer}
                        className="btn-primary w-full text-lg py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Answer
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-xl font-bold text-green-700 mb-2">You answered: {selectedAnswer}</p>
                      <p className="text-gray-600">Thank you for participating!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Results */}
              <div className="card">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Live Results</h2>
                <div className="space-y-6">
                  {currentPoll?.options.map((option, index) => {
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
            </>
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
                      message.senderName === studentName ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`chat-bubble ${
                        message.senderName === studentName ? 'own' : 'student'
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

export default StudentDashboard; 