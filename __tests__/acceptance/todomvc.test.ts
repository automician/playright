import { director, goto, element, elements, perform, have, stage } from '../../lib';

describe('Todomvc', () => {
  beforeAll(async() => {
    jest.setTimeout(60 * 1000);
    /* the following is true by default */
    // director.assign({ launchOptions: { headless: false } });
  })
  beforeEach(async () => {
    /**
     * so far the line below is redundant because the init is automatic
     * .dispose() is not, though;)
     */
    // await director.init();
  });
  afterEach(async () => {
    await director.dispose();
  });

  it('should complete todo', async () => {
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
  });

  it('should not share todos among different users (simulating by different browser contexts)', async () => {
    await goto('http://todomvc.com/examples/emberjs');
    await element('#new-todo').type('a').then(perform.press('Enter'));
    await elements('#todo-list li').should(have.size(1));

    const another = await director.newContext();
    await another.page.goto('http://todomvc.com/examples/emberjs')

    await another.elements('#todo-list li').should(have.size(0));
  });

  it('should not share todos among different browser', async () => {
    await goto('http://todomvc.com/examples/emberjs');
    await element('#new-todo').type('a').then(perform.press('Enter'));
    await elements('#todo-list li').should(have.size(1));

    const another = await director.newBrowser();
    await another.page.goto('http://todomvc.com/examples/emberjs')

    await another.elements('#todo-list li').should(have.size(0));
  });

  it('should share todos among different tabs', async () => {
    await goto('http://todomvc.com/examples/emberjs');
    await element('#new-todo').type('a').then(perform.press('Enter'));
    await elements('#todo-list li').should(have.texts('a'));

    const another = await director.newPage();
    await another.page.goto('http://todomvc.com/examples/emberjs')

    await elements('#todo-list li').should(have.texts('a'));
  });
});
