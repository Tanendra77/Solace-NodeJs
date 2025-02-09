# Solace PubSub+ Real-Time Messaging Demo

[![Node.js Version](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18%2B-blue)](https://reactjs.org/)

A real-time messaging application demonstrating Solace PubSub+ capabilities with:
- **Publish/Subscribe (Topics)** 🌐  
- **Guaranteed Messaging (Queues)** 🚀  
- **React frontend for real-time visualization**

![Architecture Diagram](https://i.imgur.com/5XZJQ9E.png)

---

## Features
- Publish messages to Solace topics
- Send persistent messages to Solace queues
- Real-time message display using Server-Sent Events (SSE)
- REST API for message operations
- Environment-based configuration

---

## Project Structure

solace/
├── Solace Pubsub-Nodejs/ # Backend (Node.js)
│   ├── app.js            # Express server
│   ├── TopicPublisher.js  # Topic message sender
│   ├── TopicSubscriber.js # Topic message receiver
│   ├── QueueProducer.js   # Queue message sender
│   ├── QueueConsumer.js   # Queue message receiver
│   └── .env               # Environment configuration
└── solace-frontend/       # Frontend (React)
    └── src/
        └── components/
            └── Messages.js # Message display component
└── package.json
Prerequisites
Node.js v16+ and npm
Solace PubSub+ Cloud credentials:
Host URL
Message VPN
Client Username/Password
Basic understanding of React
Installation
1. Clone the repository:
bash
Copy
Edit
git clone https://github.com/yourusername/solace.git
cd solace
2. Install backend dependencies:
bash
Copy
Edit
cd "Solace Pubsub-Nodejs"
npm install
3. Install frontend dependencies:
bash
Copy
Edit
cd ../solace-frontend
npm install
Configuration
Create .env file in Solace Pubsub-Nodejs:

ini
Copy
Edit
SOLACE_URL=wss://your-host-url:443
SOLACE_VPN=your-vpn
SOLACE_USERNAME=your-username
SOLACE_PASSWORD=your-password
Running the Application
Start backend server:
bash
Copy
Edit
cd "Solace Pubsub-Nodejs"
npm start
Start React frontend:
bash
Copy
Edit
cd ../solace-frontend
npm start
Testing with Postman
Publish to Topic
http
Copy
Edit
POST http://localhost:5000/api/topic
Content-Type: application/json

{
  "topic": "news",
  "message": "Breaking news update!"
}
Send to Queue
http
Copy
Edit
POST http://localhost:5000/api/queue
Content-Type: application/json

{
  "queue": "orders",
  "message": "New order #1234"
}
Real-Time Updates
The React frontend automatically displays incoming messages using Server-Sent Events:

javascript
Copy
Edit
// Example SSE listener
useEffect(() => {
  const eventSource = new EventSource('http://localhost:5000/events');
  eventSource.onmessage = (e) => {
    setMessages(prev => [...prev, JSON.parse(e.data)]);
  };
}, []);
Deployment
Environment Variables:
Use proper secret management for production.

CORS Configuration:

app.use(cors({
  origin: 'https://your-production-domain.com'
}));
Consider using PM2 or Docker for process management.
References
Solace PubSub+ Node.js Tutorial
Solace JavaScript API Docs
React SSE Implementation Guide
License
MIT License

Happy Messaging! 🚀
[Your Name]
GitHub Follow

markdown
Copy
Edit

### How to Use:
1. Copy this entire content.  
2. Create a new file named `README.md` in the root of your repository.  
3. Replace placeholders like `yourusername`, `your-host-url`, and `your-vpn` with actual values.  
4. Commit and push the file to GitHub.  

Let me know if you'd like any additional changes! 😊
