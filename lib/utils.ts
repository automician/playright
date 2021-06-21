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

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export namespace fp {
  export const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

  export const toString = <O>(obj: O) => obj.toString();

  export function named<F>(description: string, fn: F): F {
    // eslint-disable-next-line no-param-reassign
    fn.toString = () => description;
    return fn;
  }
}

export namespace Url {
  export const isAbsolute = (relativeOrAbsoluteUrl: string): boolean => ['http:', 'https:', 'file:', 'about:', 'data:'].some(prefix => relativeOrAbsoluteUrl.toLowerCase().startsWith(prefix));
}

export namespace predicate {
  export const isTruthy = <V>(something: V) => (`${something}` === '' ? true : !!something);

  export const equalsIgnoringCase = <V>(expected: V) => (actual: V) => `${actual}`.toLowerCase() === `${expected}`.toLowerCase();

  export const equals = <V>(expected: V, ignoreCase = false) => (actual: V) => (ignoreCase ? equalsIgnoringCase(expected)(actual) : actual === expected);

  export const isGreaterThan = <V>(expected: V) => (actual: V) => actual > expected;

  export const isGreaterThanOrEqual = <V>(expected: V) => (actual: V) => actual >= expected;

  export const isLessThan = <V>(expected: V) => (actual: V) => actual < expected;

  export const isLessThanOrEqual = <V>(expected: V) => (actual: V) => actual <= expected;

  export const includesIgnoringCase = (expected: any) => (actual: any) => `${actual}`.includes(`${expected}`);

  export const includes = (expected: any, ignoreCase = false) => (actual: any) => (ignoreCase ? includesIgnoringCase(expected)(actual) : actual.includes(expected));

  export const matches = (expected: any) => (actual: any) => actual.match(expected);

  export const includesWordIgnoringCase = (expected: string) => (actual: string) => actual
    .toLowerCase()
    .split(' ')
    .includes(expected.toLowerCase());

  export const includesWord = (expected: string, ignoreCase = false) => (actual: string) => (ignoreCase ? includesWordIgnoringCase(expected)(actual) : actual.split(' ').includes(expected));

  export const arrayCompareBy = f => ([x, ...xs]: any[]) => ([y, ...ys]: any[]) => (x === undefined && y === undefined ? true : Boolean(f(x)(y)) && arrayCompareBy(f)(xs)(ys));

  export const equalsToArray = arrayCompareBy(equals);

  export const equalsByContainsToArray = arrayCompareBy(includes);
}
