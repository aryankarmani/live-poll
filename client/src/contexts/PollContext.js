import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';

const PollContext = createContext();

export const usePoll = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
};

export const PollProvider = ({ children }) => {
  const { socket } = useSocket();
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollHistory, setPollHistory] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isPollActive, setIsPollActive] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Listen for poll events
    socket.on('poll_started', (poll) => {
      console.log('Poll started:', poll);
      setCurrentPoll(poll);
      setIsPollActive(true);
    });

    socket.on('poll_update', (update) => {
      console.log('Poll update:', update);
      setCurrentPoll(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          responses: [...prev.responses, {
            studentName: update.studentName,
            answer: update.answer,
            timestamp: new Date()
          }]
        };
      });
    });

    socket.on('poll_ended', (results) => {
      console.log('Poll ended:', results);
      setCurrentPoll(null);
      setIsPollActive(false);
      setPollHistory(prev => [results, ...prev]);
    });

    socket.on('chat_message', (message) => {
      console.log('Chat message:', message);
      setChatMessages(prev => [...prev, message]);
    });

    socket.on('poll_status', (status) => {
      if (status) {
        setCurrentPoll(status);
        setIsPollActive(true);
      } else {
        setCurrentPoll(null);
        setIsPollActive(false);
      }
    });

    // Request current poll status on connection
    socket.emit('get_poll_status');

    return () => {
      socket.off('poll_started');
      socket.off('poll_update');
      socket.off('poll_ended');
      socket.off('chat_message');
      socket.off('poll_status');
    };
  }, [socket]);

  const startPoll = (question, options) => {
    if (socket) {
      socket.emit('new_poll', { question, options });
    }
  };

  const endPoll = () => {
    if (socket) {
      socket.emit('end_poll');
    }
  };

  const submitAnswer = (studentName, answer) => {
    if (socket) {
      socket.emit('poll_answer', { studentName, answer });
    }
  };

  const sendChatMessage = (senderName, message, senderType) => {
    if (socket) {
      socket.emit('chat_message', { senderName, message, senderType });
    }
  };

  const value = {
    currentPoll,
    pollHistory,
    chatMessages,
    isPollActive,
    startPoll,
    endPoll,
    submitAnswer,
    sendChatMessage,
  };

  return (
    <PollContext.Provider value={value}>
      {children}
    </PollContext.Provider>
  );
}; 