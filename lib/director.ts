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
import { Url } from './utils';
import { Wait } from './wait';
import { Stage } from './stage';

export class Director { // TODO: should we implement StageOptions?
  private _stage: Stage;

  /* TODO: should we keep main _stage as _spawned[0]
  get _stage() {
    return this._spawned[0];
  }
  */

  private _spawned: Stage[]; // TODO: should we rename it to _stages?

  /* TODO: should we reveal all stages of a director?
  get stages(): Stage[] {
    return [this._stage, ...this._spawned];
  }
   */

  // TODO: should we make it private and provide only one static public instance?
  constructor(stage: Stage) {
    this._stage = stage;
    this._spawned = [];
  }

  element(selector: string) {
    return new Element({
      toString: () => `element(${selector})`,
      call: () => this.page.then(its => its.$(selector)),
    }, this._stage);
  }

  elements(selector: string) {
    return new Elements({
      toString: () => `elements(${selector})`,
      call: () => this.page.then(its => its.$$(selector)),
    }, this._stage);
  }

  async goto(relativeOrAbsoluteUrl: string) {
    const absoluteUrl = Url.isAbsolute(relativeOrAbsoluteUrl) ? relativeOrAbsoluteUrl
      : this._stage.baseUrl + relativeOrAbsoluteUrl;

    const page = await this.page;
    const wait = new Wait(page, this._stage.timeout);
    await wait.for({
      toString: () => `goto ${absoluteUrl}`,
      call: async () => page.goto(absoluteUrl),
    });
  }

  assign(options: StageOptions): Director {
    Object.assign(this._stage, options);
    return this;
  }

  async init(options: StageOptions = {}): Promise<void> {
    Object.assign(this._stage, options);
    await this.page;
  }

  /* TODO: do we need .reset() ?
  async reset(options: StageOptions = {}): Promise<void> {
    await this.dispose();
    Object.assign(this._stage, options);
    await this.page;
  }
   */

  async newBrowser(options: StageOptions = {}): Promise<Stage> {
    // TODO: should we return Promise<Browser> ? and have another styled methods for Promise<Stage>

    const stage = this._stage.clone(options);

    const browser = await driver[stage.browserName].launch(stage.launchOptions);
    const context = await browser.newContext(stage.contextOptions);
    const page = await context.newPage();

    stage.assign({ browser, context, page });

    this._spawned.push(stage);

    return stage;
  }

  async newContext(options: driver.BrowserContextOptions = {}): Promise<Stage> {
    /**
     * TODO: unsure about name... technically it's newContextWithNewPage...
     * should we name it .newContextWithPage? and have another raw .newContext?
     * should we keep it as .newContext and add .newEmptyContext or .newContextWithoutPage
     */
    const context = await this._stage.browser.newContext({
      ...this._stage.contextOptions,
      ...options,
    });
    const page = await context.newPage();
    const stage = this._stage.clone({ context, page });
    this._spawned.push(stage);
    return stage;
  }

  async newPage(): Promise<Stage> {
    /**
     * TODO: unsure about name... technically it's newContextWithNewPage...
     */
    const page = await this._stage.context.newPage();
    const stage = this._stage.clone({ page });
    this._spawned.push(stage);
    return stage;
  }

  async dispose(): Promise<void> {
    /**
     * TODO: which name would be better? dispose like in c#? teardown? quit? stop?
     */
    await this._stage.browser?.close();
    // eslint-disable-next-line no-restricted-syntax
    for (const stage of this._spawned) {
      await stage.browser?.close();
    }
    this.assign({ browser: null, context: null, page: null });
  }

  get browser(): Promise<driver.Browser> {
    return this._stage.browser ? Promise.resolve(this._stage.browser)
      : driver[this._stage.browserName].launch(this._stage.launchOptions).then(async it => {
        this._stage.browser = it;
        return it;
      });
  }

  get context(): Promise<driver.BrowserContext> {
    return this._stage.context ? Promise.resolve(this._stage.context)
      : this.browser.then(async its => {
        this._stage.context = await its.newContext();
        return this._stage.context;
      });
  }

  get page(): Promise<driver.Page> {
    return this._stage.page ? Promise.resolve(this._stage.page)
      : this.context.then(async its => {
        this._stage.page = await its.newPage();
        return this._stage.page;
      });
  }
}
