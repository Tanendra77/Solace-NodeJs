import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Ensure this is correctly linked

function QueueConsumer() {
  const [queueName, setQueueName] = useState('');
  const [responseMessages, setResponseMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQueueMessages = async () => {
    if (!queueName.trim()) {
      setError('Please enter a queue name!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/consume', { queue: queueName });
      setResponseMessages(response.data.messages || []);
      console.log('Response data:', response.data.messages);
    } catch (err) {
      setResponseMessages([{ payload: 'Error consuming message!', timestamp: new Date().toISOString() }]);
      console.error('Error consuming message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-box">
      <h2>Queue Messages</h2>

      {/* Queue Name Input */}
      <input
        type="text"
        value={queueName}
        onChange={(e) => setQueueName(e.target.value)}
        placeholder="Enter Queue Name"
        className="input-field"
      />
      {error && <p className="error-message">{error}</p>}

      {/* Fetch Messages Button */}
      <button onClick={fetchQueueMessages} className="submit-btn" disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Messages'}
      </button>
      
      {/* Display Response Messages */}
      {responseMessages.length > 0 ? (
        responseMessages.map((data, index) => (
          <div key={index} className="message-box">
            <p className="message-payload">Payload: {data.payload}</p>
            <p className="message-timestamp">Timestamp: {new Date(data.timestamp).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p className="no-messages">No messages available.</p>
      )}
    </div>
  );
}

export default QueueConsumer;
