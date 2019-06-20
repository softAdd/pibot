const fs = require('fs');

function initDB() {
    let is_running = true;
    fs.stat(`${__dirname}/temp_data`, function (err, stat) {
        if (err == null) {
            console.log('temp_data загружена.');
        } else if (err.code == 'ENOENT') {
            // file does not exist
            fs.mkdir(`${__dirname}/temp_data`, (err) => {
                if (err) throw err;
            });
            console.log('temp_data создана.');
        } else {
            console.log('Ошибка во время запуска temp_db (temp_data): ', err.code);
        }
    });
    fs.stat(`${__dirname}/static_data`, function (err, stat) {
        if (err == null) {
            console.log('static_data загружена.');
        } else if (err.code == 'ENOENT') {
            // file does not exist
            fs.mkdir(`${__dirname}/static_data`, (err) => {
                if (err) throw err;
            });
            console.log('static_data создана.');
        } else {
            console.log('Ошибка во время запуска temp_db (static_data): ', err.code);
        }
    });
    console.log('temp_db запущена.')
}

async function createTempJSON(file_name, func, time) {
    let obj = await func();

    function updateFile(name, obj) {
        fs.writeFile(`${__dirname}/temp_data/${file_name}.json`, JSON.stringify(obj), function (err) {
            if (err) throw new Error('Во время записи в файл произошла ошибка!')
        });
    }
    await updateFile(file_name, obj);

    setInterval(async function () {
        obj = await func();
        updateFile(name, obj);
    }, time);
}

function createStatic(file, data) {
    fs.writeFile(`${__dirname}/static_data/${file}`, data, function (err) {
        if (err) throw new Error('Во время записи в файл произошла ошибка!')
    });
}

function appendData(file_name, data, static = true) {
    let path = __dirname + '/static_data/';
    if (static === false) {
        path = _dirname + '/temp_data/';
        file_name += '.json';
        data = JSON.stringify(data);
    }

    fs.stat(path, function (err, stat) {
        if (err == null) {
            fs.appendFile(path + file_name, data, (err) => {
                if (err) throw err;
            });
        } else if (err.code == 'ENOENT') {
            fs.writeFile(path + file_name, data, (err) => {
                if (err) throw err;
            });
            console.log(`${file_name} не найден и был создан.`);
        }
    });
}

module.exports = function () {
    initDB();
    this.createTempJSON = createTempJSON;
    this.createStatic = createStatic;
    this.appendData = appendData;
}