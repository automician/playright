import { Element } from "./element";

/**
 * TODO: consider moving impl. from Located to here, and then reuse in Located
 * currently we reuse here the impl. from Located
 */
export namespace perform {

    export const press =
        (text: string, { delay = 0, noWaitAfter = false } = {}) =>
            (located: Element) => located.press(text, { delay, noWaitAfter })

    export const type =
        (text: string, { delay = 0, noWaitAfter = false } = {}) =>
            (located: Element) => located.type(text, { delay, noWaitAfter })

    export const click =
        (options = {}) => // TODO: consider adding option values here too
            (located: Element) => located.click(options)
}