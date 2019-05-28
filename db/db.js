const mongoose = require('mongoose');
const ParserModule = require('../parser/custom_parser');
const parser = new ParserModule();

mongoose.connect(`mongodb://mongo:27017/daily`, {
    useNewUrlParser: true
})

const DailyData = require('./models/daily');