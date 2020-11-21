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

import { Element } from './element';
import { Elements } from './elements';
import { Callable } from './callables';

/**
 * TODO: should we make the structure like query.element.text?
 * TODO: should we make it's possible to compose queries by the user
 *       something like
 *           query = {...query.element, ...query.browser, ...query.elements}
 */
export namespace query {
  /**
   * there are actually innerText and textContent
   * fully described here: https://stackoverflow.com/a/35213639/1297371
   * in short, the innerText = visible text
   *
   * TODO: how should we name the thing below? what about textContent too?
   */

  /**
   * TODO: refactor queries from callable objects to classic functions with
   *       overriden toString method like in selenidejs
   *       use named from ./utils/fp
   */

  export const text: Callable<Element, string> = {
    toString: () => 'text',
    call: element => element.handle().then(its => its.innerText()),
  };

  export function attribute(name: string): Callable<Element, string> {
    return {
      toString: () => `attribute ${name}`,
      call: element => element.handle().then(its => its.getAttribute(name)),
    };
  }

  export const outerHtml = attribute('outerHTML');

  /* --- elements collection queries --- */

  export const count: Callable<Elements, number> = {
    toString: () => 'count',
    call: elements => elements.handles().then(their => their.length),
  };

  // TODO: do we need this alias?
  export const length: Callable<Elements, number> = count;

  export const texts: Callable<Elements, string[]> = {
    toString: () => 'texts',
    call: async elements => {
      const innerTexts: string[] = [];
      const handles = await elements.handles();
      // eslint-disable-next-line no-restricted-syntax
      for (const handle of handles) {
        innerTexts.push(await handle.innerText());
      }
      return innerTexts;
    },
  };
}
