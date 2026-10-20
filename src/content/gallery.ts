import type { MediaKey } from "./media.generated";

export const galleryCategories = [
  "Food & drink",
  "Product ads",
  "Branding",
  "Gaming",
  "Posters & apparel",
  "Social posts",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export type GalleryItem = {
  image: MediaKey;
  title: string;
  category: GalleryCategory;
};

// All pieces are Asif's own. He generated the imagery with AI tools and did
// the composition, type and branding himself. Captions describe the piece and
// never suggest that a brand shown was a client.
export const gallery: GalleryItem[] = [
  // Graphic Design Portfolio 2026 (newest first). Every brand name in these is invented.
  { image: "graphics/sneaker-no-dead-weight", title: "Sneaker ad: No dead weight", category: "Product ads" },
  { image: "graphics/headphones-silence-engineered", title: "Headphones ad: Silence, engineered", category: "Product ads" },
  { image: "graphics/phone-see-it-first", title: "Phone ad: See it first", category: "Product ads" },
  { image: "graphics/car-silent-running", title: "Electric car ad: Silent running", category: "Product ads" },
  { image: "graphics/watch-measured-in-decades", title: "Watch ad: Measured in decades", category: "Product ads" },
  { image: "graphics/perfume-oriel", title: "Perfume ad: Oriel", category: "Product ads" },
  { image: "graphics/serum-bare-minimum", title: "Skincare ad: Bare minimum", category: "Product ads" },
  { image: "graphics/brand-cold-north", title: "Brand identity: Cold North", category: "Branding" },
  { image: "graphics/coffee-bag-cold-north", title: "Coffee packaging: Cold North", category: "Branding" },
  { image: "graphics/magazine-frame", title: "Magazine cover: Frame", category: "Posters & apparel" },
  { image: "graphics/poster-sub-freq", title: "Event poster: Sub Freq", category: "Posters & apparel" },
  { image: "graphics/poster-sylhet", title: "Travel poster: Sylhet", category: "Posters & apparel" },
  { image: "graphics/poster-nocturne", title: "Illustrated poster: Nocturne", category: "Posters & apparel" },
  { image: "graphics/social-drops-friday", title: "Sneaker drop post: Drops Friday", category: "Social posts" },
  { image: "graphics/social-midseason-edit", title: "Sale post: Midseason edit", category: "Social posts" },
  { image: "graphics/pasta-yum", title: "Pasta poster: Yum!", category: "Food & drink" },
  { image: "graphics/pasta-twist", title: "Pasta poster: Twist", category: "Food & drink" },
  { image: "graphics/pasta-one-twirl", title: "Pasta poster: One twirl", category: "Food & drink" },
  { image: "graphics/croissant-red", title: "Croissant type poster", category: "Food & drink" },
  { image: "graphics/croissant-outline", title: "Croissant pattern poster", category: "Food & drink" },
  { image: "graphics/croissant-happiness-on", title: "Stress off, happiness on", category: "Food & drink" },
  { image: "graphics/coffee-on", title: "Stress off, coffee on", category: "Food & drink" },
  { image: "graphics/croissant-split", title: "Croissant product shot", category: "Food & drink" },
  { image: "graphics/croissant-cream", title: "Croissant with cream filling", category: "Food & drink" },
  { image: "graphics/croissant-splash", title: "Croissant milk splash", category: "Food & drink" },
  { image: "graphics/can-blueberry-fusion", title: "Can design: Blueberry Fusion", category: "Food & drink" },
  { image: "graphics/can-fruit-squeeze-blueberry", title: "Can design: Fruit Squeeze blueberry", category: "Food & drink" },
  { image: "graphics/can-fruit-squeeze-peach", title: "Can design: Fruit Squeeze peach", category: "Food & drink" },
  { image: "graphics/can-vine-glow", title: "Can design: Vine Glow", category: "Food & drink" },
  { image: "graphics/can-cold-coffee", title: "Can design: Cold Coffee", category: "Food & drink" },
  { image: "graphics/can-fanta-mango", title: "Soft drink ad concept: mango", category: "Food & drink" },
  { image: "graphics/can-fanta-strawberry", title: "Soft drink ad concept: strawberry", category: "Food & drink" },
  { image: "graphics/can-fanta-pineapple", title: "Soft drink ad concept: pineapple", category: "Food & drink" },
  { image: "graphics/can-fanta-tropical", title: "Soft drink ad concept: tropical", category: "Food & drink" },
  { image: "graphics/coffee-fuel-pump", title: "Coffee ad: fuel pump", category: "Food & drink" },
  { image: "graphics/coffee-fuel-your-body", title: "Coffee ad: Fuel your body", category: "Food & drink" },
  { image: "graphics/coffee-phone-pour", title: "Coffee ad: pouring from a phone", category: "Food & drink" },
  { image: "graphics/ketchup-sliced", title: "Ketchup ad concept: sliced bottle", category: "Product ads" },
  { image: "graphics/ketchup-bottle", title: "Ketchup ad concept: tomato bottle", category: "Product ads" },
  { image: "graphics/watch-hour-unit", title: "Watch ad: Hour Unit", category: "Product ads" },
  { image: "graphics/watch-odyssey", title: "Watch ad: Sophistication in stealth mode", category: "Product ads" },
  { image: "graphics/lip-balm-squeeze", title: "Lip balm ad concept", category: "Product ads" },
  { image: "graphics/lip-balm-blueberry", title: "Lip balm ad concept: blueberry", category: "Product ads" },
  { image: "graphics/ctrl-key", title: "Poster: Everything is under Ctrl", category: "Product ads" },
  { image: "graphics/gamehorizon-spider-man", title: "GameHorizon price post", category: "Gaming" },
  { image: "graphics/gamehorizon-uncharted", title: "GameHorizon price post", category: "Gaming" },
  { image: "graphics/gamehorizon-ac-origins", title: "GameHorizon price post", category: "Gaming" },
  { image: "graphics/gamehorizon-gta-v", title: "GameHorizon price post", category: "Gaming" },
  { image: "graphics/gamehorizon-cyberpunk", title: "GameHorizon price post", category: "Gaming" },
  { image: "graphics/gamehorizon-cod-ww2", title: "GameHorizon price post", category: "Gaming" },
  { image: "graphics/gamehorizon-god-of-war", title: "GameHorizon price post", category: "Gaming" },
  { image: "graphics/gamehorizon-la-noire", title: "GameHorizon price post", category: "Gaming" },
  { image: "graphics/gamehorizon-last-of-us", title: "GameHorizon price post", category: "Gaming" },
  { image: "graphics/gamehorizon-witcher", title: "GameHorizon price post", category: "Gaming" },
  { image: "graphics/game-art-odyssey", title: "Game poster", category: "Gaming" },
  { image: "graphics/game-art-odyssey-battle", title: "Game poster: battle scene", category: "Gaming" },
  { image: "graphics/game-art-silhouette", title: "Double exposure portrait", category: "Gaming" },
  { image: "graphics/poster-dhaka", title: "Dhaka illustrated poster", category: "Posters & apparel" },
  { image: "graphics/tee-ignore", title: "T-shirt art: Ignore", category: "Posters & apparel" },
  { image: "graphics/tee-rome", title: "T-shirt art: Rome", category: "Posters & apparel" },
  { image: "graphics/tee-wild", title: "T-shirt art: Wild", category: "Posters & apparel" },
  { image: "graphics/tee-fight-club", title: "T-shirt art: Fight Club", category: "Posters & apparel" },
  { image: "graphics/tee-breaking-bad", title: "T-shirt art: Breaking Bad", category: "Posters & apparel" },
  { image: "graphics/tee-breaking-bad-vice", title: "T-shirt art: Breaking Bad, Vice City style", category: "Posters & apparel" },
  { image: "graphics/social-app-development", title: "Social post: app development", category: "Social posts" },
  { image: "graphics/social-marketing", title: "Social post: marketing", category: "Social posts" },
  { image: "graphics/social-website", title: "Social post: websites", category: "Social posts" },
  { image: "graphics/social-seo", title: "Social post: SEO", category: "Social posts" },
  { image: "graphics/social-seo-banner", title: "Social post: SEO", category: "Social posts" },
];
