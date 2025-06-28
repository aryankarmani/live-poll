import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Clock, Calendar, TrendingUp, RefreshCw } from 'lucide-react';
import axios from 'axios';

const PollHistory = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/polls`);
      setPolls(response.data.data);
    } catch (err) {
      setError('Failed to fetch poll history');
      console.error('Error fetching polls:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">Loading poll history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-xl text-red-600 mb-6">{error}</p>
          <button onClick={fetchPolls} className="btn-primary flex items-center space-x-2 mx-auto">
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gradient mb-3">Poll History</h1>
        <p className="text-xl text-gray-600">View past polls and their results</p>
      </div>

      {polls.length === 0 ? (
        <div className="card text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">No Polls Yet</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Poll history will appear here once polls are created and completed.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {polls.map((poll, index) => (
            <div key={poll._id || index} className="card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{poll.question}</h3>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold">{poll.totalResponses} responses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold">{new Date(poll.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold">{new Date(poll.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {poll.options.map((option, optionIndex) => {
                  const count = poll.optionStats[option] || 0;
                  const percentage = poll.totalResponses > 0 ? (count / poll.totalResponses) * 100 : 0;
                  
                  return (
                    <div key={optionIndex} className="space-y-3">
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

              {poll.responses.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-lg mb-4 text-gray-900">Recent Responses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {poll.responses.slice(-6).map((response, responseIndex) => (
                      <div key={responseIndex} className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-white rounded-xl border border-purple-100">
                        <span className="font-semibold text-gray-900">{response.studentName}</span>
                        <span className="text-purple-600 font-bold">{response.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PollHistory; 