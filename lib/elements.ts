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
import { StageOptions } from './stageOptions';
import { Wait } from './wait';
import { Condition, Locator } from './callables';
import { Element } from './element';
import { query } from './queries';

/**
 * TODO: consider putting into Playright namespace
 */
export class Elements /* implements AsyncIterable<Element> */ {
  // TODO: implement iterator
  constructor(
    private readonly find: Locator<driver.ElementHandle<Node>[]>,
    private readonly options: StageOptions, // TODO: rename to stage?
    // TODO: should we just accept Stage here?
  ) {
    this.find = find;
    this.options = options;
  }

  // [Symbol.asyncIterator](): AsyncIterator<Element, any, undefined> {
  //     return {
  //         next(value?: any): Promise<IteratorResult<T>>;
  //         return?(value?: any): Promise<IteratorResult<T>>;
  //         throw?(e?: any): Promise<IteratorResult<T>>;
  //     }
  // }

  /* --- Located --- */

  get handles(): Promise<driver.ElementHandle<Node>[]> {
    return this.find.call();
  }

  /* --- Context-driven --- */

  /**
   * TODO: think on proper name...
   * at? with? in? of? ... etc?
   */
  when(options: StageOptions): Elements {
    return new Elements(this.find, options);
  }

  get wait(): Wait<Elements> {
    return new Wait(this, this.options.timeout);
  } // $('.item').wait.for({call})

  /* --- Locating --- */

  get cached(): Promise<Elements> {
    const original = this;
    return this.handles.then(
      saved => new Elements(
        {
          toString: () => original.toString(),
          call: async () => saved,
        },
        original.options,
      ),
    );
  }

  /**
   * TODO: implement proper async iterator and remove this method
   */
  get cachedArray(): Promise<Element[]> {
    const original = this;
    return this.handles.then(saved => saved.map(
      (handle, index) => new Element(
        {
          toString: () => `${original}[${index + 1}]`,
          call: async () => handle,
        },
        original.options,
      ),
    ));
  }

  /**
   *
   * @param index number of element in elements collection starting from 1
   */
  element(index: number): Element {
    const collection = this;
    return new Element({
      toString: () => `${collection}[${index}]`,
      call: async () => {
        const actual = await collection.handles;
        if (actual.length < index) {
          throw new Error(
            `Cannot get element of number ${index} from elements collection with length ${actual.length}`,
          );
          // TODO: do we need to print the whole collection here?
          //       probably with stage option to limit number of
          //       elements to log
        }
        return actual[index - 1];
      },
    }, this.options);
  }

  get first(): Element {
    return this.element(1);
  }

  firstBy(condition: Condition<Element>): Element {
    const collection = this;
    return new Element({
      toString: () => `${collection}.firstBy(${condition})`,
      async call() {
        const cached = await collection.cachedArray;
        // eslint-disable-next-line no-restricted-syntax
        for (const element of cached) {
          if (await condition.matches(element)) {
            return element.handle;
          }
        }

        const outerHTMLs: string[] = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const element of cached) {
          outerHTMLs.push(await query.outerHtml.call(element));
        }

        throw new Error(`Cannot find element by condition «${condition}» from elements collection:\n[${outerHTMLs}]`);
      },
    }, this.options);
  }

  by(condition: Condition<Element>): Elements {
    const collection = this;
    return new Elements({
      toString: () => `${collection}.by(${condition})`,
      async call() {
        const filtered: driver.ElementHandle<Node>[] = [];
        const cachedArray = await collection.cachedArray;
        // eslint-disable-next-line no-restricted-syntax
        for (const element of cachedArray) {
          if (await condition.matches(element)) {
            filtered.push(await element.handle);
          }
        }
        return filtered;
      },
    }, this.options);
  }

  /* --- Assertable --- */

  async should(condition: Condition<Elements>): Promise<Elements> {
    await this.wait.for(condition);
    return this;
  }

  toString() {
    return this.find.toString();
  }
}
