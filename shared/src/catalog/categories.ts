/** Icon names match lucide (web: lucide-react, mobile: lucide-react-native). */
export type CategoryIcon =
  | 'BedDouble'
  | 'Sofa'
  | 'CookingPot'
  | 'Laptop'
  | 'Smartphone'
  | 'GraduationCap'
  | 'BookOpen'
  | 'Shirt'
  | 'Lamp'
  | 'Dumbbell'
  | 'Shapes';

export type CategoryTone = 'brand' | 'amber' | 'danger' | 'info' | 'ink';

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  icon: CategoryIcon;
  tone: CategoryTone;
};

export const CATEGORIES: readonly Category[] = [
  {
    slug: 'hostel-items',
    name: 'Hostel items',
    blurb: 'Buckets, drums, mattresses, fans',
    icon: 'BedDouble',
    tone: 'brand',
  },
  {
    slug: 'furniture',
    name: 'Furniture',
    blurb: 'Beds, tables, chairs, shelves',
    icon: 'Sofa',
    tone: 'amber',
  },
  {
    slug: 'kitchen-items',
    name: 'Kitchen',
    blurb: 'Pots, stoves, gas, coolers',
    icon: 'CookingPot',
    tone: 'danger',
  },
  {
    slug: 'electronics',
    name: 'Electronics',
    blurb: 'Laptops, TVs, speakers, irons',
    icon: 'Laptop',
    tone: 'info',
  },
  {
    slug: 'phones',
    name: 'Phones & gadgets',
    blurb: 'Phones, power banks, earbuds',
    icon: 'Smartphone',
    tone: 'ink',
  },
  {
    slug: 'textbooks',
    name: 'Textbooks',
    blurb: 'Course books and handouts',
    icon: 'GraduationCap',
    tone: 'brand',
  },
  {
    slug: 'books',
    name: 'Books',
    blurb: 'Novels, guides, past questions',
    icon: 'BookOpen',
    tone: 'amber',
  },
  {
    slug: 'fashion',
    name: 'Fashion',
    blurb: 'Clothes, shoes, bags',
    icon: 'Shirt',
    tone: 'danger',
  },
  {
    slug: 'room-decor',
    name: 'Room & décor',
    blurb: 'Lamps, rugs, curtains, mirrors',
    icon: 'Lamp',
    tone: 'info',
  },
  {
    slug: 'sports',
    name: 'Sports & fitness',
    blurb: 'Bikes, weights, jerseys',
    icon: 'Dumbbell',
    tone: 'ink',
  },
  {
    slug: 'other',
    name: 'Other',
    blurb: 'Anything else students need',
    icon: 'Shapes',
    tone: 'brand',
  },
];

const bySlug = new Map(CATEGORIES.map((category) => [category.slug, category]));

export function findCategory(slug: string) {
  return bySlug.get(slug) ?? null;
}

export function categoryName(slug: string) {
  return bySlug.get(slug)?.name ?? 'Other';
}

export const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug) as [string, ...string[]];
