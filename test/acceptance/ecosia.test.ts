import { tryToGetPage } from './../../lib/playright';
import { perform } from './../../lib/commands';
import { stage, goto, element } from '../../lib'

describe('Ecosia', () => {

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });

    it('should search', async () => {

        await goto('https://www.ecosia.org/');

        // await (await tryToGetPage().waitForSelector('[name=q]')).type('github yashaka selene');
        const query = element('[name=q]');
        // await query.type('github yashaka selene');

        // await (await tryToGetPage().$('[name=q]')).press('Enter');
        // await query.press('Enter');

        await query.type('github yashaka selene').then(perform.press('Enter'));

        await tryToGetPage().waitForTimeout(4000);

        // await element('[name=q]').type('github yashaka selene')
        //     .then(perform.press('Enter'));

        const results = element('.result');

        // await (await stage.page.waitForSelector(
            // '.result >> xpath=.//*[contains(@class, "result-title") and contains(text(), "yashaka/selene")]')).click()

    })
});