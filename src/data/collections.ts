import { IMAGES, ImageAsset } from './images';

export interface CollectionCategory {
  id: string;
  name: string;
  shortLabel: string;
  subtitle: string;
  image: ImageAsset;
  layoutClass: string;
  aspectClass: string;
}

export const COLLECTIONS: CollectionCategory[] = [
  {
    id: 'bags-handbags',
    name: 'Bags & Handbags',
    shortLabel: '01.',
    subtitle: 'Everyday totes, shoulder bags, and compact carryalls.',
    image: IMAGES.categories.bags,
    layoutClass: 'col-span-2 md:col-span-6 lg:col-span-5',
    aspectClass: 'aspect-[4/3] md:aspect-[4/5]',
  },
  {
    id: 'wallets',
    name: 'Wallets',
    shortLabel: '02.',
    subtitle: 'Compact and practical everyday essentials.',
    image: IMAGES.categories.wallets,
    layoutClass: 'col-span-1 md:col-span-6 lg:col-span-3',
    aspectClass: 'aspect-[3/4]',
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    shortLabel: '03.',
    subtitle: 'Sun-ready eyewear suited for island days.',
    image: IMAGES.categories.sunglasses,
    layoutClass: 'col-span-1 md:col-span-6 lg:col-span-4',
    aspectClass: 'aspect-[3/4] lg:aspect-[4/5]',
  },
  {
    id: 'perfumes',
    name: 'Perfumes',
    shortLabel: '04.',
    subtitle: 'Selected scents for daily wear and travel.',
    image: IMAGES.categories.perfumes,
    layoutClass: 'col-span-1 md:col-span-6 lg:col-span-4',
    aspectClass: 'aspect-[4/5] md:aspect-[4/3]',
  },
  {
    id: 'sandals-footwear',
    name: 'Sandals & Footwear',
    shortLabel: '05.',
    subtitle: 'Comfortable footwear for Bali streets and beyond.',
    image: IMAGES.categories.sandals,
    layoutClass: 'col-span-1 md:col-span-6 lg:col-span-4',
    aspectClass: 'aspect-[4/5] md:aspect-[4/3]',
  },
  {
    id: 'clothing',
    name: 'Clothing',
    shortLabel: '06.',
    subtitle: 'Versatile apparel for relaxed and everyday dressing.',
    image: IMAGES.categories.clothing,
    layoutClass: 'col-span-2 md:col-span-6 lg:col-span-4',
    aspectClass: 'aspect-[16/10] md:aspect-[4/3]',
  },
  {
    id: 'sports-jerseys',
    name: 'Sports Jerseys',
    shortLabel: '07.',
    subtitle: 'Featuring NBA, NRL, and AFL jersey styles.',
    image: IMAGES.categories.jerseys,
    layoutClass: 'col-span-2 md:col-span-6 lg:col-span-7',
    aspectClass: 'aspect-[16/10]',
  },
  {
    id: 'fashion-accessories',
    name: 'Fashion Accessories',
    shortLabel: '08.',
    subtitle: 'Finishing touches to match your personal style.',
    image: IMAGES.categories.accessories,
    layoutClass: 'col-span-2 md:col-span-6 lg:col-span-5',
    aspectClass: 'aspect-[16/10] lg:aspect-[11/10]',
  },
];
