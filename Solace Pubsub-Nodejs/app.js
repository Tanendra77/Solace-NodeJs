const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { publishMessage } = require("./TopicPublisher");
const { runProducer } = require('./queueProducer');
require('dotenv').config();
console.log("Loaded .env file:");
console.log("SOLACE_URL:", process.env.SOLACE_URL); // Debugging


const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(cors());

// **POST Route to publish messages to a topic**
app.post('/topic', async (req, res) => {
  const { topic, message } = req.body;
  console.log("here ")
  if (!topic || !message) {
    return res.status(400).json({ error: 'Topic and message are required.' });
  }

  try {
    const result = await publishMessage(topic, message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **POST Route to send messages to a queue**
app.post('/queue', async (req, res) => {
    const { queue, message } = req.body;
    console.log("int queue")
    if (!queue || !message) {
      return res.status(400).json({ error: 'Queue and message are required.' });
    }
    try {
      const response = await runProducer(
        queue,
        message,
        "wss://mr-connection-okms9u4jc2o.messaging.solace.cloud:443",
        "messaging",
        "solace-cloud-client",
        "r5b2e07qrmp5atd58p8uan8kkk"
      );
      res.json({ success: true, message: response });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  });


  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
