const { Bot, Command } = require('../models');
const { Telegraf } = require('telegraf');

// @desc    Add a new bot
// @route   POST /api/bots
// @access  Private
exports.addBot = async (req, res) => {
  const { token } = req.body;
  const userId = req.user.id;

  if (!token) {
    return res.status(400).json({ message: 'Bot token is required' });
  }

  try {
    const tempBot = new Telegraf(token);
    const botInfo = await tempBot.telegram.getMe();

    const botExists = await Bot.findOne({ where: { botId: botInfo.id } });
    if (botExists) {
      return res.status(400).json({ message: 'Bot already added' });
    }

    const newBot = await Bot.create({
      userId,
      token,
      botId: botInfo.id,
      botUsername: botInfo.username,
    });

    const webhookUrl = `${process.env.WEBHOOK_DOMAIN}/api/webhook/${newBot.id}`;
    await tempBot.telegram.setWebhook(webhookUrl);

    res.status(201).json(newBot);
  } catch (error) {
    console.error(error);
    if (error.response && error.response.description === 'Unauthorized') {
      return res.status(401).json({ message: 'Invalid Telegram bot token' });
    }
    res.status(500).json({ message: 'Server error while adding bot' });
  }
};

// @desc    Get user's bots
// @route   GET /api/bots
// @access  Private
exports.getBots = async (req, res) => {
  try {
    const bots = await Bot.findAll({
      where: { userId: req.user.id },
      include: [{ model: Command, as: 'Commands' }], // Sequelize defaults to plural model name
    });
    res.json(bots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a bot
// @route   DELETE /api/bots/:id
// @access  Private
exports.deleteBot = async (req, res) => {
  try {
    const bot = await Bot.findOne({ where: { id: req.params.id } });

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    if (bot.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Optional: remove webhook from Telegram
    // const tempBot = new Telegraf(bot.token);
    // await tempBot.telegram.deleteWebhook();

    await bot.destroy();

    res.json({ message: 'Bot removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
