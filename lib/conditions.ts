/* eslint-disable no-shadow */
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

import { Condition } from './callables';
import { Element } from './element';
import { Elements } from './elements';
import { query } from './queries';
import { predicate } from './utils';

// TODO: do we need this match namespace?
export namespace match {
  /* --- element conditions --- */
  // TODO: do we need a nested namespace? like match.element.isVisible ?

  export const visible = Condition.failIfNot('is visible', async (element: Element) => {
    const handle = await element.handle();
    const box = await handle.boundingBox();
    return box !== null;
  });

  export const text = (expected: string | number | RegExp) => Condition.failIfNotActual(
    `has text: ${expected}`,
    query.text,
    typeof expected === 'string' ? predicate.includes(expected) : predicate.matches(expected),
  );

  export const exactText = (expected: string | number | RegExp) => Condition.failIfNotActual(
    `has exact text: ${expected}`,
    query.text,
    typeof expected === 'string' ? predicate.equals(expected) : predicate.matches(expected),
  );

  export const cssClass = (name: string) => Condition.failIfNotActual(`has css class '${name}'`, query.attribute('class'), predicate.includesWord(name));

  const attributeWithValue = (name: string, value: string | RegExp) => new Condition(`has attribute: ${name}=${value}`, async (element: Element) => {
    const attr = await query.attribute(name).call(element);
    if (typeof value === 'string') {
      if (value === attr) {
        return;
      }
    } else if (value.test(attr)) {
      return;
    }
    throw new Error(`actual ${name}="${attr}"`);
  });

  const attributeWithoutValue = (name: string) => new Condition(`has attribute: ${name}`, async (element: Element) => {
    const attr = await query.attribute(name).call(element);
    if (attr === null) {
      throw new Error('actual: absent');
    }
  });

  export const attribute = (name: string, value?: string | RegExp) => {
    if (value !== undefined) {
      return attributeWithValue(name, value);
    }
    return attributeWithoutValue(name);
  };

  export const element = (locator: string) => Condition.failIfNot(`has element "${locator}"`, async (element: Element) => element
    .$(locator)
    .handle()
    .then(it => it !== null));

  /* --- elements collection conditions --- */

  // throwing 'cannot read includes of undefined randomly'
  // export const texts = (...values: string[] | number[]) => Condition.failIfNotActual(`have texts ${values}`, query.texts, predicate.equalsByContainsToArray(values));
  export const texts = (...values: string[] | number[]) => new Condition(`have texts ${values}`, async (elements: Elements) => {
    const actualTexts = await query.texts.call(elements);
    if (actualTexts.length !== values.length) {
      throw new Error(`actual ${actualTexts}`);
    }
    for (let i = 0; i < actualTexts.length; i += 1) {
      const actual = actualTexts[i].trim();
      const expected = String(values[i]).trim();
      if (!actual.includes(expected)) {
        throw new Error(`actual ${actualTexts}`);
      }
    }
  });

  export const count = (num: number) => Condition.failIfNotActual(`have size ${num}`, query.count, predicate.equals(num));
}

export namespace have {
  export const { text } = match;

  export const { exactText } = match;

  export const { cssClass } = match;

  export const { texts } = match;

  export const { count } = match;

  export const { attribute } = match;

  export const { element } = match;

  export namespace no {
    export const text = (expected: string | number | RegExp) => match.text(expected).not;

    export const cssClass = (name: string) => match.cssClass(name).not;

    export const texts = (...values: string[] | number[]) => match.texts(...values).not;

    export const count = (num: number) => match.count(num).not;

    export const attribute = (name: string, value?: string) => match.attribute(name, value).not;
  }
}

export namespace be {
  export const { visible } = match;

  export namespace not {
    export const visible = match.visible.not;
  }
}
