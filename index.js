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

async function getWeather() {
  await parser.openBrowser();
  const message = 'Погода: ' +  await parser.weatherNow();
  await parser.closeBrowser();
  return message
}

async function getFull() {
  await parser.openBrowser();
  const weather = await parser.weatherNow();
  const btc = await parser.bitcoinToDollar();
  const dol = await parser.dollarToRub();
  const message = 'Сегодня: ' + moment().format('LLLL') + 
  '\n\nПогода: ' + weather + '\n\n' + btc + '\n' + dol;
  await parser.closeBrowser();
  return message;
}

// const mongoose = require('./db/db');
const Doc = require('./db/models/Info');
const Sub = require('./db/models/Sub.js');

// send data to subscribers
setInterval(function() {
  if (moment().format('H') === '6') {
    // send data to subscribers
  }
}, 60 * 60 * 1000)

// insert new documents in mongo every 30 mins
setInterval(function() {
  const doc = new Doc({
    text: getFull()
  });
  doc.save();
}, 60 * 30 * 1000)

const messenger = {
  '/weather': async function() {
    // get message from db
  },
  '/full': async function() {
    // get message from db
  },
  '/sub': async function() {
    /*
    const sub = new Sub({
      chatId: this.chatId,
      name: this.name
    });
    console.log(sub)
    sub.save();
    */
   console.log('messenger')
  }
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  // messenger.msg = msg;
  // messenger.chatId = msg.chat.id;
  // messenger.name = msg.from.first_name;
  (async function() {
    if (messenger[msg.text]) {
      bot.sendMessage(chatId, await messenger[msg.text]());
    }
  })();
});