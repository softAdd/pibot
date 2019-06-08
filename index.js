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
    await parser.openBrowser();
    const message = 'Погода: ' +  await parser.weatherNow();
    await parser.closeBrowser();
    return message
  },
  '/full': async function() {
    await parser.openBrowser();
    const weather = await parser.weatherNow();
    const btc = await parser.bitcoinToDollar();
    const dol = await parser.dollarToRub();
    const message = 'Сегодня: ' + moment().format('LLLL') + 
    '\n\nПогода: ' + weather + '\n\n' + btc + '\n' + dol;
    await parser.closeBrowser();
    return message;
  },
  '/sub': async function() {
    // todo
  }
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  (async function() {
    if (messenger[msg.text]) {
      bot.sendMessage(chatId, await messenger[msg.text]());
    }
  })();
});