export const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}`;

/* srcset for the photos that were exported at two widths. */
export const srcSet = (name: string, widths: number[]) =>
  widths.map((w) => `${media(`${name}-${w}.jpg`)} ${w}w`).join(', ');

/* Absolute URL, for CSS custom properties (relative ones resolve against the stylesheet). */
export const mediaAbs = (file: string) => new URL(media(file), document.baseURI).href;
