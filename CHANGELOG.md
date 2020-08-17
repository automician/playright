# Changelog

## TODO:
- fix failure rendering in console log. currently it fails with:
  Failures:
        1) Todomvc should complete todo
          Message:
            [object Promise] thrown
          Stack:
- implement async iterator for Elements

## 0.0.next
- TBD

## 0.0.4 (to be released on 2020.08.x)
- TBD

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