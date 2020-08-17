import { Located } from "./located";

/**
 * TODO: consider moving impl. from Located to here, and then reuse in Located
 * currently we reuse here the impl. from Located
 */
export namespace perform {

    export const press =
        (text: string, { delay = 0, noWaitAfter = false } = {}) =>
            (located: Located) => located.press(text, { delay, noWaitAfter })
            
    export const type =
        (text: string, { delay = 0, noWaitAfter = false } = {}) =>
            (located: Located) => located.type(text, { delay, noWaitAfter })
}