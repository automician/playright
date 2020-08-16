import * as pr from 'playwright';
import { stage, goto, $ } from '../../lib'

describe('Ecosia', () => {

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });

    fit('should search', async () => {

        await goto('https://www.ecosia.org/');

        const query = $('[name=q]');
        await query.type('github yashaka selene');
        await query.press('Enter');

        // await (await stage.page.waitForSelector(
            // '.result >> xpath=.//*[contains(@class, "result-title") and contains(text(), "yashaka/selene")]')).click()

    })
});