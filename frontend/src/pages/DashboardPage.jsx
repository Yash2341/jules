import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import botService from '../services/botService';
import './Dashboard.css';

const DashboardPage = () => {
  const [bots, setBots] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const data = await botService.getBots();
        setBots(data);
      } catch (err) {
        setError('Failed to fetch bots');
      } finally {
        setLoading(false);
      }
    };
    fetchBots();
  }, []);

  const handleAddBot = async (e) => {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('Please provide a bot token.');
      return;
    }
    try {
      const newBot = await botService.addBot(token);
      setBots([...bots, newBot]);
      setToken('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add bot');
    }
  };

  const handleDeleteBot = async (id) => {
    if (window.confirm('Are you sure you want to delete this bot?')) {
      try {
        await botService.deleteBot(id);
        setBots(bots.filter((bot) => bot._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete bot');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="dashboard container">
        <h1 className="dashboard-title">My Bots</h1>

        <div className="add-bot-form">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your Telegram bot token"
          />
          <button onClick={handleAddBot}>Add Bot</button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="bot-list-container">
          <h2 className="bot-list-title">Your Bots</h2>
          {loading ? (
            <p>Loading bots...</p>
          ) : bots.length === 0 ? (
            <p>You haven't added any bots yet.</p>
          ) : (
            bots.map((bot) => (
              <div key={bot._id} className="bot-item">
                <div className="bot-info">
                  <strong>@{bot.botUsername}</strong>
                </div>
                <div className="bot-actions">
                  <Link to={`/bots/${bot._id}/commands`}>Manage Commands</Link>
                  <button onClick={() => handleDeleteBot(bot._id)} className="delete-button">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
