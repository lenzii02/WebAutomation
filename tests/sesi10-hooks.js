const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe('Google Search Test', function () {
    let driver;

    before(async function () {
        const options = new chrome.Options();
        options.addArguments('--headless', '--incognito');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        await driver.get('https://www.saucedemo.com');
        const inputUsername = await driver.findElement(By.css('[data-test="username"]'));
        const inputPassword = await driver.findElement(By.css('[data-test="password"]'));
        const buttonLogin = await driver.findElement(By.css('[data-test="login-button"]'));

        await inputUsername.sendKeys('standard_user');
        await inputPassword.sendKeys('secret_sauce');
        await buttonLogin.click();

        await driver.wait(until.elementLocated(By.css('.inventory_list')), 10000);
    });

    after(async function () {
        await driver.quit();
    });

    beforeEach(async function () {
        await driver.navigate().refresh();
    });

    it('Login sukses menampilkan inventory', async function () {
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');
    });

    it('Mengurutkan produk Z-A dan verifikasi urutan', async function () {
        const dropdownSort = await driver.findElement(By.css('[data-test="product-sort-container"]'));
        await dropdownSort.click();
        const option = await driver.findElement(By.xpath('//option[text()="Name (Z to A)"]'));
        await option.click();

        const titleElements = await driver.findElements(By.css('.inventory_item_name'));
        const names = [];
        for (const el of titleElements) names.push(await el.getText());

        const sortedDesc = [...names].sort((a, b) => b.localeCompare(a));
        assert.deepStrictEqual(names, sortedDesc);
    });
});
