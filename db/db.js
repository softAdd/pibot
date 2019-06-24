require('dotenv').config({
    path: '../dev.env'
});
const mongoose = require('mongoose');
const TempDB = require('./temp_db/temp');
const Parser = require('../parser/parser');
const moment = require('moment');

const {
    CONNECT_STRING
} = process.env;

mongoose.connect(CONNECT_STRING, {
    useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// const Info = require('./models/Info');

// const Sub = require('./models/Sub');

// function subscribe(chatId, name) {
//     const doc = new Sub({
//         chatId: chatId,
//         name: name
//     })
//     doc.save();
// }

// auto update weather every 15 mins
(async function () {
    const parser = await Parser;
    const temp_db = await TempDB;
    console.log(await temp_db.readFile('weather.json', 'temp'));
    moment.locale('ru');
    temp_db.createTempJSON('weather', async function() {
        return {
            weather: await parser.weatherNow(),
            time: moment().format('LT')
        }
    }, 15 * 60 * 1000)
})();

module.exports = {
    tempDB: TempDB,
    mongo: mongoose
}