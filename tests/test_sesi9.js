const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe('Google Search Test', function () {
    let driver;

    it('Login sukses menampilkan inventory', async function () {
        const options = new chrome.Options();
        options.addArguments('--incognito'); // option ke chrome supaya gaada popup password nya
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.get('https://www.saucedemo.com');
        const title = await driver.getTitle();

        // assert: memastikan object sama persis
        assert.strictEqual(title, 'Swag Labs');

        // inputs
        let inputUsername = await driver.findElement(By.css('[data-test="username"]'))
        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'))
        let buttonLogin = await driver.findElement(By.css('[data-test="login-button"]'))
        await inputUsername.sendKeys('standard_user')
        await inputPassword.sendKeys('secret_sauce')
        await buttonLogin.click()
        
        // tunggu element tampil
        let buttonCart = await driver.wait(
            until.elementLocated(By.xpath('//*[@data-test="shopping-cart-link"]')), 
            10000
        );
        await driver.wait(until.elementIsVisible(buttonCart), 5000, 'Shopping cart harus tampil');
        
        // assert: elememt ada
        assert.strictEqual(await buttonCart.isDisplayed(), true, 'Shopping cart harus tampil')

        // assert: text dalam element benar
        let textAppLogo = await driver.findElement(By.className('app_logo'))
        let logotext = await textAppLogo.getText()
        assert.strictEqual(logotext, 'Swag Labs')

        await driver.sleep(1700)

        // dropdown search
        let dropdownSort = await driver.findElement(By.xpath('//select[@data-test="product-sort-container"]'))
        await dropdownSort.click()
        let option = await driver.findElement(By.xpath('//option[text()="Name (Z to A)"]'));
        await option.click();

        await driver.quit();
    });

    it('Mengurutkan produk Z-A dan verifikasi urutan', async function () {
        const options = new chrome.Options();
        options.addArguments("--headless");

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        await driver.get('https://www.saucedemo.com');

        // login terlebih dahulu
        const inputUsername = await driver.findElement(By.css('[data-test="username"]'))
        const inputPassword = await driver.findElement(By.css('[data-test="password"]'))
        const buttonLogin = await driver.findElement(By.css('[data-test="login-button"]'))
        await inputUsername.sendKeys('standard_user')
        await inputPassword.sendKeys('secret_sauce')
        await buttonLogin.click()

        // pastikan halaman inventory tampil
        const inventoryContainer = await driver.wait(
            until.elementLocated(By.css('.inventory_list')),
            10000
        );
        await driver.wait(until.elementIsVisible(inventoryContainer), 5000);

        // pilih sorting Z-A
        const dropdownSort = await driver.findElement(By.css('[data-test="product-sort-container"]'))
        await dropdownSort.click()
        const option = await driver.findElement(By.xpath('//option[text()="Name (Z to A)"]'));
        await option.click();

        // verifikasi nama produk terurut Z-A
        const titleElements = await driver.findElements(By.css('.inventory_item_name'))
        const names = []
        for (const el of titleElements) {
            names.push(await el.getText())
        }
        const sortedDesc = [...names].sort((a, b) => b.localeCompare(a))
        assert.deepStrictEqual(names, sortedDesc)

        await driver.quit()

    })
});
