# Changelog

## 0.0.next
- TBD

## 0.0.3 (to be released on 2020.08)
- moved Located to lib/experimental
  - let's forget about it for now and stick to classic Element + Elements (Collection)
- added element and elements instead of earlier $ in main api
- added Elemment and Elements
- added Element#click, doubleClick, contextClick
- added Elements#first, element(numberStartingFromOne)

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