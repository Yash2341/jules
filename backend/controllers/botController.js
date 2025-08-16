const Bot = require('../models/Bot');
const { Telegraf } = require('telegraf');

// @desc    Add a new bot
// @route   POST /api/bots
// @access  Private
exports.addBot = async (req, res) => {
  const { token } = req.body;
  const user = req.user._id;

  if (!token) {
    return res.status(400).json({ message: 'Bot token is required' });
  }

  try {
    // Verify token with Telegram API
    const tempBot = new Telegraf(token);
    const botInfo = await tempBot.telegram.getMe();

    // Check if bot already exists
    const botExists = await Bot.findOne({ botId: botInfo.id });
    if (botExists) {
      return res.status(400).json({ message: 'Bot already added' });
    }

    const newBot = new Bot({
      user,
      token,
      botId: botInfo.id,
      botUsername: botInfo.username,
    });

    const savedBot = await newBot.save();

    // Set webhook
    const webhookUrl = `${process.env.WEBHOOK_DOMAIN}/api/webhook/${savedBot.id}`;
    await tempBot.telegram.setWebhook(webhookUrl);

    res.status(201).json(savedBot);
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
    const bots = await Bot.find({ user: req.user._id });
    res.json(bots);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a bot
// @route   DELETE /api/bots/:id
// @access  Private
exports.deleteBot = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    // Check if the bot belongs to the user
    if (bot.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await bot.deleteOne();

    // Optional: remove webhook from Telegram
    // const tempBot = new Telegraf(bot.token);
    // await tempBot.telegram.deleteWebhook();

    res.json({ message: 'Bot removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
