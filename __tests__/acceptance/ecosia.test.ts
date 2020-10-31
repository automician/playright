import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { Stage, perform } from '../../lib';

xdescribe('Ecosia', () => {
  let browser: Browser;
  let page: Page;
  let context: BrowserContext;
  let stage: Stage;
  beforeAll(async () => {
    jest.setTimeout(60 * 1000);
    browser = await chromium.launch({ headless: false, slowMo: 50 });
    context = await browser.newContext();
    page = await context.newPage();
    stage = new Stage(
      page,
      {
        timeout: 5000,
      },
    );
    /* the following is true by default */
    // director.assign({ launchOptions: { headless: false } });
  });
  afterAll(async () => {
    await browser.close();
  });

  it('should search', async () => {
    await stage.goto('https://www.ecosia.org/');

    // await (await tryToGetPage().waitForSelector('[name=q]')).type('github yashaka selene');
    const query = stage.$('[name=q]');
    // await query.type('github yashaka selene');

    // await (await tryToGetPage().$('[name=q]')).press('Enter');
    // await query.press('Enter');

    await query.type('github yashaka selene').then(perform.press('Enter'));

    await page.waitForTimeout(4000);

    // await element('[name=q]').type('github yashaka selene')
    //     .then(perform.press('Enter'));

    const results = stage.$('.result');

    // await (await stage.page.waitForSelector(
    // '.result >> xpath=.//*[contains(@class, "result-title") and contains(text(), "yashaka/selene")]')).click()
  });
});
