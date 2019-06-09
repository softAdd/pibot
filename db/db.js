const mongoose = require('mongoose');

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

module.exports = mongoose