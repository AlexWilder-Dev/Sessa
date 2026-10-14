# Sessa · the little yellow bar

A demo website for [Sessa](https://www.sessa.london), the all-day bar and café at
222 Railton Road, Herne Hill. Built as a pitch to the owners: static data, full
front end, no backend.

**Live:** https://alexwilder-dev.github.io/sessa-herne-hill/

## What's in it

- **Home**: the logo at full width; an open-now line from London time; the
  "Morning to martini" day scrubber; the food; the bar (£6.50 glass, £7 house
  martini); the room and the people; press; find us.
- **Morning to martini**: drag from 9am to 11pm on any day. The page shows the
  doors, the kitchen, what's on the board, and re-lights itself for that hour.
- **/menus**: Daytime · Evening · Drinks, readable on a phone.
- **/wine**: Find a bottle. The full list by style, with a price range and a
  chilled switch.
- **/events** and **/jobs**: their current copy.

## Demo any time of day

Add `?at=` to the URL, e.g.

- `?at=sat-11:30`: Saturday daytime, sandwich on, tortilla and Garibaldi on
- `?at=wed-16:00`: between menus, bar open
- `?at=sun-14:30`: kitchen closed, bar open till 3, Garibaldi still on
- `?at=fri-21:00`: evening menu, candlelit page
- `?at=mon-12:00`: closed

## Changing the menus

Everything (hours, kitchen times, dishes, drinks and all the bottles) lives in
[`src/data/sessa.ts`](src/data/sessa.ts). A menu change is a one-file edit.

## Running it

```sh
npm install
npm run dev       # local dev server
npm run build     # production build into dist/
npm run media     # regenerate wordmarks, favicons and resized photos from media-src/
npm run og        # regenerate public/og.jpg (1200×630) for link previews
```

Vite + React + TypeScript + Framer Motion, HashRouter, deployed to GitHub Pages
at the base path `/sessa-herne-hill/` (the workflow in `.github/workflows`
deploys `main`; the repository needs to be named `sessa-herne-hill` for that
path to match).

## Credits

Photography: Rob Greig. Painting: Katia, 2023. Logo, menus and copy: Sessa.
Site by AlexWilder-Dev.
