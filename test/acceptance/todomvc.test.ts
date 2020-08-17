import { stage, goto, $, perform } from '../../lib'

describe('Todomvc', () => {

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });

    fit('should complete todo', async () => {

        // TODO: slowMo seems to not work... fix!
        stage.launchOptions = {...stage.launchOptions, slowMo: 1000}; 

        await goto('http://todomvc.com/examples/emberjs');

        await $('#new-todo').type('a').then(perform.press('Enter'));
        await $('#new-todo').type('b').then(perform.press('Enter'));
        await $('#new-todo').type('c').then(perform.press('Enter'));
    })
});