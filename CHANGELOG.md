# Changelog

## TODO:
- implement async iterator for Elements
- tune linter
  - should not wrap lines less then 80
    - even if few calls with then
  - should wrap lines more than 79
- change in Element: element(number_: number) to element(index: number)

## 0.0.next
- TBD

## 0.0.21 (released on 2021.07.01)
- update signature for actions in `Element`

## 0.0.20 (released on 2021.06.22)
- minor fix for `have.attribute`

## 0.0.19 (released on 2021.06.22)
- minor fix for `have.texts`

## 0.0.18 (released on 2021.06.22)
- update `have.texts` to check for `actual.includes(expected)` instead of `actual === expected`

## 0.0.17 (released on 2021.06.21)
- update `prepublish` to `prepublishOnly`

## 0.0.16 (released on 2021.06.21)
- add `toString` to `stage`

## 0.0.15 (released on 2021.06.21)
- update `playwright` to 1.12.1 for new debugger, tracer, etc.
- update `have.texts` to simpler implementation with hope it will stop throwing errors randomly
- add `stage.pause()` as alias to `stage.options.page.pause()`
- add `Configuration.pollingInterval` to have ability to slow down retries

## 0.0.14 (released on 2021.01.05)
- update `playwright` to 1.7.1 for big sur support

## 0.0.13 (released on 2020.11.30)
- add `elements.$$(...)` method to map collection to another collection
- add `elements.eachShould(...)` method to apply `Element` condition to each element in `Elements`

## 0.0.12 (released on 2020.11.26)
- add `elements.sliced(...)` method

## 0.0.11 (released on 2020.11.22)
- set typescript target to `es2017`, module to `commonjs`, moduleResolution to `node`

## 0.0.10 (released on 2020.11.22)
- fix for `query.texts` command
- update `have.attribute` to accept RegExp
- update `typescript` to 4.1.2
- update `playwright` to 1.6.1
- remove attempt to use sync stack because it causes issues with console reporter on jest-circus

## 0.0.9 (released on 2020.10.13)
- set target in tsconfig to "es5"
- add `element.parent` getter
- add `have.attribute` condition

## 0.0.8 (to be released on 2020.09.29)
- remove stages manager aka 'Director'
- create single configuration entity in Stage
- add conditions `have.exactText` & `have.element`
- rename long `element(s)` method names to `$($)` for now
- add `element.setValue` method which is `clear + fill`

## 0.0.7 (released on 2020.08.20)
- fix element and elements toString
- fix missing async/awaits
- make `goto` waitable

## 0.0.6 (sipped)
- added elements to lib index.ts
- tuned project setup
  - switch from jasmine to jest
  - switch from tslint to eslint
  - refactor tsconfigs
  - remove test coverage tools

## 0.0.5 (to be released on 2020.08.x)
- TBD

## 0.0.4 (to be released on 2020.08.18)
- added Element#fill(value), hover

## 0.0.3 (released on 2020.08.18)
- moved Located to lib/experimental
  - let's forget about it for now and stick to classic Element + Elements (aka Collection)
- added element and elements instead of earlier $ in main api
- added Elemment and Elements
- added Element#click, doubleClick, contextClick, should
- added to Elements:
    - `element(numberStartingFromOne)`
    - `first` (alias for `element(1)`)
    - `by` (aka `filteredBy` from SelenideJs),
    - `firstBy` (aka `elementBy` from SelenideJs)
    - `should(condition)`
- added have.
  - text, no.text
  - texts, no.texts
  - cssClass, no.cssClass
- added be.
  - visible, not.visible

## 0.0.2 (released on 2020.08.16)
- `goto(url)`
- `$` to represent located element or collection of elements
- `stage` to keep all global contexts, options, etc...
- general waiting for entities
  - via `new Wait(entity).for({toString: () => 'description', call: entity => someCodeOnEntityToWait() })`
  - with some needed callables
- Located class as draft of Lazy wrapper over locating both element and collection

## 0.0.1 (released on 2020.08.15)
- just a dummy package
