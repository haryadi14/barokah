import { IMAGES, ImageAsset } from './images';

export interface ProductItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: string | null;
  isFeatured: boolean;
  isNewArrival: boolean;
  isPlaceholder: boolean;
  description: string;
  image: ImageAsset;
}

/**
 * DEVELOPMENT PLACEHOLDER CATALOG
 * Official product names, prices, and SKU photos have not been supplied yet.
 * Keep `price: null` unless officially provided by Barokah Store.
 */
export const PRODUCTS: ProductItem[] = [
  {
    id: 'placeholder-bag-01',
    name: '[Sample Slot] Everyday Handbag',
    categoryId: 'bags-handbags',
    categoryName: 'Bags & Handbags',
    price: null,
    isFeatured: true,
    isNewArrival: true,
    isPlaceholder: true,
    description:
      'Replaceable product placeholder for the Bags & Handbags collection. Contact us on WhatsApp for current styles and availability.',
    image: IMAGES.products.placeholderItem1,
  },
  {
    id: 'placeholder-wallet-01',
    name: '[Sample Slot] Classic Daily Wallet',
    categoryId: 'wallets',
    categoryName: 'Wallets',
    price: null,
    isFeatured: true,
    isNewArrival: false,
    isPlaceholder: true,
    description:
      'Replaceable product placeholder for the Wallets collection. Ask our team on WhatsApp for currently stocked designs.',
    image: IMAGES.products.placeholderItem2,
  },
  {
    id: 'placeholder-sunglasses-01',
    name: '[Sample Slot] Bali Sun Frame Sunglasses',
    categoryId: 'sunglasses',
    categoryName: 'Sunglasses',
    price: null,
    isFeatured: true,
    isNewArrival: true,
    isPlaceholder: true,
    description:
      'Replaceable product placeholder for the Sunglasses collection. Message us for current frame colors and styles.',
    image: IMAGES.products.placeholderItem3,
  },
  {
    id: 'placeholder-perfume-01',
    name: '[Sample Slot] Signature Fragrance Selection',
    categoryId: 'perfumes',
    categoryName: 'Perfumes',
    price: null,
    isFeatured: true,
    isNewArrival: false,
    isPlaceholder: true,
    description:
      'Replaceable product placeholder for the Perfumes collection. Available in-store and via WhatsApp inquiry.',
    image: IMAGES.products.placeholderItem4,
  },
  {
    id: 'placeholder-sandals-01',
    name: '[Sample Slot] Casual Island Sandals',
    categoryId: 'sandals-footwear',
    categoryName: 'Sandals & Footwear',
    price: null,
    isFeatured: false,
    isNewArrival: true,
    isPlaceholder: true,
    description:
      'Replaceable product placeholder for Sandals & Footwear. Ask our Seminyak store team about sizing and available pairs.',
    image: IMAGES.products.placeholderItem5,
  },
  {
    id: 'placeholder-clothing-01',
    name: '[Sample Slot] Resort & Everyday Apparel',
    categoryId: 'clothing',
    categoryName: 'Clothing',
    price: null,
    isFeatured: false,
    isNewArrival: false,
    isPlaceholder: true,
    description:
      'Replaceable product placeholder for the Clothing collection. Message us on WhatsApp for current sizes and fits.',
    image: IMAGES.products.placeholderItem6,
  },
  {
    id: 'placeholder-jersey-01',
    name: '[Sample Slot] Sports Jersey (NBA / NRL / AFL)',
    categoryId: 'sports-jerseys',
    categoryName: 'Sports Jerseys',
    price: null,
    isFeatured: false,
    isNewArrival: false,
    isPlaceholder: true,
    description:
      'Replaceable product placeholder for Sports Jerseys (NBA, NRL, AFL). Contact Barokah Store on WhatsApp to check available teams and sizes.',
    image: IMAGES.products.placeholderItem7,
  },
  {
    id: 'placeholder-accessory-01',
    name: '[Sample Slot] Lifestyle Fashion Accessory',
    categoryId: 'fashion-accessories',
    categoryName: 'Fashion Accessories',
    price: null,
    isFeatured: false,
    isNewArrival: false,
    isPlaceholder: true,
    description:
      'Replaceable product placeholder for Fashion Accessories. Ask our team for recommendations tailored to your look.',
    image: IMAGES.products.placeholderItem8,
  },
];
