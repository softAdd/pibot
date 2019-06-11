require('dotenv').config({ path: '../dev.env'});
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

async function getWeather() {
    await parser.openBrowser();
    const message = 'Погода: ' + await parser.weatherNow();
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

const Doc = require('./models/Info');

/* insert new documents in db periodically */

// mongodb, full info, every 30 mins
setInterval(async function () {
    const doc = new Doc({
        text: await getFull()
    });
    doc.save();
}, 30 * 60 * 1000)

// json file, weather, every 10 mins
setInterval(async function () {
    const doc = {
        weather: await getWeather(),
        time: `Время обновления: ${moment().format('LT')}`
    }
    fs.writeFile('current_weather.json', JSON.stringify(doc), function(err) {
        if (err) throw new Error('Возникла ошибка при записи данных в JSON файл.');
    })
}, 0.1 * 60 * 1000)

function getJSONdata() {
    fs.readFile('current_weather.json', 'utf-8', function(err, result) {
        if (err) throw new Error('Ошибка при чтении файла');
        return JSON.parse(result);
    })
}

const data = {
    // 
}

module.exports = data;