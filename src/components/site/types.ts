/** Serializable shapes passed from the server page to the preview sections. */

export type Stat = { value: number; label: string };

export type Step = { step: string; title: string; description: string };

/** One practice area with its four offerings (Services grid). */
export type Practice = {
  slug: string;
  name: string;
  offerings: { title: string; description: string }[];
};

/** A product tile in the Work mosaic. */
export type MosaicItem = {
  slug: string;
  href: string;
  name: string;
  tagline: string;
  categoryName: string;
  screenshot: string;
  /** Brand colours taken from the product's own UI (see productTones). */
  tone: { deep: string; light: string };
  live: boolean;
};

/** An industry card: the products we have built for that sector. */
export type Industry = {
  name: string;
  icon: string;
  description: string;
  products: { name: string; href: string }[];
};

/** A brand mark resolved on the server, so the client only gets the paths it draws. */
export type Logo = { path: string; hex: string };

/** A tab in the tech section. `icon` is the fallback glyph for unbranded items. */
export type TechGroup = {
  name: string;
  description: string;
  icon: string;
  items: { name: string; logo: Logo | null }[];
};
