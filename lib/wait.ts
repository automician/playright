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

import { TimeoutError } from './errors';
import { Callable } from './callables';
import { sleep } from './utils';

export class Wait<T> {
  private readonly entity: T;

  private readonly timeout: number;

  private readonly pollingInterval: number;

  // TODO: do we need it as public?
  public readonly handleFailure: (error: TimeoutError) => Promise<Error>;

  constructor(
    // TODO: consider accepting WaitOptions object instead
    entity: T,
    timeout: number,
    pollingInterval = 0,
    orFailWith: (error: TimeoutError) => Promise<Error> = async it => it,
  ) {
    this.entity = entity;
    this.timeout = timeout;
    this.pollingInterval = pollingInterval;
    this.handleFailure = orFailWith;
  }

  atMost(timeout: number): Wait<T> {
    return new Wait<T>(this.entity, timeout, this.pollingInterval, this.handleFailure);
  }

  orFailWith(handler: (error: TimeoutError) => Promise<Error>): Wait<T> {
    return new Wait<T>(this.entity, this.timeout, this.pollingInterval, handler);
  }

  /**
   * TODO: allow accepting as callable a simple fn,
   *       potentially hacked by utils named
   *       same way like queries
   * @param callable
   */
  async for<R>(callable: Callable<T, R>): Promise<R> {
    const finishTime = new Date().getTime() + this.timeout;

    while (true) {
      try {
        /* eslint-disable no-await-in-loop */
        const entity = await callable.call(this.entity);
        return entity;
      } catch (reason) {
        if (new Date().getTime() > finishTime) {
          const error = new TimeoutError(
            '\n'
              + `Timed out after ${this.timeout}ms, while waiting for:\n`
              + `${this.entity}.${callable}\n`
              + '\n'
              + `Reason: ${reason.message}\n`,
          );

          const handledError = await this.handleFailure(error);
          throw handledError;
          /* eslint-enable no-await-in-loop */
        }
      }
      if (this.pollingInterval) {
        await sleep(this.pollingInterval);
      }
    }
  }

  async until<R>(callable: Callable<T, R>): Promise<boolean> {
    return this.for(callable).then(
      () => true,
      () => false,
    );
  }
}
