require('dotenv').config({ path: 'dev.env'});
const TelegramBot = require('node-telegram-bot-api');
const ParserModule = require('./js/custom_parser');
const moment = require('moment');

const parser = new ParserModule();

setInterval(function() {
  if (moment().format('H') === '6') {
    // send data to subscribers
  }
}, 60 * 60 * 1000)

const { TOKEN } = process.env;
const { PROXY } = process.env;

const bot = new TelegramBot(TOKEN, {
  polling: true,
  baseApiUrl: `https://${PROXY}/api.telegram.org`
});

const messenger = {
  '/weather': async function() {
    // code
  },
  weather: async function() {
    await parser.openBrowser();
    const message = 'Погода: ' +  await parser.weatherNow();
    // bot.sendMessage(chatId, message);
    await parser.closeBrowser();
  },
  full: async function() {
    await parser.openBrowser();
    const weather = await parser.weatherNow();
    const btc = await parser.bitcoinToDollar();
    const dol = await parser.dollarToRub();
    const message = 'Сегодня: ' + moment().format('LLLL') + 
    '\n\nПогода: ' + weather + '\n\n' + btc + '\n' + dol;
    // bot.sendMessage(chatId, message);
    await parser.closeBrowser();
  },
  sub: async function() {
    // code
  }
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  // use messenger[message] here
});