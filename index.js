require('dotenv').config({ path: 'dev.env'});
const TelegramBot = require('node-telegram-bot-api');
const ParserModule = require('./js/custom_parser');
const moment = require('moment');

const parser = new ParserModule();


const { TOKEN } = process.env;
const { PROXY } = process.env;

const bot = new TelegramBot(TOKEN, {
  polling: true,
  baseApiUrl: `https://${PROXY}/api.telegram.org`
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === '/sub') {
    (async function() {
      await parser.openBrowser();
      const weather = await parser.weatherNow();
      const btc = await parser.bitcoinToDollar();
      const dol = await parser.dollarToRub();
      const message = 'Сегодня: ' + moment().format('LLLL') + 
      '\n\nПогода: ' + weather + '\n\n' + btc + '\n' + dol;
      bot.sendMessage(chatId, message);
      await parser.closeBrowser();
    })();
  }
});