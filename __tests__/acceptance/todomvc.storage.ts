import { chromium, BrowserContext } from 'playwright';
import { Stage, perform, have } from '../../lib';

describe('Todomvc Storage', () => {
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

  it('should not share todos among different users (simulating by different browser contexts)', async () => {
    await stage.goto('http://todomvc.com/examples/emberjs');
    await stage
      .$('#new-todo')
      .type('a')
      .then(perform.press('Enter'));
    await stage.$$('#todo-list li').should(have.count(1));

    // const another = await director.newContext();
    // await another.page.stage.goto('http://todomvc.com/examples/emberjs');

    // await another.stage.$('#todo-list li').should(have.count(0));
  });

  it.skip('should not share todos among different browsers', async () => {
    await stage.goto('http://todomvc.com/examples/emberjs');
    await stage
      .$('#new-todo')
      .type('a')
      .then(perform.press('Enter'));
    await stage.$$('#todo-list li').should(have.count(1));

    // const another = await director.newBrowser();
    // await another.page.stage.goto('http://todomvc.com/examples/emberjs');

    // await another.stage.$('#todo-list li').should(have.count(0));
  });

  it.skip('should share todos among different tabs', async () => {
    await stage.goto('http://todomvc.com/examples/emberjs');
    await stage
      .$('#new-todo')
      .type('a')
      .then(perform.press('Enter'));
    await stage.$$('#todo-list li').should(have.texts('a'));

    // const another = await director.newPage();
    // await another.page.stage.goto('http://todomvc.com/examples/emberjs');

    // await stage.$$('#todo-list li').should(have.texts('a'));
  });
});
