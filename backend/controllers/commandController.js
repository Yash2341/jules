const { Bot, Command } = require('../models');

// Helper function to check bot ownership
const checkBotOwnership = async (botId, userId) => {
  const bot = await Bot.findOne({ where: { id: botId, userId } });
  return bot;
};

// @desc    Add a command to a bot
// @route   POST /api/bots/:botId/commands
// @access  Private
exports.addCommand = async (req, res) => {
  const { command, message } = req.body;
  const { botId } = req.params;
  const userId = req.user.id;

  try {
    const bot = await checkBotOwnership(botId, userId);
    if (!bot) {
      return res.status(401).json({ message: 'Not authorized or bot not found' });
    }

    const commandExists = await Command.findOne({ where: { command, botId } });
    if (commandExists) {
      return res.status(400).json({ message: 'Command already exists for this bot' });
    }

    const newCommand = await Command.create({
      command,
      message,
      botId,
    });

    res.status(201).json(newCommand);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a bot command
// @route   PUT /api/bots/:botId/commands/:commandId
// @access  Private
exports.updateCommand = async (req, res) => {
  const { command, message } = req.body;
  const { botId, commandId } = req.params;
  const userId = req.user.id;

  try {
    const bot = await checkBotOwnership(botId, userId);
    if (!bot) {
      return res.status(401).json({ message: 'Not authorized or bot not found' });
    }

    const commandToUpdate = await Command.findOne({ where: { id: commandId, botId } });
    if (!commandToUpdate) {
      return res.status(404).json({ message: 'Command not found' });
    }

    commandToUpdate.command = command || commandToUpdate.command;
    commandToUpdate.message = message || commandToUpdate.message;

    await commandToUpdate.save();
    res.json(commandToUpdate);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a bot command
// @route   DELETE /api/bots/:botId/commands/:commandId
// @access  Private
exports.deleteCommand = async (req, res) => {
  const { botId, commandId } = req.params;
  const userId = req.user.id;

  try {
    const bot = await checkBotOwnership(botId, userId);
    if (!bot) {
      return res.status(401).json({ message: 'Not authorized or bot not found' });
    }

    const commandToDelete = await Command.findOne({ where: { id: commandId, botId } });
    if (!commandToDelete) {
      return res.status(404).json({ message: 'Command not found' });
    }

    await commandToDelete.destroy();
    res.json({ message: 'Command removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
