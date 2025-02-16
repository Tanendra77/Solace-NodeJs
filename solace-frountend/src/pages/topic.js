import React, { useState } from 'react';
import axios from 'axios';
//import '../App.css';
function TopicPage() {
  // State to hold form data
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('');  // State for topic
  const [response, setResponse] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data
    const data = {
      message: message,
      topic: topic,  // Include topic in the data
    };

    // Send data using Axios
    axios
      .post('http://localhost:5000/topic', data)
      .then((res) => {
        setResponse('Message sent successfully!');
        setMessage('');
        setTopic('');  // Reset the topic input
      })
      .catch((err) => {
        setResponse('Error sending message!');
        console.error(err);
      });
  };

  return (
    <div className="containerbox">
      <h2>Send Your Message</h2>
      <form onSubmit={handleSubmit}>

        <label htmlFor="topic">Topic:</label> {/* Topic input */}
        <input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
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
      {response && <p id="response">{response}</p>}
    </div>
  );
}

export default TopicPage;