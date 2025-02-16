const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { consumeMessages, getMessages, disconnectConsumer } = require('./QueueConsumer');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/solace_messages', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

const messageSchema = new mongoose.Schema({
  queueName: String,  // Add queue name field
  payload: String,
  timestamp: Date,
});

const Message = mongoose.model('Message', messageSchema);


// Consume Messages and Store in MongoDB
app.post('/consume', async (req, res) => {
  const { queue } = req.body;
  if (!queue) {
    return res.status(400).json({ error: 'Queue name is required.' });
  }

  try {
    const messages = await consumeMessages(queue);

    // Save messages to MongoDB with queueName
    const savedMessages = await Message.insertMany(
      messages.map(msg => ({
        queueName: queue,  // Store queue name
        payload: msg.payload,
        timestamp: new Date(msg.timestamp),
      }))
    );

    res.json({ success: true, messages: savedMessages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Fetch Messages from MongoDB
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Disconnect consumer
app.post('/disconnect', (req, res) => {
  disconnectConsumer();
  res.json({ success: true, message: 'Consumer disconnected.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
