import React, { useEffect, useState } from 'react';
import trash from './../assets/trash-solid.svg'; 


import axios from 'axios';
import '../App.css';

function MongoMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/messages");
      setMessages(response.data.messages || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/messages/${id}`);
      setMessages(messages.filter((msg) => msg._id !== id)); // Update UI instantly
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="container-box">
      <h2>MongoDB Messages</h2>
      <div className="messages-container">
        {messages.length > 0 ? (
            messages.map((data, index) => (
            <div key={index} className="message-box">
                <p className="message-payload">Payload: {data.payload}</p>
                <p className="message-timestamp">Timestamp: {new Date(data.timestamp).toLocaleString()}</p>
                <button className="delete-btn" onClick={() => deleteMessage(data._id)}><img src={trash} alt="Delete" className="trash"/> </button>
            </div>
            ))
        ) : (
            <p className="no-messages">No messages available.</p>
        )}
        </div>
    </div>
  );
}

export default MongoMessages;
