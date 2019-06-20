const puppeteer = require('puppeteer');

let browser = null;
let page = null;

async function weatherNow() {
    await page.goto('https://pogoda.e1.ru/');

    return await page.evaluate(
        () =>  document.querySelector('.today-panel__temperature').innerText
    )
}


async function bitcoinToDollar() {
    await page.goto('https://pokur.su/btc/usd/1/');

    return await page.evaluate(
        () =>  document.querySelector('.blockquote-classic').innerText
    )
}

async function dollarToRub() {
    await page.goto('https://pokur.su/USD/rub/1/');

    return await page.evaluate(
        () =>  document.querySelector('.blockquote-classic').innerText
    )
}

const parser = {
    weatherNow: weatherNow,
    bitcoinToDollar: bitcoinToDollar,
    dollarToRub: dollarToRub
}

module.exports = (async function() {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    return parser
})();