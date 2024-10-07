import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // useEffect(() => {
  //   setDebugInfo(`VITE_BACKEND_URL: ${import.meta.env.VITE_BACKEND_URL}`);
  // }, []);

  const fetchAIResponse = async (userMessage) => {
    setLoading(true);
    setError('');
    setDebugInfo('');

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const fullUrl = `${backendUrl}/api/chat/generate`;
      // setDebugInfo(prev => `${prev}\nAttempting to fetch from: ${fullUrl}`);
      
      const res = await axios.post(fullUrl, { message: userMessage });
      const aiResponse = res.data.response;
      setMessages(prevMessages => [...prevMessages, { type: 'user', text: userMessage }, { type: 'ai', text: aiResponse }]);
    } catch (err) {
      let errorMessage = 'Unknown error occurred';
      if (err.response) {
        errorMessage = `Server error: ${err.response.status} ${err.response.statusText}`;
        setDebugInfo(prev => `${prev}\nResponse data: ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        errorMessage = 'No response received from the server. Please check your internet connection.';
      } else {
        errorMessage = err.message;
      }
      setError(`Error fetching AI response: ${errorMessage}`);
      setDebugInfo(prev => `${prev}\nFull error: ${JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.get(`${backendUrl}/api/health`);
      setDebugInfo(`Health check response: ${JSON.stringify(res.data)}`);
    } catch (err) {
      setDebugInfo(`Health check failed: ${err.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      fetchAIResponse(input);
      setInput('');
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot">
          <div className="chat-header">
            <h2>AI Chatbot</h2>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
          {/* <button onClick={testConnection} disabled={loading}>
            Test Connection
          </button> */}
          <pre className="debug-info">{debugInfo}</pre>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          Open Chatbot
        </button>
      )}
    </div>
  );
};

export default Chatbot;