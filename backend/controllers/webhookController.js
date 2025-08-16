const { Bot, Command } = require('../models');
const { Telegraf } = require('telegraf');

exports.handleUpdate = async (req, res) => {
  const { botId } = req.params;
  const update = req.body;

  try {
    const bot = await Bot.findOne({ where: { id: botId } });
    if (!bot) {
      return res.sendStatus(200);
    }

    if (update.message && update.message.text) {
      const text = update.message.text;
      const commandMatch = text.match(/^\/(\w+)/);

      if (commandMatch) {
        const commandStr = "/" + commandMatch[1];

        const customCommand = await Command.findOne({
          where: { command: commandStr, botId: bot.id },
        });

        if (customCommand) {
          const telegrafBot = new Telegraf(bot.token);
          await telegrafBot.telegram.sendMessage(update.message.chat.id, customCommand.message);
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(`Webhook error for bot ${botId}:`, error);
    res.sendStatus(200);
  }
};
