import { IMAGES, ImageAsset } from './images';

export interface ProductItem {
  id: string;
  styleCode: string;
  name: string;
  categoryId: string;
  categoryName: string;
  subCollectionId?: string;
  subCollectionName?: string;
  price: string | null;
  isFeatured: boolean;
  isNewArrival: boolean;
  isPlaceholder: boolean;
  description: string;
  image: ImageAsset;
}

/**
 * Fallback sample slots displayed when a category or brand folder
 * does not yet contain uploaded photos in `src/assets/catalog/`.
 */
export const PLACEHOLDER_PRODUCTS: ProductItem[] = [
  {
    id: 'placeholder-bag-ysl',
    styleCode: 'BAG-YSL-01',
    name: '[Sample Slot] YSL Bag Collection',
    categoryId: 'bags-handbags',
    categoryName: 'Bags & Handbags',
    subCollectionId: 'ysl',
    subCollectionName: 'YSL',
    price: null,
    isFeatured: true,
    isNewArrival: true,
    isPlaceholder: true,
    description:
      'Automatic folder ready at src/assets/catalog/bags-handbags/ysl/. Drop product photos inside to populate this collection automatically.',
    image: IMAGES.products.placeholderItem1,
  },
  {
    id: 'placeholder-bag-prada',
    styleCode: 'BAG-PRADA-01',
    name: '[Sample Slot] Prada Bag Collection',
    categoryId: 'bags-handbags',
    categoryName: 'Bags & Handbags',
    subCollectionId: 'prada',
    subCollectionName: 'Prada',
    price: null,
    isFeatured: true,
    isNewArrival: false,
    isPlaceholder: true,
    description:
      'Automatic folder ready at src/assets/catalog/bags-handbags/prada/. Drop product photos inside to populate this collection automatically.',
    image: IMAGES.products.placeholderItem1,
  },
  {
    id: 'placeholder-bag-miumiu',
    styleCode: 'BAG-MIUMIU-01',
    name: '[Sample Slot] Miu Miu Bag Collection',
    categoryId: 'bags-handbags',
    categoryName: 'Bags & Handbags',
    subCollectionId: 'miu-miu',
    subCollectionName: 'Miu Miu',
    price: null,
    isFeatured: false,
    isNewArrival: false,
    isPlaceholder: true,
    description:
      'Automatic folder ready at src/assets/catalog/bags-handbags/miu-miu/. Drop product photos inside to populate this collection automatically.',
    image: IMAGES.products.placeholderItem1,
  },
  {
    id: 'placeholder-bag-dior',
    styleCode: 'BAG-DIOR-01',
    name: '[Sample Slot] Dior Bag Collection',
    categoryId: 'bags-handbags',
    categoryName: 'Bags & Handbags',
    subCollectionId: 'dior',
    subCollectionName: 'Dior',
    price: null,
    isFeatured: false,
    isNewArrival: false,
    isPlaceholder: true,
    description:
      'Automatic folder ready at src/assets/catalog/bags-handbags/dior/. Drop product photos inside to populate this collection automatically.',
    image: IMAGES.products.placeholderItem1,
  },
  {
    id: 'placeholder-bag-goyard',
    styleCode: 'BAG-GOYARD-01',
    name: '[Sample Slot] Goyard Bag Collection',
    categoryId: 'bags-handbags',
    categoryName: 'Bags & Handbags',
    subCollectionId: 'goyard',
    subCollectionName: 'Goyard',
    price: null,
    isFeatured: false,
    isNewArrival: false,
    isPlaceholder: true,
    description:
      'Automatic folder ready at src/assets/catalog/bags-handbags/goyard/. Drop product photos inside to populate this collection automatically.',
    image: IMAGES.products.placeholderItem1,
  },
  {
    id: 'placeholder-wallet-01',
    styleCode: 'WLT-01',
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
    styleCode: 'SUN-01',
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
    styleCode: 'PRF-01',
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
    styleCode: 'SND-01',
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
    styleCode: 'CLT-01',
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
    styleCode: 'JRS-01',
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
    styleCode: 'ACC-01',
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
