const fs = require('fs');

const data = {
    static: [],
    temp: []
};

const db = {
    createTempJSON: createTempJSON,
    readTemp: readTemp,
    delTemp: delTemp,
    timers: [],
    createStatic: createStatic,
    readStatic: readStatic,
    delStatic: delStatic,
    appendData: appendData,
    getData: function () {
        return data;
    }
}

function initDB() {
    return new Promise(async function (resolve, reject) {
        // read temp data
        await fs.stat(`${__dirname}/temp_data`, function (err, stat) {
            if (err == null) {
                console.log('temp_data загружена.');
            } else if (err.code == 'ENOENT') {
                // dir does not exist
                fs.mkdir(`${__dirname}/temp_data`, (err) => {
                    if (err) throw err;
                });
                console.log('temp_data создана.');
            } else {
                console.log('Ошибка во время запуска temp_db (temp_data): ', err.code);
            }

            // assign file names to local variables (temp)
            fs.readdir(`${__dirname}/temp_data`, async function (err, files) {
                if (err) throw new Error('Ошибка при чтении файлов.');
                data.temp = files.slice();

                // read static data
                await fs.stat(`${__dirname}/static_data`, function (err, stat) {
                    if (err == null) {
                        console.log('static_data загружена.');
                    } else if (err.code == 'ENOENT') {
                        // dir does not exist
                        fs.mkdir(`${__dirname}/static_data`, (err) => {
                            if (err) throw err;
                        });
                        console.log('static_data создана.');
                    } else {
                        console.log('Ошибка во время запуска temp_db (static_data): ', err.code);
                    }

                    // assign file names to local variables (static)
                    fs.readdir(`${__dirname}/static_data`, function (err, files) {
                        if (err) throw new Error('Ошибка при чтении файлов.');
                        data.static = files.slice();
                        resolve(db);
                    });
                });
            });
        });
    })
}

function createTempJSON(file_name, func, time) {
    return new Promise(async function (resolve) {
        let obj = await func();

        async function updateFile(name, data) {
            await fs.writeFile(`${__dirname}/temp_data/${name}.json`, JSON.stringify(data), function (err) {
                if (err) throw new Error('Во время записи в файл произошла ошибка!')
            });
        }
        await updateFile(file_name, obj);
        let timer = setInterval(async function () {
            obj = await func();
            updateFile(file_name, obj);
        }, time);
        db.timers.push(timer);
        if (data.temp.indexOf(file_name + '.json') === -1) {
            data.temp.push(file_name + '.json');
        }
        resolve();
    })
}

function createStatic(file_name, text) {
    return new Promise(async function (resolve, reject) {
        fs.writeFile(`${__dirname}/static_data/${file_name}`, text, function (err) {
            if (err) throw new Error('Во время записи в файл произошла ошибка!')
            if (data.static.indexOf(file_name) === -1) {
                data.static.push(file_name);
            }
            setTimeout(resolve, 4);
        });
    })
}

function appendData(file_name, text, static = true) {
    return new Promise(function (resolve, reject) {
        let path = __dirname + '/static_data/';
        if (static === false) {
            path = _dirname + '/temp_data/';
            file_name += '.json';
            text = JSON.stringify(text);
        }

        fs.stat(path, function (err, stat) {
            if (err == null) {
                fs.appendFile(path + file_name, text, (err) => {
                    if (err) throw err;
                    setTimeout(resolve, 4);
                });
            } else if (err.code == 'ENOENT') {
                fs.writeFile(path + file_name, text, (err) => {
                    if (err) throw err;
                });

                if (static === true) {
                    data.static.push(file_name);
                } else {
                    data.temp.push(file_name);
                }
                console.log(`${file_name} не найден и был создан.`);
                setTimeout(resolve, 4);
            }
        });
    });
}

function readStatic(file_name) {
    return new Promise(function (resolve) {
        fs.readFile(`${__dirname}/static_data/${file_name}`, 'utf-8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error(`${file_name} does not exist`);
                    return;
                }
                throw err;
            }
            resolve(data);
        });
    })
}

function readTemp(file_name) {
    return new Promise(function (resolve) {
        fs.readFile(`${__dirname}/temp_data/${file_name}.json`, 'utf-8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error(`${file_name} does not exist`);
                    return;
                }
                throw err;
            }
            resolve(JSON.parse(data));
        });
    });
}

function delStatic(file_name) {
    fs.unlink(`${__dirname}/temp_data/${file_name}`, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error(`${file_name} does not exist`);
                return;
            }
            throw err;
        }
    });
}

function delTemp(file_name) {
    fs.unlink(`${__dirname}/temp_data/${file_name}.json`, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error(`${file_name} does not exist`);
                return;
            }
            throw err;
        }
    });
}

module.exports = initDB;