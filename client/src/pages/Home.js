import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, Zap, Clock, MessageSquare, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: 'Real-time Polling',
      description: 'Create and participate in live polls with instant results and updates.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Users,
      title: 'Interactive Learning',
      description: 'Engage students with interactive questions and immediate feedback.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Live Analytics',
      description: 'View real-time statistics and response patterns as they happen.',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: MessageSquare,
      title: 'Built-in Chat',
      description: 'Communicate with students through integrated chat functionality.',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: Clock,
      title: 'Poll History',
      description: 'Access and review past polls with detailed response data.',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Monitor student engagement and participation over time.',
      color: 'from-pink-400 to-pink-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Hero Section */}
      <div className="text-center mb-20 animate-fade-in">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Transform Your Classroom</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-8 leading-tight">
          Live Polling System
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Transform your classroom with real-time interactive polling. Engage students, 
          get instant feedback, and make learning more dynamic than ever before.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/teacher"
            className="btn-primary text-lg px-10 py-4 flex items-center justify-center space-x-3 group"
          >
            <BarChart3 className="w-6 h-6 group-hover:animate-bounce-gentle" />
            <span>Teacher Dashboard</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/student"
            className="btn-secondary text-lg px-10 py-4 flex items-center justify-center space-x-3 group"
          >
            <Users className="w-6 h-6" />
            <span>Student Dashboard</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="feature-card animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* How It Works */}
      <div className="card mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gradient mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in just three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-3xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              1
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Create Poll</h3>
            <p className="text-gray-600 leading-relaxed">
              Teachers create engaging polls with multiple choice questions in seconds.
            </p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-3xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              2
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Students Respond</h3>
            <p className="text-gray-600 leading-relaxed">
              Students answer in real-time with instant visual feedback and animations.
            </p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-3xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              3
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">View Results</h3>
            <p className="text-gray-600 leading-relaxed">
              See live results and analytics to enhance learning outcomes immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="stat-card">
          <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
          <div className="text-gray-600 font-medium">Real-time Updates</div>
        </div>
        <div className="stat-card">
          <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
          <div className="text-gray-600 font-medium">Unlimited Polls</div>
        </div>
        <div className="stat-card">
          <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
          <div className="text-gray-600 font-medium">Always Available</div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="hero-gradient rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-800/20"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of educators who are already using Live Polling System to transform their classrooms.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/teacher"
                className="bg-white text-purple-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Teaching
              </Link>
              <Link
                to="/history"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold py-4 px-8 rounded-xl transition-all duration-200"
              >
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 