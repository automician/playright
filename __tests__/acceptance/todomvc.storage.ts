import { chromium, BrowserContext, Browser, Page } from 'playwright';
import { UserPage, perform, have } from '../../lib';

xdescribe('Todomvc Storage', () => {
  let browser: Browser;
  let page: Page;
  let context: BrowserContext;
  let ui: UserPage;
  beforeAll(async () => {
    jest.setTimeout(60 * 1000);
    const browser = await chromium.launch({ headless: false, slowMo: 50 });
    const context = await browser.newContext();
    const page = await context.newPage();
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

  it('should not share todos among different users (simulating by different browser contexts)', async () => {
    await ui.goto('http://todomvc.com/examples/emberjs');
    await ui
      .$('#new-todo')
      .type('a')
      .then(perform.press('Enter'));
    await ui.$$('#todo-list li').should(have.count(1));

    // const another = await director.newContext();
    // await another.page.stage.goto('http://todomvc.com/examples/emberjs');

    // await another.stage.$('#todo-list li').should(have.count(0));
  });

  it('should not share todos among different browsers', async () => {
    await ui.goto('http://todomvc.com/examples/emberjs');
    await ui
      .$('#new-todo')
      .type('a')
      .then(perform.press('Enter'));
    await ui.$$('#todo-list li').should(have.count(1));

    // const another = await director.newBrowser();
    // await another.page.stage.goto('http://todomvc.com/examples/emberjs');

    // await another.stage.$('#todo-list li').should(have.count(0));
  });

  it('should share todos among different tabs', async () => {
    await ui.goto('http://todomvc.com/examples/emberjs');
    await ui
      .$('#new-todo')
      .type('a')
      .then(perform.press('Enter'));
    await ui.$$('#todo-list li').should(have.texts('a'));

    // const another = await director.newPage();
    // await another.page.stage.goto('http://todomvc.com/examples/emberjs');

    // await stage.$$('#todo-list li').should(have.texts('a'));
  });
});
