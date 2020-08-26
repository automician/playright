# Playright

Play the right test- and user-oriented way with Playwright ;)

It is also a port of [Selenide](https://selenide.org/), [Selene](https://github.com/yashaka/selene), ][NSelene](https://github.com/yashaka/nselene), [SelenideJs](https://selenidejs.org/) from selenium webdriver world.

It is yet a very early draft version of the wrapper, where we play and experiment with API design to find the most optimal and efficient way of working with Playwright from user and testing perspective. 

## Table of content

* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Usage](#usage)
    * [Quick Start](#quick-start)
    * [Core API](#core-api)
    * [Advanced API](#advanced-api)
* [Tutorials](#tutorials)
* [Examples](#more-examples)
* [Contributing](#contributing)
* [Release Process](#release-process)
* [Changelog](#changelog)

## Prerequisites

TBD

## Installation

TBD

## Usage

### Quick Start

```typescript
import { director, goto, element, elements, perform, have, stage } from '../../lib';

describe('Todomvc', () => {
  beforeAll(async() => {
    jest.setTimeout(60 * 1000);
    director.assign({ launchOptions: { headless: false} }); // true by default
  })
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
```

TBD

### Core API

TBD

### Advanced API

TBD

## Tutorials

TBD

## More examples

TBD

## Changelog

[see CHANGELOG.md](https://github.com/automician/playright/blob/master/CHANGELOG.md)

## Contributing

Before implementing your ideas, it is recommended first to create a corresponding issue and discuss the plan to be approved;)
Also consider first to help with issues marked with help_needed label ;)

1. Clone project git clone https://github.com/automician/playright.git
2. Install it
3. ...
4. ...

5. Add a "feature request" Issue to this project.
6. Discuss its need and possible implementation. And once approved...
7. Fork the project ( https://github.com/[my-github-username]/playright/fork )
8. Create your feature branch (`git checkout -b my-new-feature`)
9. Commit your changes (`git commit -am 'Add some feature'`)
10. Push to the branch (`git push origin my-new-feature`)
11. Create a new Pull Request

## Release Process

TBD