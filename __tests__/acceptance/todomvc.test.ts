import { chromium, BrowserContext } from 'playwright';
import { Stage, perform, have } from '../../lib';

describe('Todomvc', () => {
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

  it('should complete todo', async () => {
    await stage.goto('http://todomvc.com/examples/emberjs');
    await stage
      .$('#new-todo')
      .type('a')
      .then(perform.press('Enter'));
    await stage
      .$('#new-todo')
      .type('b')
      .then(perform.press('Enter'));
    await stage
      .$('#new-todo')
      .type('c')
      .then(perform.press('Enter'));
    await stage
      .$('#new-todo')
      .type('d')
      .then(perform.press('Enter'));
    await stage.$$('#todo-list li').should(have.texts('a', 'b', 'c', 'd'));

    await stage
      .$$('#todo-list li')
      .first.$('.toggle')
      .click();
    await stage
      .$$('#todo-list li')
      .$(1)
      .$('.toggle')
      .click();
    await stage
      .$$('#todo-list li')
      .firstBy(have.text('d'))
      .$('.toggle')
      .click();

    await stage
      .$$('#todo-list li')
      .by(have.cssClass('completed'))
      .should(have.texts('a', 'b', 'd'));
    await stage
      .$$('#todo-list li')
      .by(have.no.cssClass('completed'))
      .should(have.texts('c'));
  });
});
