require('dotenv').config({
    path: '../dev.env'
});
const mongoose = require('mongoose');
const moment = require('moment');
const fs = require('fs');
const ParserModule = require('../js/custom_parser');
const parser = new ParserModule();

const {
    CONNECT_STRING
} = process.env;

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



const Info = require('./models/Info');

async function getCurrentWeather() {
    let text = fs.readFileSync(rootPath + '/current_weather.json', 'utf8');
    return JSON.parse(text).weather + '\n' + JSON.parse(text).time;
}

const Sub = require('./models/Sub');

function subscribe(chatId, name) {
    const doc = new Sub({
        chatId: chatId,
        name: name
    })
    doc.save();
}

let rootPath = '';
let options = {
    fullInfo_timer: 0,
    weather_timer: 0
}

function initDb(path, opt) {
    rootPath = path;
    optionts = opt;
    if (options.fullInfo_timer !== 0 && options.fullInfo_timer > 0) {
        setInterval(async function () {
            const doc = new Info({
                text: await parser.messageFull()
            });
            doc.save();
        }, fullInfo_timer)
    }
    if (options.weather_timer !== 0 && options.weather_timer > 0) {
        setInterval(async function () {
            try {
                const doc = {
                    weather: await parser.messageWeather(),
                    time: `Время обновления: ${moment().format('LT')}`
                }
                await fs.writeFile(rootPath + '/current_weather.json', JSON.stringify(doc), function (err) {
                    if (err) throw new Error('Возникла ошибка при записи данных в JSON файл.');
                })
            } catch (e) {
                console.log(e)
            }
        }, weather_timer)
    }
}

function MyDb(path, options) {
    initDb(path, options);
    this.full = parser.messageFull;
    this.weather = getCurrentWeather;
    this.mongo = mongoose;
    this.sub = subscribe;
    this.parser = parser;
}

module.exports = MyDb;