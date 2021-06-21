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

import * as playwright from 'playwright';
import { Configuration } from './configuraton';
import { Wait } from './wait';
import { Condition, Locator } from './callables';
import { Element } from './element';
import { query } from './queries';

export class Elements {
  constructor(
    private readonly options: Configuration,
    private readonly find: Locator<playwright.ElementHandle<Node>[]>,
  ) {
    this.options = options;
    this.find = find;
  }

  /* --- Located --- */

  async handles(): Promise<playwright.ElementHandle<Node>[]> {
    const result = await this.find.call();
    return result;
  }

  get wait(): Wait<Elements> {
    return new Wait(this, this.options.timeout);
  } // $('.item').wait.for({call})

  /* --- Locating --- */

  async cached(): Promise<Elements> {
    return new Elements(this.options, {
      toString: () => this.toString(),
      call: () => this.handles(),
    });
  }

  async cachedArray(): Promise<Element[]> {
    const handles = await this.handles();
    return handles.map(
      (handle, index) => new Element(this.options, {
        toString: () => `${this}[${index}]`,
        call: async () => handle,
      }),
    );
  }

  $(index: number): Element {
    return new Element(this.options, {
      toString: () => `${this}[${index}]`,
      call: async () => {
        const actual = await this.handles();
        if (actual.length <= index) {
          throw new Error(
            `Cannot get element with index ${index} from elements collection with length ${actual.length}`,
          );
        }
        return actual[index];
      },
    });
  }

  get first(): Element {
    return this.$(0);
  }

  $$(mapper: (element: Element) => Element | Elements): Elements {
    return new Elements(this.options, {
      toString: () => `${this}.$$(${mapper})`,
      call: async () => {
        const mappedElements = await this.cachedArray().then(arr => arr.map(mapper));
        const results = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const it of mappedElements) {
          if (it instanceof Elements) {
            results.push(...await it.handles());
          } else {
            results.push(await it.handle());
          }
        }
        return results;
      },
    });
  }

  sliced(start: number, end?: number): Elements {
    return new Elements(this.options, {
      toString: () => `${this}.sliced(${start}${end ? `, ${end}` : ''})`,
      call: async () => this.handles().then(arr => arr.slice(start, end)),
    });
  }

  firstBy(condition: Condition<Element>): Element {
    return new Element(this.options, {
      toString: () => `${this}.firstBy(${condition})`,
      call: async () => {
        const cached = await this.cachedArray();
        // eslint-disable-next-line no-restricted-syntax
        for (const element of cached) {
          if (await condition.matches(element)) {
            return element.handle();
          }
        }
        const outerHTMLs: string[] = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const element of cached) {
          outerHTMLs.push(await query.outerHtml.call(element));
        }
        throw new Error(`Cannot find element by condition «${condition}» from elements collection:\n[${outerHTMLs}]`);
      },
    });
  }

  by(condition: Condition<Element>): Elements {
    return new Elements(this.options, {
      toString: () => `${this}.by(${condition})`,
      call: async () => {
        const filtered: playwright.ElementHandle<Node>[] = [];
        const cachedArray = await this.cachedArray();
        // eslint-disable-next-line no-restricted-syntax
        for (const element of cachedArray) {
          if (await condition.matches(element)) {
            filtered.push(await element.handle());
          }
        }
        return filtered;
      },
    });
  }

  /* --- Assertable --- */

  async should(condition: Condition<Elements>): Promise<Elements> {
    await this.wait.for(condition);
    return this;
  }

  async eachShould(condition: Condition<Element>): Promise<Elements> {
    await this.wait.for(new Condition(`each ${condition}`, async (elements: Elements) => {
      const cachedArray = await elements.cachedArray();
      // eslint-disable-next-line no-restricted-syntax
      for (const element of cachedArray) {
        await condition.call(element);
      }
    }));
    return this;
  }

  toString() {
    return this.find.toString();
  }
}
