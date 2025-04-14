const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const { consumeMessages, getMessages, disconnectConsumer } = require('./QueueConsumer');
const { connectSession, subscribeToTopic, unsubscribeFromTopic } = require('./TopicSubscriber');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3001" }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/solace_messages', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

const messageSchema = new mongoose.Schema({
  type: String,
  queueName: String,
  topicName: String,
  payload: String,
  timestamp: Date,
});

const Message = mongoose.model('Message', messageSchema);

// 1. Queue Consumer Endpoint
app.post('/consume', async (req, res) => {
  const { queue } = req.body;
  if (!queue) return res.status(400).json({ error: 'Queue name is required.' });

  try {
    const messages = await consumeMessages(queue);
    const savedMessages = await Message.insertMany(
      messages.map(msg => ({
        type: 'queue',
        queueName: queue,
        payload: msg.payload,
        timestamp: new Date(msg.timestamp),
      }))
    );
    res.json({ success: true, messages: savedMessages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Topic Subscription Endpoint
app.post('/subscribe-topic', (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).send("Topic name required");

  subscribeToTopic(topic);
  res.send(`Subscribed to topic: ${topic}`);
});

app.post('/unsubscribe-topic', (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).send("Topic name required");

  unsubscribeFromTopic(topic);
  res.send(`Unsubscribed from topic: ${topic}`);
});

// 3. Disconnect Queue Consumer
app.post('/disconnect', (req, res) => {
  disconnectConsumer();
  res.json({ success: true, message: 'Consumer disconnected.' });
});

// 4. Get all stored messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// 5. Delete a message
app.delete("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Socket.io + topic handler (outside connection!)
connectSession(async (message) => {
  const payload = message.getBinaryAttachment().toString(); // ensure readable
  const topic = message.getDestination().getName();

  // Save message
  await Message.create({
    type: 'topic',
    topicName: topic,
    payload: payload,
    timestamp: new Date()
  });

  io.emit('message', { topic, payload }); // broadcast to all clients
});

io.on('connection', (socket) => {
  console.log('[Socket.io] Client connected');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
