// Stock photos for the "What I do" areas: generic, unbranded pictures of the
// kind of work, not Asif's projects (those are on the project pages). All are
// from Unsplash under the Unsplash License (free to use, no attribution
// required); the photographers are credited on the page anyway, so visitors can
// tell these are illustrative stock photos. Cropped and converted to WebP.

export type StockPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  page: string;
};

const unsplash = (id: string) => `https://unsplash.com/photos/${id}`;

export const stock = {
  "software-dashboard": {
    src: "/images/stock/software-dashboard.webp",
    width: 1600,
    height: 1000,
    alt: "A laptop on a desk by a sunny window, showing a web app dashboard with charts",
    photographer: "Ngital",
    page: unsplash("8OYcY9CRP_0"),
  },
  "software-code": {
    src: "/images/stock/software-code.webp",
    width: 1600,
    height: 1000,
    alt: "A laptop with lines of code in an editor on a bright desk",
    photographer: "Christopher Gower",
    page: unsplash("m_HRfLhgABo"),
  },
  "uiux-tablet-wireframe": {
    src: "/images/stock/uiux-tablet-wireframe.webp",
    width: 1600,
    height: 1000,
    alt: "A designer drawing app wireframes on a tablet with a stylus",
    photographer: "Alvaro Reyes",
    page: unsplash("KxVlKiqQObU"),
  },
  "uiux-sketch-wireframes": {
    src: "/images/stock/uiux-sketch-wireframes.webp",
    width: 1600,
    height: 1000,
    alt: "Hand-drawn wireframe sketches of website layouts",
    photographer: "Hal Gatewood",
    page: unsplash("tZc3vjPCk-Q"),
  },
  "graphic-framed-poster": {
    src: "/images/stock/graphic-framed-poster.webp",
    width: 900,
    height: 1200,
    alt: "A framed black and white poster on a sunlit wall",
    photographer: "mottss designco",
    page: unsplash("H9dBFfQ1tik"),
  },
  "graphic-type-poster": {
    src: "/images/stock/graphic-type-poster.webp",
    width: 900,
    height: 1200,
    alt: "A black typographic poster on a white wall",
    photographer: "Mário Rui André",
    page: unsplash("aHvrdg2iBpI"),
  },
  "graphic-colour-posters": {
    src: "/images/stock/graphic-colour-posters.webp",
    width: 900,
    height: 1200,
    alt: "Colourful poster sheets on a brick wall",
    photographer: "Alexander Grigoryev",
    page: unsplash("HPcU-8xdbs8"),
  },
  "graphic-magazine": {
    src: "/images/stock/graphic-magazine.webp",
    width: 900,
    height: 1200,
    alt: "A hand holding an open magazine layout mockup",
    photographer: "pmv chamara",
    page: unsplash("qomIC8mCr0Y"),
  },
} satisfies Record<string, StockPhoto>;

export type StockKey = keyof typeof stock;
