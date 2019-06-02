require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
// const customParser = require('./js/custom_parser');

const { TOKEN } = process.env;
const { PROXY } = process.env;

const bot = new TelegramBot(TOKEN, {
  polling: true,
  baseApiUrl: `https://${PROXY}/api.telegram.org`
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});