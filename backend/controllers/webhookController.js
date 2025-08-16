const Bot = require('../models/Bot');
const { Telegraf } = require('telegraf');

exports.handleUpdate = async (req, res) => {
  const { botId } = req.params;
  const update = req.body;

  try {
    const bot = await Bot.findById(botId);
    if (!bot) {
      // Bot not found, but we should still send a 200 to Telegram
      // to prevent it from resending the update.
      return res.sendStatus(200);
    }

    // Extract command from the update
    if (update.message && update.message.text) {
      const text = update.message.text;
      const commandMatch = text.match(/^\/(\w+)/);

      if (commandMatch) {
        const commandStr = "/" + commandMatch[1];

        // Find the custom command in our database
        const customCommand = bot.commands.find(c => c.command === commandStr);

        if (customCommand) {
          // If a custom command is found, use Telegraf to reply
          const telegrafBot = new Telegraf(bot.token);
          await telegrafBot.telegram.sendMessage(update.message.chat.id, customCommand.message);
        }
      }
    }

    // Always respond to Telegram with a 200 OK
    res.sendStatus(200);
  } catch (error)
  {
    console.error(`Webhook error for bot ${botId}:`, error);
    // Even if there's an error, send a 200 to Telegram
    res.sendStatus(200);
  }
};
