require('dotenv').config({
  path: 'dev.env'
});
const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');
// const db = require('./db/db');

const {
  PROXY,
  TOKEN
} = process.env;

const bot = new TelegramBot(TOKEN, {
  polling: true,
  baseApiUrl: `https://${PROXY}/api.telegram.org`
});

// 
// const message = 'Погода: ' + await parser.weatherNow();

// send data to subscribers
setInterval(function () {
  if (moment().format('H') === '6') {
    // send data to subscribers
  }
}, 60 * 60 * 1000)


const messenger = {
  '/weather': async function (chatId) {
    const weatherDoc = JSON.parse(await db.readTemp('weather'));
    const message = `Сегодня: ${weatherDoc.weather}.\nВремя обновления: ${weatherDoc.time}.\nГород: ${weatherDoc.city}.`
    bot.sendMessage(chatId, message);
  },
  '/full': async function (chatId) {
    const weatherDoc = JSON.parse(await db.readTemp('weather'));
    const weather = weatherDoc.weather;
    const btc = '';
    const dol = '';
    const message = 'Сегодня: ' + moment().format('LLLL') + '\n\nПогода: ' + weather + '\n\n' + btc + '\n' + dol;
    bot.sendMessage(chatId, message);
  },
  '/sub': async function (chatId) {
    /*
    const sub = new Sub({
      chatId: this.chatId,
      name: this.name
    });
    console.log(sub)
    sub.save();
    */
   bot.sendMessage(chatId, 'Вы подписались на рассылку погоды!');
  }
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log('Message received')
  // messenger.msg = msg;
  // messenger.chatId = msg.chat.id;
  // messenger.name = msg.from.first_name;
  (async function () {
    if (messenger[msg.text]) {
      await messenger[msg.text](chatId)
    }
  })();
});