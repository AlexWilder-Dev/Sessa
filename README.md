# Sessa · the little yellow bar

A demo website for Sessa, the all-day bar and café at 222 Railton Road,
Herne Hill. Static data, full front end, no backend.

Built from Sessa's own material: EB Garamond (the typeface on their site and
printed menus), oxblood on paper and butter (their menus and logo), and their
photographs. Copy quotes the press word for word.

## Pages

- **Home**: the room, what Sessa is, *Morning to martini* (drag through the
  day; the page re-lights and says what's on), the food, the bar, the room
  and the people, press, find us.
- **Menus**: Daytime · Evening · Drinks.
- **Wine**: *Find a bottle*, the full list by style, with price and chilled
  filters.
- **Events**, **Jobs**: from sessa.london.

## Demo any time of day

`?at=sat-11:30`, `?at=wed-16:00`, `?at=sun-14:30`, `?at=fri-21:00`,
`?at=mon-12:00`.

## Editing

Menus, drinks, bottles, hours, quotes and copy all live in
[`app/src/data/sessa.ts`](app/src/data/sessa.ts).

```sh
npm install
npm run dev     # local server
npm run build   # builds into the repository root, which GitHub Pages serves
npm run media   # images from app/media-src into app/public/media
npm run og      # app/public/og.jpg for link previews
```

Commit the build to publish.

Photography: Rob Greig and others. Painting: Katia, 2023. Site by AlexWilder-Dev.
