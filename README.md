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
```bash
solace/
├── Solace Pubsub-Nodejs/ # Backend 1(Node.js) for sender
│   ├── app.js             # Express server
│   ├── TopicPublisher.js  # Topic message sender
│   ├── QueueProducer.js   # Queue message sender
│   ├── TopicSubscriber.js # Terminal test Code for receiving via topic
│   ├── QueueConsumer.js   # Terminal test Code for receiving via topic
│   └── .env               # Environment configuration
├── Solace Consumer-Subscriber/ # Backend (Node.js) for receiver
│   ├── app.js             # Express server (with MongoDB connection)
│   ├── TopicSubscriber.js # Topic message receiver
│   ├── QueueConsumer.js   # Queue message receiver
│   └── .env               # Environment configuration
└── solace-frontend/       # Frontend (React)
    └── src/
        ├── app.js         # Home page
        └── pages/
            ├── mongoMessage.js  # MongoDB Messages display component
            ├── QueueMessage.js  # Queue Message display component
            ├── QueuePage.js     # Sending with QueueName component
            └── Topic.js         # Sending with Topic component
