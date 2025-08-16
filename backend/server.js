const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize, syncModels } = require('./models');

const authRoutes = require('./routes/authRoutes');
const botRoutes = require('./routes/botRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/webhook', webhookRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to MySQL has been established successfully.');

    await syncModels();
    console.log('All models were synchronized successfully.');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Unable to connect to the database or start the server:', error);
  }
};

startServer();
