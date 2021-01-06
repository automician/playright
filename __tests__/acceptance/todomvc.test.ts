import { chromium, BrowserContext, Browser, Page } from 'playwright';
import { perform, have, UserPage } from '../../lib';

describe('Todomvc', () => {
  let browser: Browser;
  let ui: UserPage;

  beforeAll(async () => {
    console.log('... before all!')
    jest.setTimeout(60 * 1000);
    browser = await chromium.launch({ headless: false/*, slowMo: 50*/ });
    const context = await browser.newContext();
    const page = await context.newPage();
    ui = new UserPage(
      page,
      {
        timeout: 5000,
      },
    );
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should complete todo', async () => {
    await ui.goto('http://todomvc.com/examples/emberjs');

    await ui.$('#new-todo').type('a').then(perform.press('Enter'));
    await ui.$('#new-todo').type('b').then(perform.press('Enter'));
    await ui.$('#new-todo').type('c').then(perform.press('Enter'));
    await ui.$('#new-todo').type('d').then(perform.press('Enter'));
    await ui.$$('#todo-list li').should(have.texts('a', 'b', 'c', 'd'));

    await ui.$$('#todo-list li').first.$('.toggle').click();
    await ui.$$('#todo-list li').by(have.cssClass('completed'))
      .should(have.texts('a'));

    await ui.$$('#todo-list li').$(1).$('.toggle').click();
    await ui.$$('#todo-list li').by(have.cssClass('completed'))
      .should(have.texts('a', 'b'));

    await ui.$$('#todo-list li').firstBy(have.text('d'))
      .$('.toggle').click();
    await ui.$$('#todo-list li').by(have.cssClass('completed'))
      .should(have.texts('a', 'b', 'd'));

    await ui.$$('#todo-list li').by(have.no.cssClass('completed'))
      .should(have.texts('c'));
  });
});
