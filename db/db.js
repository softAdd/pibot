require('dotenv').config({
    path: '../dev.env'
});
const mongoose = require('mongoose');
const TempDB = require('./temp_db/temp');
const Parser = require('../parser/parser');
const moment = require('moment');

// const {
//     CONNECT_STRING
// } = process.env;

// mongoose
//     .connect(
//         CONNECT_STRING, {
//             useNewUrlParser: true
//         }
//     )
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.log(err));

// mongoose.connect(CONNECT_STRING, {
//     useNewUrlParser: true
// })

// const Info = require('./models/Info');

// const Sub = require('./models/Sub');

// function subscribe(chatId, name) {
//     const doc = new Sub({
//         chatId: chatId,
//         name: name
//     })
//     doc.save();
// }

(async function() {
    const parser = await Parser;
    const temp_db = await TempDB;
    temp_db.createTempJSON('weather', parser.weatherNow, 10000)
})();

module.exports = {
    tempDB: TempDB,
    mongo: mongoose
}