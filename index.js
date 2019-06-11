require('dotenv').config({ path: 'dev.env'});
const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');

const { TOKEN } = process.env;
const { PROXY } = process.env;

const bot = new TelegramBot(TOKEN, {
  polling: true,
  baseApiUrl: `https://${PROXY}/api.telegram.org`
});

// const mongoose = require('./db/db');

const Sub = require('./db/models/Sub.js');

// send data to subscribers
setInterval(function() {
  if (moment().format('H') === '6') {
    // send data to subscribers
  }
}, 60 * 60 * 1000)


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