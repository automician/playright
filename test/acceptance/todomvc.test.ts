import { elements } from './../../lib/playright';
import { stage, goto, element, perform } from '../../lib'

describe('Todomvc', () => {

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });

    fit('should complete todo', async () => {

        // TODO: the following somehow does not work... why?
        // stage.launchOptions = {...stage.launchOptions, slowMo: 1000}; 

        await goto('http://todomvc.com/examples/emberjs');

        await element('#new-todo').type('a').then(perform.press('Enter'));
        await element('#new-todo').type('b').then(perform.press('Enter'));
        await element('#new-todo').type('c').then(perform.press('Enter'));
        // await elements('#todo-list li').should();

        await elements('#todo-list li').first.element('.toggle').click();

        await stage.page.waitForTimeout(4000);
    })
});