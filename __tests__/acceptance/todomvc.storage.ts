import { director, goto, element, elements, perform, have, stage } from '../../lib';

describe('Todomvc Storage', () => {
  beforeAll(async() => {
    jest.setTimeout(60 * 1000);
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

  it('should not share todos among different users (simulating by different browser contexts)', async () => {
    await goto('http://todomvc.com/examples/emberjs');
    await element('#new-todo').type('a').then(perform.press('Enter'));
    await elements('#todo-list li').should(have.count(1));

    const another = await director.newContext();
    await another.page.goto('http://todomvc.com/examples/emberjs')

    await another.elements('#todo-list li').should(have.count(0));
  });

  it('should not share todos among different browsers', async () => {
    await goto('http://todomvc.com/examples/emberjs');
    await element('#new-todo').type('a').then(perform.press('Enter'));
    await elements('#todo-list li').should(have.count(1));

    const another = await director.newBrowser();
    await another.page.goto('http://todomvc.com/examples/emberjs')

    await another.elements('#todo-list li').should(have.count(0));
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
