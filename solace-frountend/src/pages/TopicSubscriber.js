import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import '../App.css';

const socket = io('http://localhost:3000');

function TopicSubscriber() {
  const [topic, setTopic] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    socket.on('message', (data) => {
      console.log("Received message:", data);
      setMessages(prev => [
        ...prev,
        {
          payload: data.payload,
          topic: data.topic,
          timestamp: new Date().toISOString(),
        }
      ]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleSubscribe = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic name!');
      return;
    }

    try {
      await axios.post('http://localhost:3000/subscribe-topic', { topic });
      setSubscribed(true);
      setSuccessMessage(`Subscribed to topic: ${topic}`);
      setError('');
    } catch (err) {
      setError('Subscription failed.');
      setSuccessMessage('');
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await axios.post('http://localhost:3000/unsubscribe-topic', { topic });
      setSubscribed(false);
      setMessages([]);
      setSuccessMessage('');
      setError('');
    } catch (err) {
      setError('Unsubscription failed.');
    }
  };

  return (
    <div className="container-box">
      <h2>Topic Subscriber</h2>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter Topic Name"
        className="input-field"
        disabled={subscribed}
      />

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleSubscribe} className="submit-btn" disabled={subscribed}>
          Subscribe
        </button>
        <button onClick={handleUnsubscribe} className="submit-btn unsubscribe" disabled={!subscribed}>
          Unsubscribe
        </button>
      </div>

      <div className="messages-container">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="message-box">
              <p className="message-payload">Payload: {msg.payload}</p>
              <p className="message-timestamp">Topic: {msg.topic}</p>
              <p className="message-timestamp">Timestamp: {new Date(msg.timestamp).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="no-messages">No messages received yet.</p>
        )}
      </div>
    </div>
  );
}

export default TopicSubscriber;
