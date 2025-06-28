const socketIO = require('socket.io');
const Poll = require('./models/Poll');

let io;
let currentPoll = null;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send current poll status to newly connected users
    if (currentPoll) {
      socket.emit('poll_started', currentPoll);
    }

    // Teacher creates a new poll
    socket.on('new_poll', async (pollData) => {
      try {
        const { question, options } = pollData;
        
        // Create new poll in memory for real-time updates
        currentPoll = {
          id: Date.now().toString(), // Temporary ID for real-time
          question,
          options,
          responses: [],
          createdAt: new Date(),
          isActive: true
        };

        // Broadcast poll started to all connected clients
        io.emit('poll_started', currentPoll);
        
        console.log(`New poll started: ${question}`);
      } catch (error) {
        console.error('Error starting new poll:', error);
        socket.emit('error', { message: 'Failed to start poll' });
      }
    });

    // Student submits an answer
    socket.on('poll_answer', (answerData) => {
      try {
        const { studentName, answer } = answerData;
        
        if (!currentPoll || !currentPoll.isActive) {
          socket.emit('error', { message: 'No active poll' });
          return;
        }

        // Validate answer
        if (!currentPoll.options.includes(answer)) {
          socket.emit('error', { message: 'Invalid answer option' });
          return;
        }

        // Check if student already answered
        const existingResponse = currentPoll.responses.find(
          response => response.studentName === studentName
        );

        if (existingResponse) {
          // Update existing response
          existingResponse.answer = answer;
          existingResponse.timestamp = new Date();
        } else {
          // Add new response
          currentPoll.responses.push({
            studentName,
            answer,
            timestamp: new Date()
          });
        }

        // Broadcast poll update to all clients
        io.emit('poll_update', {
          studentName,
          answer,
          totalResponses: currentPoll.responses.length,
          optionStats: calculateOptionStats(currentPoll)
        });

        console.log(`Student ${studentName} answered: ${answer}`);
      } catch (error) {
        console.error('Error processing poll answer:', error);
        socket.emit('error', { message: 'Failed to process answer' });
      }
    });

    // Teacher ends the poll
    socket.on('end_poll', async () => {
      try {
        if (!currentPoll || !currentPoll.isActive) {
          socket.emit('error', { message: 'No active poll to end' });
          return;
        }

        // Save poll to MongoDB
        const pollToSave = new Poll({
          question: currentPoll.question,
          options: currentPoll.options,
          responses: currentPoll.responses,
          endedAt: new Date(),
          isActive: false
        });

        await pollToSave.save();

        // Broadcast poll ended with final results
        const finalResults = {
          pollId: pollToSave._id,
          question: currentPoll.question,
          options: currentPoll.options,
          responses: currentPoll.responses,
          optionStats: calculateOptionStats(currentPoll),
          totalResponses: currentPoll.responses.length,
          endedAt: new Date()
        };

        io.emit('poll_ended', finalResults);

        // Clear current poll
        currentPoll = null;

        console.log('Poll ended and saved to database');
      } catch (error) {
        console.error('Error ending poll:', error);
        socket.emit('error', { message: 'Failed to end poll' });
      }
    });

    // Chat message functionality
    socket.on('chat_message', (messageData) => {
      try {
        const { senderName, message, senderType } = messageData; // senderType: 'teacher' or 'student'
        
        if (!senderName || !message || !senderType) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }

        const chatMessage = {
          senderName,
          message: message.trim(),
          senderType,
          timestamp: new Date(),
          socketId: socket.id
        };

        // Broadcast chat message to all clients
        io.emit('chat_message', chatMessage);
        
        console.log(`Chat message from ${senderName} (${senderType}): ${message}`);
      } catch (error) {
        console.error('Error processing chat message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Get current poll status
    socket.on('get_poll_status', () => {
      if (currentPoll && currentPoll.isActive) {
        socket.emit('poll_status', {
          ...currentPoll,
          optionStats: calculateOptionStats(currentPoll)
        });
      } else {
        socket.emit('poll_status', null);
      }
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Helper function to calculate option statistics
const calculateOptionStats = (poll) => {
  const stats = {};
  
  // Initialize counts for each option
  poll.options.forEach(option => {
    stats[option] = 0;
  });

  // Count responses for each option
  poll.responses.forEach(response => {
    if (stats.hasOwnProperty(response.answer)) {
      stats[response.answer]++;
    }
  });

  return stats;
};

// Function to get current poll (for external access)
const getCurrentPoll = () => currentPoll;

// Function to get IO instance (for external access)
const getIO = () => io;

module.exports = {
  initializeSocket,
  getCurrentPoll,
  getIO
}; 