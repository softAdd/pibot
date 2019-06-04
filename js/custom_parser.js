const puppeteer = require('puppeteer');

async function weatherNow() {
    const page = await this.browser.newPage();
    await page.goto('https://pogoda.e1.ru/');

    return await page.evaluate(
        () => document.querySelector('.today-panel__temperature').innerText
    )
}

async function weatherThreeDays() {
    const page = await this.browser.newPage();
    await page.goto('https://pogoda.e1.ru/');

    return await page.evaluate(
        () => document.querySelector('.pgd-short-cards').innerText
    )
}

async function universitySchedule() {
    const page = await this.browser.newPage();
    await page.goto('https://www.rsvpu.ru/raspisanie-zanyatij-ochnoe-otdelenie/?v_gru=2731');

    return await page.evaluate(
        () => document.getElementById('tametable_tab9').innerText
    )
}

async function todayUniversitySchedule() {
    const page = await this.browser.newPage();
    await page.goto('https://www.rsvpu.ru/mobile/?v_gru=2731');
    const date = await page.evaluate(
        () => document.querySelector('.dateToday').innerText
    )
    const schedule = await page.evaluate(
        () => document.querySelector('.tableRasp').innerText
    )
    return date + '\n' + schedule
}

async function bitcoinToDollar() {
    const page = await this.browser.newPage();
    await page.goto('https://pokur.su/btc/usd/1/');

    return await page.evaluate(
        () => document.querySelector('.blockquote-classic').innerText
    )
}

async function dollarToRub() {
    const page = await this.browser.newPage();
    await page.goto('https://pokur.su/USD/rub/1/');

    return await page.evaluate(
        () => document.querySelector('.blockquote-classic').innerText
    )
}

function moduleStruct() {
    this.browser = null;
    this.browser_running = false;
    this.openBrowser = async function () {
        this.browser = await puppeteer.launch();
        this.browser_running = true;
    };
    this.closeBrowser = function () {
        this.browser = null;
        this.browser_running = false;
    };
    this.weatherNow = weatherNow;
    this.weatherThreeDays = weatherThreeDays;
    this.dollarToRub = dollarToRub;
    this.bitcoinToDollar = bitcoinToDollar;
    this.universitySchedule = universitySchedule;
    this.todayUniversitySchedule = todayUniversitySchedule;
}

module.exports = moduleStruct;