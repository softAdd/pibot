const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    schedule: {
        type: String
    },
    weatherNow: {
        type: String,
        required: true
    },
    weatherThreeDays: {
        type: String
    },
    bitcoinToDollar: {
        type: String
    },
    dollarToRub: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Daily', ItemSchema);