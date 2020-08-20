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

import { predicate } from './utils';
import { query } from './queries';
import { Condition } from './callables';
import { Element } from './element';

export namespace match {
  // TODO: do we need this match namespace?

  /* --- element conditions --- */
  // TODO: do we need a nested namespace? like match.element.isVisible ?

  export const visible = Condition.failIfNot(
    'is visible',
    async (element: Element) => element.handle.then((it) => it.boundingBox() != null)
    // TODO: any better way to check for visibility?
  );

  export const text = (expected: string | number | RegExp) =>
    Condition.failIfNotActual(
      `has text: ${expected}`,
      query.text,
      typeof expected === 'string' ? predicate.includes(expected) : predicate.matches(expected)
    );

  export const cssClass = (name: string) =>
    Condition.failIfNotActual(`has css class '${name}'`, query.attribute('class'), predicate.includesWord(name));

  /* --- elements collection conditions --- */

  export const texts = (...values: string[] | number[]) =>
    Condition.failIfNotActual(`have texts ${values}`, query.texts, predicate.equalsByContainsToArray(values));

  export const size = (size: number) =>
    Condition.failIfNotActual(`have size ${size}`, query.count, predicate.equals(size));
}

export namespace have {
  export const text = (expected: string | number | RegExp) => match.text(expected);

  export const cssClass = (name: string) => match.cssClass(name);

  export const texts = (...values: string[] | number[]) => match.texts(...values);

  export const size = (size: number) => match.size(size);

  export namespace no {
    export const text = (expected: string | number | RegExp) => match.text(expected).not;

    export const cssClass = (name: string) => match.cssClass(name).not;

    export const texts = (...values: string[] | number[]) => match.texts(...values).not;

    export const size = (size: number) => match.size(size).not;
  }
}

export namespace be {
  export const visible = match.visible;

  export namespace not {
    export const visible = match.visible.not;
  }
}
