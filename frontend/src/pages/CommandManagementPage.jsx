import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import botService from '../services/botService'; // We need to fetch the bot details
import commandService from '../services/commandService';
import './CommandManagement.css';

const CommandManagementPage = () => {
  const { botId } = useParams();
  const [bot, setBot] = useState(null);
  const [commands, setCommands] = useState([]);
  const [newCommand, setNewCommand] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBot = async () => {
      try {
        // There is no getBotById service, so we fetch all and find the one.
        // This is not ideal, but it's what the current services support.
        // A better approach would be a getBotById endpoint.
        const allBots = await botService.getBots();
        const currentBot = allBots.find(b => b._id === botId);
        if (currentBot) {
          setBot(currentBot);
          setCommands(currentBot.commands);
        } else {
          setError('Bot not found');
        }
      } catch (err) {
        setError('Failed to fetch bot data');
      } finally {
        setLoading(false);
      }
    };
    fetchBot();
  }, [botId]);

  const handleAddCommand = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const updatedCommands = await commandService.addCommand(botId, newCommand, newMessage);
      setCommands(updatedCommands);
      setNewCommand('');
      setNewMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add command');
    }
  };

  const handleDeleteCommand = async (commandId) => {
    if (window.confirm('Are you sure you want to delete this command?')) {
      try {
        await commandService.deleteCommand(botId, commandId);
        setCommands(commands.filter((cmd) => cmd._id !== commandId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete command');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <Header />
      <div className="command-management container">
        <h1 className="command-title">
          Manage Commands for @{bot?.botUsername}
          <Link to="/">Back to Dashboard</Link>
        </h1>

        <form onSubmit={handleAddCommand} className="add-command-form">
          <input
            type="text"
            value={newCommand}
            onChange={(e) => setNewCommand(e.target.value)}
            placeholder="/command"
            required
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Reply message"
            required
          />
          <button type="submit">Add Command</button>
        </form>

        <div className="command-list-container">
          <h2 className="command-list-title">Your Commands</h2>
          {commands.length === 0 ? (
            <p>No commands defined yet.</p>
          ) : (
            commands.map((cmd) => (
              <div key={cmd._id} className="command-item">
                <div className="command-details">
                  <span className="command-text">{cmd.command}</span>
                  <span className="command-message">{cmd.message}</span>
                </div>
                <div className="command-actions">
                  <button onClick={() => handleDeleteCommand(cmd._id)} className="delete-button">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CommandManagementPage;
