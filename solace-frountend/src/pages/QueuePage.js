import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import '../App.css';

function QueuePage() {
  // State to hold form data and responses
  const [message, setMessage] = useState('');
  const [queue, setQueue] = useState('');
  const [response, setResponse] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data
    const data = {
      message: message,
      queue: queue,
    };

    // Send data using Axios
    axios
      .post('http://localhost:5000/queue', data)
      .then((res) => {
        setResponse(res.data.message || 'Message sent successfully!');
        setMessage('');
        setQueue('');
      })
      .catch((err) => {
        setResponse(err.response?.data?.error || 'Error sending message!');
        console.error(err);
      });
  };

  return (
    <div className="containerbox">
      <h2>Send Your Message</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="queue">Queue:</label>
        <input
          type="text"
          id="queue"
          value={queue}
          onChange={(e) => setQueue(e.target.value)}
          required
        />

        <label htmlFor="message">Your Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          required
        ></textarea>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
      {response && <p id="response" style={{ color: 'green', fontWeight: 'bold' }}>{response}</p>}

    </div>
  );
}

export default QueuePage;
