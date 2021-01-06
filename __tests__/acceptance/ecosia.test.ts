import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { UserPage, perform } from '../../lib';

xdescribe('Ecosia', () => {
  let browser: Browser;
  let page: Page;
  let context: BrowserContext;
  let ui: UserPage;
  beforeAll(async () => {
    jest.setTimeout(60 * 1000);
    browser = await chromium.launch({ headless: false, slowMo: 50 });
    context = await browser.newContext();
    page = await context.newPage();
    ui = new UserPage(
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
    await ui.goto('https://www.ecosia.org/');

    // await (await tryToGetPage().waitForSelector('[name=q]')).type('github yashaka selene');
    const query = ui.$('[name=q]');
    // await query.type('github yashaka selene');

    // await (await tryToGetPage().$('[name=q]')).press('Enter');
    // await query.press('Enter');

    await query.type('github yashaka selene').then(perform.press('Enter'));

    await page.waitForTimeout(4000);

    // await element('[name=q]').type('github yashaka selene')
    //     .then(perform.press('Enter'));

    const results = ui.$('.result');

    // await (await stage.page.waitForSelector(
    // '.result >> xpath=.//*[contains(@class, "result-title") and contains(text(), "yashaka/selene")]')).click()
  });
});
