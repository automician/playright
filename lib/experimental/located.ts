// MIT License
//
// Copyright (c) 2020 Iakiv Kramarenko, Alexander Popov
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
import * as driver from 'playwright';
import { Stage, tryToGetPage, stage } from '../playright';
import { Wait } from '../wait';
import { Condition } from '../callables';

const $ = (selector: string) => new Located({
  toString: () => `located by {${selector}}`,
  first: () => tryToGetPage().$(selector),
  all: () => tryToGetPage().$$(selector),
});

/**
 * TODO: consider making first?: optional and generate impl as all()[0]
 */
export interface Locator<R> {
  first: () => Promise<R>;
  all: () => Promise<R[]>;
  toString?: () => string;
}

export class Located {
  constructor(
    private readonly find: Locator<driver.ElementHandle<HTMLOrSVGElement>>,
    private readonly options?: LocatedOptions,
  ) {
    this.find = find;
    this.options = options;
  }

  /**
   * TODO: think on proper name...
   * at? with? ... etc?
   */
  when(options: LocatedOptions): Located {
    return new Located(this.find, options);
  }

  get wait(): Wait<Located> {
    return new Wait(this, stage.timeout);
  } // $('.item').wait.for({call})

  /* --- Element actions --- */

  /**
   *
   * @param text
   * @param options should be like ElementHandleTypeOptions from playwright
   * but without timeout becuase we have our own waiting logic and timeout
   *
   * TODO: but should we actually have it?
   * TODO: shouldn't we reuse playwright's waiting logic where possible?
   */
  async type(
    text: string,
    options = {
      delay: 0,
      noWaitAfter: false,
    },
  ): Promise<Located> {
    await this.wait.for({
      toString: () => 'type',
      call: async () => this.find.first().then((it) => it.type(text, { ...options, timeout: 0 })),
    });
    return this;
  }

  /**
   *
   * @param key Name of the key to press or a character to generate,
   * such as `ArrowLeft` or `a`.
   * @param options should be like ElementHandlePressOptions from playwright
   * but without timeout becuase we have our own waiting logic and timeout
   */
  async press(key: string, { delay = 0, noWaitAfter = false } = {}): Promise<Located> {
    await this.wait.for({
      toString: () => 'type',
      call: async () => this.find.first().then((it) => it.press(key, { delay, noWaitAfter, timeout: 0 })),
    });
    return this;
  }

  /* --- Element search --- */
  $(selector: string): Located {
    // TODO: implement
    return this;
  }

  /* --- Filtering --- */

  // by(condition: Condition<ElementHandle>): Located {
  //     return new Located({
  //         toString: () => `${this}.by(${condition})`,
  //         first: (self: Located) => (await self.find.all()).some(element => Condition.asPredicate(condition).call(element)),
  //         // all: () => try,
  //     }
  // }

  /* --- asserts --- */

  should(elementCondition: Condition<Located>): Located {
    // TODO: implement
    return this;
  }
}

/**
 * TODO: should we narrow all Stage to a smaller group of options
 *       relevant only for the Located contexts?
 *
 * probably it's good to break things down...
 * we can have separate smaller LocatedOptions and then merge them into Stage
 * like stage = {...locatedOptions, ...}
 */
export interface LocatedOptions extends Stage {}
