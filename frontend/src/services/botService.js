import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bots';

const getBots = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const addBot = async (token) => {
  const response = await axios.post(API_URL, { token });
  return response.data;
};

const deleteBot = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const botService = {
  getBots,
  addBot,
  deleteBot,
};

export default botService;
