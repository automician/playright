import { perform } from './../../lib/commands';
import { stage, director, goto, element } from '../../lib';

describe('Ecosia', () => {
  beforeAll(async() => {
    jest.setTimeout(60 * 1000);
    director.assign({ launchOptions: { headless: false } });
  })
  afterAll(async () => {
    await director.dispose();
  });

  it('should search', async () => {
    await goto('https://www.ecosia.org/');

    // await (await tryToGetPage().waitForSelector('[name=q]')).type('github yashaka selene');
    const query = element('[name=q]');
    // await query.type('github yashaka selene');

    // await (await tryToGetPage().$('[name=q]')).press('Enter');
    // await query.press('Enter');

    await query.type('github yashaka selene').then(perform.press('Enter'));

    await stage.page.waitForTimeout(4000);

    // await element('[name=q]').type('github yashaka selene')
    //     .then(perform.press('Enter'));

    const results = element('.result');

    // await (await stage.page.waitForSelector(
    // '.result >> xpath=.//*[contains(@class, "result-title") and contains(text(), "yashaka/selene")]')).click()
  });
});
