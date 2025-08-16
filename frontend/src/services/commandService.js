import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bots';

// Note: The backend doesn't have a dedicated "get commands" endpoint.
// Commands are fetched as part of the bot object.

const addCommand = async (botId, command, message) => {
  const response = await axios.post(`${API_URL}/${botId}/commands`, {
    command,
    message,
  });
  return response.data;
};

const updateCommand = async (botId, commandId, command, message) => {
  const response = await axios.put(`${API_URL}/${botId}/commands/${commandId}`, {
    command,
    message,
  });
  return response.data;
};

const deleteCommand = async (botId, commandId) => {
  const response = await axios.delete(`${API_URL}/${botId}/commands/${commandId}`);
  return response.data;
};

const commandService = {
  addCommand,
  updateCommand,
  deleteCommand,
};

export default commandService;
