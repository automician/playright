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
export interface StageOptions {
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
 * TODO: should we narrow all Stage to a smaller group of options
 *       relevant only for the Element contexts?
 *
 * probably it's good to break things down...
 * we can have separate smaller ElementOptions and then merge them into Stage
 * like stage = {...elementOptions, ...}
 */
