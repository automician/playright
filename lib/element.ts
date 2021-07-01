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
import { Condition, Locator } from './callables';
import { Configuration } from './configuraton';
import { Elements } from './elements';
import { Wait } from './wait';

/**
 * TODO: consider putting into Playright namespace
 */
export class Element {
  constructor(
    readonly options: Configuration,
    private readonly find: Locator<driver.ElementHandle<Node>>,
  ) {
    this.options = options;
    this.find = find;
  }

  /* --- Located --- */

  async handle(): Promise<driver.ElementHandle<Node>> {
    const handle = await this.find.call();
    if (!handle) {
      throw new Error('element was not found');
    }
    return handle;
  }

  /* --- Locating --- */
  $(selector: string): Element {
    return new Element(this.options, {
      toString: () => `${this}.$(${selector})`,
      call: async () => {
        const element = await this.handle();
        const result = await element.$(selector);
        return result;
      },
    });
  }

  $$(selector: string): Elements {
    return new Elements(this.options, {
      toString: () => `${this}.$$(${selector})`,
      call: async () => {
        const element = await this.handle();
        const result = await element.$$(selector);
        return result;
      },
    });
  }

  get parent(): Element {
    return new Element(this.options, {
      toString: () => `${this}.parent`,
      call: async () => {
        const element = await this.handle();
        const parent = await element.$('xpath=./..');
        return parent;
      },
    });
  }

  /* --- Waiting --- */
  get wait(): Wait<Element> {
    return new Wait(this, this.options.timeout);
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
    options: {
      delay?: number,
      noWaitAfter?: boolean,
      timeout?: number,
    } = {},
  ): Promise<Element> {
    const defaultOptions = {
      delay: 0,
      noWaitAfter: false,
      timeout: 5000,
    };
    await this.wait.for({
      toString: () => `type ${text}`,
      call: async () => this.handle().then(its => its.type(text, { ...defaultOptions, ...options })),
    });
    return this;
  }

  /**
   *
   * @param value
   * @param options should be like ElementHandleFillOptions from playwright
   * but without timeout becuase we have our own waiting logic and timeout
   */
  async fill(value: string, options: { timeout?: number, noWaitAfter?: boolean } = {}): Promise<Element> {
    const defaultOptions = {
      noWaitAfter: false,
      timeout: 1000,
    };
    await this.wait.for({
      toString: () => `fill ${value}`,
      call: async () => {
        const handle = await this.handle();
        await handle.fill(value, { ...defaultOptions, ...options });
      },
    });
    return this;
  }

  async setValue(value: string, options: { timeout?: number, noWaitAfter?: boolean } = {}): Promise<Element> {
    const defaultOptions = {
      noWaitAfter: false,
      timeout: 1000,
    };
    await this.wait.for({
      toString: () => `set value ${value}`,
      call: async () => {
        await this.click({ clickCount: 3 });
        await this.fill(value, { ...defaultOptions, ...options });
      },
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
  async press(key: string, options: { timeout?: number, delay?: number, noWaitAfter?: boolean} = {}): Promise<Element> {
    const defaultOptions = {
      delay: 0,
      noWaitAfter: false,
      timeout: 1000,
    };
    await this.wait.for({
      toString: () => `press ${key}`,
      call: async () => this.handle().then(its => its.press(key, { ...defaultOptions, ...options })),
    });
    return this;
  }

  async click(options: {
    button ?: 'left' | 'right' | 'middle', // |"right"|"middle";
    clickCount ?: number,
    delay ?: number,
    position?: { x: number, y: number, }
    modifiers?: Array<'Alt'|'Control'|'Meta'|'Shift'>,
    force?: boolean,
    noWaitAfter?: boolean,
  } = {}): Promise<Element> {
    await this.wait.for({
      // TODO: log in toString options too in case they are not default
      toString: () => `${options.button || 'left'} click`,
      call: async () => this.handle().then(its => its.click(options)),
    });
    return this;
  }

  /**
   * TODO: shouldn't we call (await this.handle).dblClick() ?
   */
  async doubleClick(options: {
    button ?: 'left' | 'right' | 'middle', // |"right"|"middle";
    clickCount ?: number,
    delay ?: number,
    position?: { x: number, y: number, }
    modifiers?: Array<'Alt'|'Control'|'Meta'|'Shift'>,
    force?: boolean,
    noWaitAfter?: boolean,
  } = {}): Promise<Element> {
    await this.click({ ...{ clickCount: 2 }, ...options });
    return this;
  }

  async contextClick(): Promise<Element> {
    await this.click({ button: 'right' }); // TODO: ensure it's correctly logged
    return this;
  }

  async hover({
    position = undefined,
    modifiers = undefined, // Array<"Alt"|"Control"|"Meta"|"Shift">,
    force = false,
  } = {}): Promise<Element> {
    await this.wait.for({
      // TODO: log in toString options too in case they are not default
      toString: () => 'hover',
      call: async () => this.handle().then(its => its.hover({
        position,
        modifiers,
        force,
        timeout: 1000,
      })),
    });
    return this;
  }

  async text(): Promise<string> {
    return this.handle().then(handle => handle.innerText());
  }

  toString() {
    return this.find.toString();
  }
}
