import { director, goto, element, elements, perform, have, stage } from '../../lib';

describe('Todomvc', () => {
  beforeAll(async() => {
    jest.setTimeout(60 * 1000);
    director.assign({ launchOptions: { headless: false} });
  })
  afterAll(async () => {
    await director.dispose();
  });

  it('should complete todo', async () => {
    // TODO: the following somehow does not work... why?
    // stage.launchOptions = {...stage.launchOptions, slowMo: 1000};

    await goto('http://todomvc.com/examples/emberjs');

    await element('#new-todo').type('a').then(perform.press('Enter'));
    await element('#new-todo').type('b').then(perform.press('Enter'));
    await element('#new-todo').type('c').then(perform.press('Enter'));
    await element('#new-todo').type('d').then(perform.press('Enter'));
    await elements('#todo-list li').should(have.texts('a', 'b', 'c', 'd'));

    await elements('#todo-list li').first.element('.toggle').click();
    await elements('#todo-list li').element(2).element('.toggle').click();
    await elements('#todo-list li').firstBy(have.text('d')).element('.toggle').click();
    await elements('#todo-list li').by(have.cssClass('completed')).should(have.texts('a', 'b', 'd'));
    await elements('#todo-list li').by(have.no.cssClass('completed')).should(have.texts('c'));

    await stage.page.waitForTimeout(4000);
  });
});
