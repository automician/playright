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

## 0.0.8 (to be released on 2020.08.??)
- renamed have.size to have.count
- refactored from stage to Stage & Director
  - TBD: ...

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
