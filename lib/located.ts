import { stage } from './playright';
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

import { Stage } from './playright';
import * as driver from 'playwright'
import { Wait } from './wait';


export interface Locator<R> {
    first: () => Promise<R>,
    all: () => Promise<R[]>,
    toString?: () => string
}

export class Located {
    constructor(
        private readonly by: 
            Locator<driver.ElementHandle<HTMLOrSVGElement>>, 
        private readonly options?: LocatedOptions) 
    {
        this.by = by;
        this.options = options;
    }

    /**
     * TODO: think on proper name...
     * at? with? ... etc? 
     */
    when(options: LocatedOptions): Located {
        return new Located(this.by, options);
    }

    get wait(): Wait<Located> {
        return new Wait(this, stage.timeout);
    }

    /* --- Element actions --- */

    /**
     * 
     * @param text 
     * @param options should be like ElementHandleTypeOptions from playwright
     * but without timeout becuase we have our own waiting logic and timeout
     * 
     * TODO: but should we actually have it? 
     * TODO: shouldn't we reuse playwright's waiting logic where possible?
     */
    async type(
        text: string, 
        options = {
            delay: 0, 
            noWaitAfter: false
        }): Promise<Located> 
    {
        this.wait.for({ 
            toString: () => 'type', 
            call: async _ => 
                await (await this.by.first()).type(
                    text, 
                    {...options, timeout: 0})
        })
        return this;
    }

    /**
     * 
     * @param key Name of the key to press or a character to generate, 
     * such as `ArrowLeft` or `a`.
     * @param options should be like ElementHandlePressOptions from playwright
     * but without timeout becuase we have our own waiting logic and timeout
     */
    async press(
        key: string, 
        options = {
            delay: 0, 
            noWaitAfter: false
        }): Promise<Located> 
    {
        this.wait.for({ 
            toString: () => 'type', 
            call: async _ => 
                await (await this.by.first()).press(
                    key, 
                    {...options, timeout: 0})
        })
        return this;
    }

    /* --- Element actions --- */
}

/**
 * TODO: should we narrow all Stage to a smaller group of options
 *       relevant only for the Located contexts?
 */
export interface LocatedOptions extends Stage {

}
