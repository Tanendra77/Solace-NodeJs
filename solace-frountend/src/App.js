import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import TopicPage from './pages/topic';
import QueuePage from './pages/QueuePage';
import QueueMessage from './pages/QueueMessage';
import MongoMessages from './pages/mongoMessage';
import './App.css';
//logos
import companyLogo from './assets/company-logo.png'; 
import nodejsLogo from './assets/nodejs-logo.png'; 
import reactLogo from './assets/react-logo.png'; 
import solaceLogo from './assets/solace-logo.png'; 
import momgoDbLogo from './assets/mongodb.png'; 

function App() {
  return (
    <Router>
      <Header /> { /* Title */}
      <div className="container">
        <nav>
          <ul>
            <li><Link to="/topic">Topic</Link></li>
            <li><Link to="/queue">Queue</Link></li>
            <li><Link to="/queuemessage">QueueMessage</Link></li>
            <li><Link to="/mongomessages">MongoMessage</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/topic" element={<TopicPage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/queuemessage" element={<QueueMessage />} />
          <Route path="/mongomessages" element={<MongoMessages />} />
        </Routes>
      </div>

      {/* Company Logo in Bottom Right Corner */}
      <img src={companyLogo} alt="Company Logo" className="company-logo" />

      {/* Built with Section */}
      <div className="built-with">
        <span>Built with</span>
        <div className="tech-container">
          <img src={nodejsLogo} alt="Node.js" className="tech-logo" />
          <span className="plus-sign"> + </span>
          <img src={solaceLogo} alt="Solace" className="tech-logo solace-logo" />
          <span className="plus-sign"> + </span>
          <img src={reactLogo} alt="React.js" className="tech-logo" />
          <span className="plus-sign"> + </span>
          <img src={momgoDbLogo} alt="MongoDB" className="tech-logo" />
        </div>
      </div>
    </Router>
  );
}

// New Header Component
function Header() {
  const navigate = useNavigate();

  return (
    <h1 className="Title" onClick={() => navigate('/')}>
      Solace PubSub+ Messenger
    </h1>
  );
}

export default App;
