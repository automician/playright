# Playright

Play the right test- and user-oriented way with Playwright ;)

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
import { stage, goto, $ } from 'playright'

describe('Ecosia', () => {

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });

    it('should search', async () => {
        await goto('https://www.ecosia.org/');

        const query = $('[name=q]');
        await query.type('github yashaka selene');
        await query.press('Enter');
    })
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