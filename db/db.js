require('dotenv').config({
    path: '../dev.env'
});
const mongoose = require('mongoose');
const moment = require('moment');
const fs = require('fs');
const ParserModule = require('../js/custom_parser');
const parser = new ParserModule();

const { CONNECT_STRING } = process.env;

mongoose
    .connect(
        CONNECT_STRING, {
            useNewUrlParser: true
        }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

mongoose.connect(CONNECT_STRING, {
    useNewUrlParser: true
})

async function createWeather() {
    await parser.openBrowser();
    const message = 'Погода: ' + await parser.weatherNow();
    await parser.closeBrowser();
    return message
}

async function createFull() {
    await parser.openBrowser();
    const weather = await parser.weatherNow();
    const btc = await parser.bitcoinToDollar();
    const dol = await parser.dollarToRub();
    const message = 'Сегодня: ' + moment().format('LLLL') +
        '\n\nПогода: ' + weather + '\n\n' + btc + '\n' + dol;
    await parser.closeBrowser();
    return message;
}

const Info = require('./models/Info');

// mongodb, full info, every 30 mins
setInterval(async function () {
    const doc = new Info({
        text: await createFull()
    });
    doc.save();
}, 30 * 60 * 1000)

let count = 0;

// json file, weather, every 10 mins
setInterval(async function () {
    try {
        console.log(++count)
        const doc = {
            weather: await createWeather(),
            time: `Время обновления: ${moment().format('LT')}`
        }
        await fs.writeFile('current_weather.json', JSON.stringify(doc), function (err) {
            if (err) throw new Error('Возникла ошибка при записи данных в JSON файл.');
        })
    } catch(e) {
        console.log(e)
    }
    console.log(--count)
}, 10000)

function getCurrentWeather() {
    fs.readFile('current_weather.json', 'utf-8', function (err, result) {
        if (err) throw new Error('Ошибка при чтении файла');
        return JSON.parse(result);
    })
}

const Sub = require('./models/Sub');

function subscribe(chatId, name) {
    const doc = new Sub({
        chatId: chatId,
        name: name
    })
    doc.save();
}

module.exports = {
    full: createFull,
    weather: getCurrentWeather,
    mongo: mongoose,
    sub: subscribe,
    parser: parser
}