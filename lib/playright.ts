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

import { Url } from './utils';
import * as driver from 'playwright';
import { Condition } from './callables';
import { Element } from './element';
import { Elements } from './elements';

/**
 * TODO: asserts for entities...
 *
 * we probably will need to assert a lot of things on entities inside the stage
 * here goes the question...
 * define separate classes for all those entities to be able to do things like:
 *      page.should(have.*)
 *      context.should(have.*) or page.context.should(have.*)
 *      browser.should(have.*) or context.browser.should(have.*)
 *                             or page.context.browser.should(have.*)
 *      ...
 * or go just simply:
 *      stage.pageShould(have.*)
 *      stage.contextShould(have.*)
 *      stage.browserShould(have.*)
 *      ...
 *
 * or
 *      stage.should(have.page.*)
 *      stage.should(have.context.*)
 *      stage.should(have.browser.*)
 *      ...
 *      stage.should(have.network.*) ?
 *
 * Another question... Do we need both have and be?
 * Why not to simplify for match.* ?
 *
 * probably for stage.* it's not relevant...
 * e.g. it's ok to say be.opened and have.contexts(4) when asserting browser
 * but if styling like
 *
 *      stage.should(have.browser.opened)
 *      stage.should(have.browser.contexts(4))
 *
 * then have.* style is totally fine... no need for be.browser.opened
 *
 * yet for "located" (element or collection) it might be relevant, compare:
 *
 *      $('.item').should(be.visible)
 *      $('.item').should(have.text('foo')
 *
 *      vs
 *
 *      $('.item').should(match.visible)
 *      $('.item').should(match.text('foo')
 *
 * here we can go many ways... for example:
 *
 * - match.* for all located (element or collection) conditions
 *   have.*.* for all other entities conditions
 *
 * - have.* and be.* for located
 *   have.*.* for all other entities
 *
 * - etc?
 */
export interface Stage {
  // TODO: should we break it?
  browser?: driver.Browser;
  browserName?: string;
  launchOptions?: driver.LaunchOptions;
  context?: driver.BrowserContext;
  contextOptions?: driver.BrowserContextOptions;
  page?: driver.Page;
  baseUrl?: string;
  timeout?: number;
}

/**
 * TODO: what if we build evrth arround interfaces and composable objects ? ;)
 */

export const stage: Stage = {
  browserName: 'chromium',
  launchOptions: { headless: false },
  contextOptions: {},
  baseUrl: '',
  timeout: 4000, // TODO: should we name it like elementsTimeout?
};

/**
 * TODO: not sure do we need such "global" method or not...
 * TODO: consider moving to stage.goto(...)
 * TODO: should we name it as visit like in Cypress?
 *       pros:
 *       + more user oriented name
 *       cons:
 *       - playWright API is already pretty complicated and
 *         and we seem to keep a lot of its guts,
 *         so introducing one more name for goto will make things more complex
 */

export const goto = async (relativeOrAbsoluteUrl: string) => {
  const absoluteUrl = Url.isAbsolute(relativeOrAbsoluteUrl)
    ? relativeOrAbsoluteUrl
    : stage.baseUrl + relativeOrAbsoluteUrl;

  // TODO: move somewhere to Stage class getter
  const browser = stage.browser ?? (stage.browser = await driver[stage.browserName].launch(stage.launchOptions));

  const context = stage.context ?? (stage.context = await browser.newContext(stage.contextOptions));

  const page = stage.page ?? (stage.page = await context.newPage());

  await page.goto(absoluteUrl);
};

export const tryToGetPage: () => driver.Page | never = () => {
  if (!stage.page) {
    throw new Error('you should call goto first;)');
  }
  return stage.page;
};

export const element = (selector: string) =>
  new Element({
    toString: () => `element(${selector})`,
    call: () => tryToGetPage().$(selector),
  });

export const elements = (selector: string) =>
  new Elements({
    toString: () => `element(${selector})`,
    call: () => tryToGetPage().$$(selector),
  });
