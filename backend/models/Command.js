const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Command = sequelize.define('Command', {
  command: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT, // Using TEXT for potentially longer messages
    allowNull: false,
  },
});

module.exports = Command;
