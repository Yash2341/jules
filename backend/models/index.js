const sequelize = require('../config/database');
const User = require('./User');
const Bot = require('./Bot');
const Command = require('./Command');

// Define relationships
User.hasMany(Bot, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Bot.belongsTo(User, {
  foreignKey: 'userId',
});

Bot.hasMany(Command, {
  foreignKey: 'botId',
  onDelete: 'CASCADE',
});
Command.belongsTo(Bot, {
  foreignKey: 'botId',
});

// Sync all models
const syncModels = async () => {
  await sequelize.sync({ alter: true }); // Use alter: true to update tables, or force: true to drop and recreate
  console.log('All models were synchronized successfully.');
};

module.exports = {
  sequelize,
  syncModels,
  User,
  Bot,
  Command,
};
