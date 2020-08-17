import { elements } from './../../lib/playright';
import { stage, goto, element, perform, have } from '../../lib'

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
        await elements('#todo-list li').should(have.texts('a', 'b', 'c'));

        await elements('#todo-list li').first.element('.toggle').click();
        await elements('#todo-list li').firstBy(have.text('c'))
            .element('.toggle').click();
        await elements('#todo-list li').by(have.cssClass('completed'))
            .should(have.texts('a', 'c'))
        await elements('#todo-list li').by(have.no.cssClass('completed'))
            .should(have.texts('b'))

        await stage.page.waitForTimeout(4000);
    })

    /**
     * TODO: by the way, what about the following style:

    fit('should complete todo', async () => {


        await goto('http://todomvc.com/examples/emberjs');

        await the('#new-todo').type('a').then(perform.press('Enter'));
        await the('#new-todo').type('b').then(perform.press('Enter'));
        await the('#new-todo').type('c').then(perform.press('Enter'));
        await all('#todo-list li').should(have.texts('a', 'b', 'c'));

        await all('#todo-list li').first.element('.toggle').click();
        await all('#todo-list li').firstBy(have.text('c')).element('.toggle').click();
        await all('#todo-list li').by(have.cssClass('completed')).should(have.texts('a', 'c'));
        await all('#todo-list li').by(have.no.cssClass('completed')).should(have.texts('b'));
    })

     * TODO: or should we leave it to the user?
     */
});