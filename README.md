# Live Polling System - MERN Stack

A complete real-time polling system built with the MERN stack (MongoDB, Express.js, React, Node.js) for interactive classroom polling.

## 🛠 Tech Stack

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **Socket.IO** - Real-time communication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI framework
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📁 Project Structure

```
├── server/                 # Backend
│   ├── index.js           # Main server file
│   ├── models/
│   │   └── Poll.js        # MongoDB Poll model
│   ├── routes/
│   │   └── polls.js       # REST API routes
│   └── socket.js          # Socket.IO logic
├── client/                 # Frontend
│   ├── public/
│   │   └── index.html     # Main HTML file
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── package.json           # Backend dependencies
├── env.example            # Environment variables template
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd live-polling-system
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/live-polling-system
   PORT=3000
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

6. **Start the frontend (in a new terminal):**
   ```bash
   cd client
   npm start
   ```

7. **Access the application:**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health

## 📊 Features

### 🎯 Core Functionality
- **Real-time Polling** - Create and participate in live polls
- **Interactive Results** - View live statistics and response patterns
- **Built-in Chat** - Communicate between teachers and students
- **Poll History** - Access and review past polls
- **Responsive Design** - Works on desktop and mobile devices

### 👨‍🏫 Teacher Features
- Create polls with custom questions and options
- View real-time results and statistics
- Monitor student participation
- End polls and save results
- Chat with students

### 👨‍🎓 Student Features
- Join polls with a simple name entry
- Submit answers in real-time
- View live results and statistics
- Chat with teachers and classmates
- See poll history

## 🔌 API Endpoints

### REST API
- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /polls` - Fetch all polls (sorted by recent)
- `GET /polls/:id` - Fetch specific poll

### Socket.IO Events
- **Teacher Events:**
  - `new_poll` - Start a new poll
  - `end_poll` - End the current poll
- **Student Events:**
  - `poll_answer` - Submit an answer
- **Chat Events:**
  - `chat_message` - Send a chat message
- **Listen Events:**
  - `poll_started` - New poll started
  - `poll_update` - Poll updated with new answer
  - `poll_ended` - Poll ended with final results
  - `chat_message` - New chat message

## 🎨 Frontend Pages

### Home Page (`/`)
- Feature overview and quick access to dashboards
- Beautiful landing page with call-to-action buttons

### Teacher Dashboard (`/teacher`)
- Poll creation interface
- Real-time results monitoring
- Live chat with students
- Poll management controls

### Student Dashboard (`/student`)
- Name entry for joining class
- Poll participation interface
- Real-time results viewing
- Chat with teachers and classmates

### Poll History (`/history`)
- View all past polls
- Detailed results and statistics
- Response breakdowns
- Timeline of poll activities

## 🗄️ Database Schema

### Poll Model
```javascript
{
  question: String,           // Required
  options: [String],          // Required, min 2 options
  responses: [{
    studentName: String,      // Required
    answer: String,           // Required
    timestamp: Date           // Auto-generated
  }],
  createdAt: Date,            // Auto-generated
  endedAt: Date,              // Set when poll ends
  isActive: Boolean           // Default: true
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/live-polling-system` |
| `PORT` | Backend server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

### Frontend Configuration
- Proxy: `http://localhost:3000` (for API calls)
- Port: `3001` (React development server)

## 🚀 Deployment

### Backend Deployment
```bash
# Production build
npm start

# Environment variables
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

### Frontend Deployment
```bash
# Build for production
cd client
npm run build

# Serve static files
npx serve -s build
```

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### Backend Testing
```bash
# Test the backend
node test-example.js
```

### Frontend Testing
```bash
cd client
npm test
```

## 🔒 Security Considerations

- Implement authentication for teacher actions
- Validate all input data
- Use HTTPS in production
- Implement rate limiting
- Sanitize user inputs
- Secure MongoDB connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify all dependencies are installed
4. Check environment variables are set correctly
5. Ensure ports 3000 and 3001 are available

## 🎯 Usage Examples

### Creating a Poll (Teacher)
1. Navigate to Teacher Dashboard
2. Click "Create Poll"
3. Enter question and options
4. Click "Start Poll"

### Participating in a Poll (Student)
1. Navigate to Student Dashboard
2. Enter your name
3. Select an answer when poll is active
4. Click "Submit Answer"

### Viewing Results
- Real-time results appear automatically
- View poll history for past polls
- Export data for analysis

---

**Built with ❤️ using the MERN stack** 