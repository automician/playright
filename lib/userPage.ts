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
import { Element } from './element';
import { Elements } from './elements';
import { Configuration } from './configuraton';
import { Wait } from './wait';

/**
 * The original playwright.Page is more like a "page driver".
 * The idea of this class is to reflect the Page from the real user perspective.
 * Real user implicitely waits for all happening on the page (see UserPage#wait)
 * Real user thinks about elements on page not as snapshots in some exact time,
 * but as dynamic "lazy" objects that can be re-found on the page at any time when user
 * wants to interact with them.
 *
 * TODO: can find a better name instead UserPage? like PageModel, PageObject, etc
 *       with PageObject we should count that classic PageObjects are in general
 *       ObjectsOnPage
 * TODO: refine the "open url" method name correspondingly
 *       for example UserPage#goto or UserPage#visit sounds ok,
 *       but PageObject#goto is awkward, PageObject#load or #open sounds better
 */
export class UserPage {
  readonly page: playwright.Page;

  readonly options: Configuration;

  readonly wait: Wait<UserPage>;

  constructor(
    page: playwright.Page,
    options: Configuration,
  ) {
    this.page = page;
    this.options = options;
    this.wait = new Wait(this, this.options.timeout);
  }

  async goto(absoluteOrRelativeUrl: string) {
    const url = this.options.baseUrl
      ? `${this.options.baseUrl}${absoluteOrRelativeUrl}`
      : absoluteOrRelativeUrl;

    await this.wait.for({
      toString: () => `goto ${url}`,
      call: async () => this.page.goto(url),
    });
  }

  $(selector: string) {
    return new Element(
      {
        toString: () => `$(${selector})`,
        call: () => this.page.$(selector),
      },
      this.options,
    );
  }

  $$(selector: string) {
    return new Elements(
      {
        toString: () => `$$(${selector})`,
        call: () => this.page.$$(selector),
      },
      this.options,
    );
  }
}
