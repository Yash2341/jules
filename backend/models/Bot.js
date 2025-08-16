const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bot = sequelize.define('Bot', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  botId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  botUsername: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Bot;
