import { chromium, BrowserContext } from 'playwright';
import { Stage, perform } from '../../lib';

describe('Ecosia', () => {
  let stage: Stage;
  beforeAll(async () => {
    jest.setTimeout(60 * 1000);
    const browser = await chromium.launch({ headless: false, slowMo: 50 });
    const context = await browser.newContext();
    const page = await context.newPage();
    stage = new Stage({
      browser,
      context,
      page,
      timeout: 5000,
    });
    /* the following is true by default */
    // director.assign({ launchOptions: { headless: false } });
  });
  afterAll(async () => {
    await stage.options.browser.close();
  });

  it('should search', async () => {
    await stage.goto('https://www.ecosia.org/');

    // await (await tryToGetPage().waitForSelector('[name=q]')).type('github yashaka selene');
    const query = stage.$('[name=q]');
    // await query.type('github yashaka selene');

    // await (await tryToGetPage().$('[name=q]')).press('Enter');
    // await query.press('Enter');

    await query.type('github yashaka selene').then(perform.press('Enter'));

    await stage.options.page.waitForTimeout(4000);

    // await element('[name=q]').type('github yashaka selene')
    //     .then(perform.press('Enter'));

    const results = stage.$('.result');

    // await (await stage.page.waitForSelector(
    // '.result >> xpath=.//*[contains(@class, "result-title") and contains(text(), "yashaka/selene")]')).click()
  });
});
