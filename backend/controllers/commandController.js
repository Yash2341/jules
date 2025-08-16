const Bot = require('../models/Bot');

// @desc    Add a command to a bot
// @route   POST /api/bots/:botId/commands
// @access  Private
exports.addCommand = async (req, res) => {
  const { command, message } = req.body;
  const { botId } = req.params;

  try {
    const bot = await Bot.findById(botId);

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    // Check if the bot belongs to the user
    if (bot.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if command already exists
    const commandExists = bot.commands.find((c) => c.command === command);
    if (commandExists) {
      return res.status(400).json({ message: 'Command already exists' });
    }

    bot.commands.push({ command, message });
    await bot.save();
    res.status(201).json(bot.commands);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a bot command
// @route   PUT /api/bots/:botId/commands/:commandId
// @access  Private
exports.updateCommand = async (req, res) => {
  const { command, message } = req.body;
  const { botId, commandId } = req.params;

  try {
    const bot = await Bot.findById(botId);

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    if (bot.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const commandToUpdate = bot.commands.id(commandId);
    if (!commandToUpdate) {
      return res.status(404).json({ message: 'Command not found' });
    }

    commandToUpdate.command = command || commandToUpdate.command;
    commandToUpdate.message = message || commandToUpdate.message;

    await bot.save();
    res.json(bot.commands);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a bot command
// @route   DELETE /api/bots/:botId/commands/:commandId
// @access  Private
exports.deleteCommand = async (req, res) => {
  const { botId, commandId } = req.params;

  try {
    const bot = await Bot.findById(botId);

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    if (bot.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const commandToDelete = bot.commands.id(commandId);
    if (!commandToDelete) {
      return res.status(404).json({ message: 'Command not found' });
    }

    commandToDelete.deleteOne();

    await bot.save();
    res.json({ message: 'Command removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
