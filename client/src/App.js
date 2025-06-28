import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import { PollProvider } from './contexts/PollContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import PollHistory from './pages/PollHistory';
import './index.css';

function App() {
  return (
    <SocketProvider>
      <PollProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/history" element={<PollHistory />} />
              </Routes>
            </main>
          </div>
        </Router>
      </PollProvider>
    </SocketProvider>
  );
}

export default App; 