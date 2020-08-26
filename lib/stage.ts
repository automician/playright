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
import { Element } from './element';
import { Elements } from './elements';
import { StageOptions } from './stageOptions';

export class Stage implements StageOptions {
  // TODO: is inheritance ok below? should we change naming somehow?

  static withChromiumHeadless = new Stage({
    browserName: 'chromium',
    launchOptions: { headless: true },
    contextOptions: {},
    baseUrl: '',
    timeout: 4000, // TODO: should we name it like elementsTimeout?
  });

  // TODO: it's a pity we have to repeat many of them here
  //       while they are defined in StageOptions tha we implement...
  browser?: driver.Browser;

  browserName: string;

  launchOptions: driver.LaunchOptions;

  context?: driver.BrowserContext;

  contextOptions: driver.BrowserContextOptions;

  page: driver.Page;

  baseUrl?: string;

  timeout: number;

  private constructor(options: StageOptions) {
    Object.assign(this, options);
  }

  clone(options: StageOptions): Stage {
    /* TODO: not sure about name
     * .with? .at? .on? .for? .clone?
     * if named as `with`
     * stage.with({browser: customBrowserInstance}) sounds like it will override
     * existing stage browser, not return new stage with overriden browser...
     */
    return new Stage({ ...this, ...options });
  }

  assign(options: StageOptions): Stage {
    /* TODO: do we even need it? should we name it as .set ? or with?
     */
    return Object.assign(this, options);
  }

  element(selector: string) {
    return new Element({
      toString: () => `element(${selector})`,
      call: () => this.page.$(selector),
    }, this);
  }

  elements(selector: string) {
    return new Elements({
      toString: () => `elements(${selector})`,
      call: () => this.page.$$(selector),
    }, this);
  }
}
