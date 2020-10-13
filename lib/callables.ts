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

import { ConditionNotMatchedError } from './errors';

/**
 * One-argument-async-function
 */
export type Lambda<T, R> = (entity: T) => Promise<R>;

/**
 * As-An-Object alternative to Lambda<T, R>
 */
export interface Callable<T, R> {
  call(entity: T): Promise<R>;
  toString?: () => string;
}

export interface Locator<R> {
  call: () => Promise<R>;
  toString?: () => string;
}

/**
 * Callable<T, R> alias...
 * For void version - see Command...
 * Assumes also that error can be thrown
 */
export type Query<T, R> = Callable<T, R>;

/**
 * Void version of Query
 * Can throw error on failure
 */
export type Command<T> = Query<T, void>;

/**
 * Like Command<T>, that can pass or fail with Error,
 * Named as Condition to reflect scenarios of "predicate-like" usage
 * Condition is like classic Matcher,
 * like Predicate but gives (passed | throws Error) instead of (true | false)
 * or in other words (matched | failed)
 */
export class Condition<E> implements Callable<E, void> {
  constructor(private readonly description: string, private readonly fn: Lambda<E, void>) {
    this.description = description;
    this.fn = fn;
  }

  async call(entity: E): Promise<void> {
    await this.fn(entity);
  }

  get not(): Condition<E> {
    return Condition.not(this);
  }

  and(condition: Condition<E>) {
    return Condition.and(this, condition);
  }

  or(condition: Condition<E>) {
    return Condition.or(this, condition);
  }

  matches(entity: E): Promise<boolean> {
    return this.call(entity).then(
      () => true,
      () => false,
    );
  }

  predicate(): Callable<E, boolean> {
    const { toString, matches } = this;
    return {
      toString,
      call: matches,
    };
  }

  toString(): string {
    return this.description;
  }

  static failIfNot<E>(description: string, predicate: (entity: E) => Promise<boolean>): Condition<E> {
    return new Condition(description, async (entity: E) => {
      if (!(await predicate(entity))) {
        throw new ConditionNotMatchedError();
      }
    });
  }

  static failIfNotActual<E, A>(
    description: string,
    query: Callable<E, A>, // TODO: what about accepting simple fn here?
    predicate: (actual: A) => boolean,
  ): Condition<E> {
    return new Condition(description, async (entity: E) => {
      const actual = await query.call(entity);
      if (!predicate(actual)) {
        throw new Error(`actual ${query}: ${actual}`);
      }
    });
  }

  /**
   * Negates or inverts condition
   */
  static not<T>(condition: Condition<T>, description?: string): Condition<T> {
    const [isOrHave, ...name] = condition.toString().split(' ');
    const newDescription = `${isOrHave} ${isOrHave === 'is' ? 'not' : 'no'} ${name.join(' ')}`;
    // TODO: can we simplify this logic?
    return new Condition(description || newDescription, (entity: T) => condition.call(entity).then(
      () => {
        throw new ConditionNotMatchedError();
      },
      () => {},
    ));
  }

  /**
   * Combines conditions by logical AND
   */
  static and<T>(...conditions: Condition<T>[]): Condition<T> {
    return new Condition(conditions.map(toString).join(' and '), async (entity: T) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const condition of conditions) {
        await condition.call(entity);
      }
    });
  }

  /**
   * Combines conditions by logical OR
   */
  static or<T>(...conditions: Condition<T>[]): Condition<T> {
    return new Condition(conditions.map(toString).join(' or '), async (entity: T) => {
      const errors: Error[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const condition of conditions) {
        try {
          await condition.call(entity);
          return;
        } catch (error) {
          errors.push(error);
        }
      }
      throw new Error(errors.map(toString).join('; '));
    });
  }

  /**
   * Transforms Conditions, i.e. Matchers that return (void | throws Error),
   * combined by AND
   * to async Predicate that returns (true | false)
   */
  static asPredicate<T>(...conditions: Condition<T>[]) {
    return (entity: T): Promise<boolean> => Condition.and(...conditions)
      .call(entity)
      .then(
        () => true,
        () => false,
      );
  }
}
