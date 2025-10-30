const { By } = require('selenium-webdriver');

const page_login = {
  inputUsername: By.css('[data-test="username"]'),
  inputPassword: By.css('[data-test="password"]'),
  buttonLogin: By.css('[data-test="login-button"]'),
  appLogo: By.className('app_logo'),
  shoppingCartLink: By.xpath('//*[@data-test="shopping-cart-link"]')
};

module.exports = page_login;