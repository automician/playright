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

import { Stage, stage } from './playright';
import * as driver from 'playwright';
import { Wait } from './wait';
import { Condition, Locator } from './callables';

/**
 * TODO: consider putting into Playright namespace
 */
export class Element {
  constructor(
    private readonly find: Locator<driver.ElementHandle<HTMLOrSVGElement>>,
    private readonly options?: ElementOptions // TODO: should we just accept Stage here?
  ) {
    this.find = find;
    this.options = options;
  }

  /* --- Located --- */

  get handle(): Promise<driver.ElementHandle<Node>> {
    return this.find.call().then((handle) => {
      if (handle === null) {
        throw new Error('element was not found');
      }
      return handle;
    });
  }

  /* --- Context-driven --- */

  /**
   * TODO: think on proper name...
   * at? with? in? of? ... etc?
   */
  when(options: ElementOptions): Element {
    return new Element(this.find, options);
  }

  /* --- Locating --- */

  element(selector: string): Element {
    const parent = this;
    return new Element({
      toString: () => ``,
      call: async () => (await parent.find.call()).$(selector),
    });
  }

  /* --- Waiting --- */

  get wait(): Wait<Element> {
    return new Wait(this, stage.timeout);
  } // $('.item').wait.for({call})

  /* --- Assertable --- */

  async should(condition: Condition<Element>): Promise<Element> {
    await this.wait.for(condition);
    return this;
  }

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
    }
  ): Promise<Element> {
    this.wait.for({
      toString: () => `type ${text}`,
      call: async (_) => await (await this.find.call()).type(text, { ...options, timeout: 0 }),
    });
    return this;
  }

  /**
   *
   * @param value
   * @param options should be like ElementHandleFillOptions from playwright
   * but without timeout becuase we have our own waiting logic and timeout
   */
  async fill(value: string, { noWaitAfter = false } = {}): Promise<Element> {
    this.wait.for({
      toString: () => `fill ${value}`,
      call: async (_) => await (await this.handle).fill(value, { noWaitAfter, timeout: 0 }),
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
  async press(key: string, { delay = 0, noWaitAfter = false } = {}): Promise<Element> {
    this.wait.for({
      toString: () => `press ${key}`,
      call: async (_) => await (await this.handle).press(key, { delay, noWaitAfter, timeout: 0 }),
    });
    return this;
  }

  async click({
    button = 'left', // |"right"|"middle";
    clickCount = 1,
    delay = 0,
    position = undefined,
    modifiers = undefined, // Array<"Alt"|"Control"|"Meta"|"Shift">,
    force = false,
    noWaitAfter = false,
  } = {}): Promise<Element> {
    const buttonName = button;
    this.wait.for({
      // TODO: log in toString options too in case they are not default
      toString: () => 'click',
      call: async (_) =>
        await (await this.handle).click({
          // TODO: o_O not sure wtf so I need the workaround below...
          button: buttonName === 'left' ? 'left' : buttonName === 'right' ? 'right' : 'middle',
          clickCount,
          delay,
          position,
          modifiers,
          force,
          noWaitAfter,
          timeout: 0,
        }),
    });
    return this;
  }

  /**
   * TODO: shouldn't we call (await this.handle).dblClick() ?
   */
  async doubleClick(): Promise<Element> {
    this.click({ clickCount: 2 });
    return this;
  }

  async contextClick(): Promise<Element> {
    this.click({ button: 'right' }); // TODO: ensure it's correctly logged
    return this;
  }

  async hover({
    position = undefined,
    modifiers = undefined, // Array<"Alt"|"Control"|"Meta"|"Shift">,
    force = false,
  } = {}): Promise<Element> {
    this.wait.for({
      // TODO: log in toString options too in case they are not default
      toString: () => 'hover',
      call: async (_) =>
        await (await this.handle).hover({
          position,
          modifiers,
          force,
          timeout: 0,
        }),
    });
    return this;
  }

  toString() {
    return this.find.toString();
  }
}

/**
 * TODO: should we narrow all Stage to a smaller group of options
 *       relevant only for the Element contexts?
 *
 * probably it's good to break things down...
 * we can have separate smaller ElementOptions and then merge them into Stage
 * like stage = {...elementOptions, ...}
 */
export interface ElementOptions extends Stage {}
