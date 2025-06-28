// Test example for Live Polling System Backend
// This file demonstrates how to interact with the backend

const io = require('socket.io-client');

// Connect to the server
const socket = io('http://localhost:3000');

// Test data
const testPoll = {
  question: "What is your favorite programming language?",
  options: ["JavaScript", "Python", "Java", "C++", "Go"]
};

const testStudents = [
  { name: "Alice", answer: "JavaScript" },
  { name: "Bob", answer: "Python" },
  { name: "Charlie", answer: "Java" },
  { name: "Diana", answer: "JavaScript" },
  { name: "Eve", answer: "Go" }
];

// Listen for events
socket.on('connect', () => {
  console.log('✅ Connected to server');
  
  // Simulate teacher starting a poll
  setTimeout(() => {
    console.log('\n📊 Teacher starting a new poll...');
    socket.emit('new_poll', testPoll);
  }, 1000);
});

socket.on('poll_started', (poll) => {
  console.log('🎉 New poll started:', poll.question);
  console.log('Options:', poll.options);
  
  // Simulate students answering
  testStudents.forEach((student, index) => {
    setTimeout(() => {
      console.log(`\n👤 ${student.name} answering: ${student.answer}`);
      socket.emit('poll_answer', {
        studentName: student.name,
        answer: student.answer
      });
    }, (index + 1) * 2000); // 2 seconds apart
  });
  
  // End poll after all students answer
  setTimeout(() => {
    console.log('\n🏁 Teacher ending the poll...');
    socket.emit('end_poll');
  }, (testStudents.length + 1) * 2000);
});

socket.on('poll_update', (update) => {
  console.log(`📈 ${update.studentName} answered: ${update.answer}`);
  console.log(`Total responses: ${update.totalResponses}`);
  console.log('Current stats:', update.optionStats);
});

socket.on('poll_ended', (results) => {
  console.log('\n🏆 Poll ended! Final results:');
  console.log('Question:', results.question);
  console.log('Total responses:', results.totalResponses);
  console.log('Final stats:', results.optionStats);
  
  // Test chat functionality
  setTimeout(() => {
    console.log('\n💬 Testing chat functionality...');
    socket.emit('chat_message', {
      senderName: "Teacher",
      message: "Great participation everyone!",
      senderType: "teacher"
    });
  }, 1000);
});

socket.on('chat_message', (message) => {
  console.log(`💬 ${message.senderName} (${message.senderType}): ${message.message}`);
});

socket.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

socket.on('disconnect', () => {
  console.log('🔌 Disconnected from server');
});

// Test REST API
async function testRestAPI() {
  try {
    console.log('\n🌐 Testing REST API...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test polls endpoint
    const pollsResponse = await fetch('http://localhost:3000/polls');
    const pollsData = await pollsResponse.json();
    console.log('Polls count:', pollsData.count);
    
  } catch (error) {
    console.error('❌ REST API test failed:', error.message);
  }
}

// Run REST API test after a delay
setTimeout(testRestAPI, 15000);

console.log('🚀 Live Polling System Test Started');
console.log('Make sure the server is running on http://localhost:3000');
console.log('This test will simulate a complete polling session...\n'); 