export interface ImageAsset {
  src: string;
  alt: string;
  plateIndex: string;
  plateTitle: string;
  plateSubtitle: string;
  tone: 'sand' | 'linen' | 'clay' | 'espresso';
  isPlaceholderAsset?: boolean;
}

const HERO_EDITORIAL = '/src/assets/images/barokah_hero_editorial_1795196285797.jpg';
const BAGS_WALLETS = '/src/assets/images/barokah_bags_wallets_1795196284557.jpg';
const EYEWEAR_PERFUMES = '/src/assets/images/barokah_eyewear_perfumes_1795196289324.jpg';
const STORE_INTERIOR = '/src/assets/images/barokah_store_interior_1795196284999.jpg';

const CAT_WALLETS = '/src/assets/images/cat_wallets_1795264951085.jpg';
const CAT_SUNGLASSES = '/src/assets/images/cat_sunglasses_1795264951235.jpg';
const CAT_PERFUMES = '/src/assets/images/cat_perfumes_1795264951763.jpg';
const CAT_SANDALS = '/src/assets/images/cat_sandals_1795264951857.jpg';
const CAT_CLOTHING = '/src/assets/images/cat_clothing_1795264952664.jpg';
const CAT_JERSEYS = '/src/assets/images/cat_jerseys_1795264952244.jpg';
const CAT_ACCESSORIES = '/src/assets/images/cat_accessories_1795264951392.jpg';

/**
 * Centralized Image Registry for BAROKAH STORE.
 * Replace any image URL below with authentic Barokah Store product or storefront photography.
 */
export const IMAGES = {
  heroPrimary: {
    src: HERO_EDITORIAL,
    alt: 'Curated handbag, sunglasses, and neutral apparel display at Barokah Store',
    plateIndex: '01',
    plateTitle: 'Seminyak Retail Edit',
    plateSubtitle: 'Bags, Eyewear & Everyday Essentials',
    tone: 'sand',
  } as ImageAsset,
  heroSecondary: {
    src: BAGS_WALLETS,
    alt: 'Curated handbags and wallets displayed on natural travertine stone',
    plateIndex: '02',
    plateTitle: 'Curated Accessories',
    plateSubtitle: 'Camplung Tanduk No. 15',
    tone: 'clay',
  } as ImageAsset,
  brandIntro: {
    src: STORE_INTERIOR,
    alt: 'Bright minimalist retail boutique interior with natural displays in Seminyak, Bali',
    plateIndex: 'Bali',
    plateTitle: 'Heart of Seminyak',
    plateSubtitle: 'Accessible Style, Friendly Service',
    tone: 'linen',
  } as ImageAsset,
  servicesFeature: {
    src: EYEWEAR_PERFUMES,
    alt: 'Sunglasses and fragrance bottles styled in warm natural Bali light',
    plateIndex: 'Service',
    plateTitle: 'Personal Assistance',
    plateSubtitle: 'In-Store & WhatsApp Consultation',
    tone: 'sand',
  } as ImageAsset,
  storefront: {
    src: STORE_INTERIOR,
    alt: 'Barokah Store retail space on Jalan Camplung Tanduk No. 15, Seminyak',
    plateIndex: 'Storefront',
    plateTitle: 'Barokah Store',
    plateSubtitle: 'In Front of Honeyboy Optic',
    tone: 'clay',
  } as ImageAsset,
  storeInterior: {
    src: HERO_EDITORIAL,
    alt: 'Display table with handbags, eyewear, and folded apparel inside Barokah Store',
    plateIndex: 'Interior',
    plateTitle: 'Inside the Store',
    plateSubtitle: 'Jalan Camplung Tanduk No. 15',
    tone: 'linen',
  } as ImageAsset,
  categories: {
    bags: {
      src: BAGS_WALLETS,
      alt: 'Bags and handbags collection styled on travertine stone',
      plateIndex: '01',
      plateTitle: 'Bags & Handbags',
      plateSubtitle: 'Carryalls & Everyday Silhouettes',
      tone: 'clay',
    } as ImageAsset,
    wallets: {
      src: CAT_WALLETS,
      alt: 'Compact leather wallets displayed on travertine stone',
      plateIndex: '02',
      plateTitle: 'Wallets',
      plateSubtitle: 'Compact Daily Utility',
      tone: 'linen',
    } as ImageAsset,
    sunglasses: {
      src: CAT_SUNGLASSES,
      alt: 'Tortoiseshell sunglasses in warm natural Bali light',
      plateIndex: '03',
      plateTitle: 'Sunglasses',
      plateSubtitle: 'Island Sun Frames',
      tone: 'sand',
    } as ImageAsset,
    perfumes: {
      src: CAT_PERFUMES,
      alt: 'Glass fragrance bottles arranged on raw linen and limestone',
      plateIndex: '04',
      plateTitle: 'Perfumes',
      plateSubtitle: 'Everyday Scents',
      tone: 'clay',
    } as ImageAsset,
    sandals: {
      src: CAT_SANDALS,
      alt: 'Leather sandals arranged on natural teak bench',
      plateIndex: '05',
      plateTitle: 'Sandals & Footwear',
      plateSubtitle: 'Easy Bali Walking Pairs',
      tone: 'sand',
    } as ImageAsset,
    clothing: {
      src: CAT_CLOTHING,
      alt: 'Relaxed linen shirts and apparel on wooden hangers',
      plateIndex: '06',
      plateTitle: 'Clothing',
      plateSubtitle: 'Relaxed Apparel',
      tone: 'linen',
    } as ImageAsset,
    jerseys: {
      src: CAT_JERSEYS,
      alt: 'Athletic basketball and rugby sports jerseys on wooden rack',
      plateIndex: '07',
      plateTitle: 'Sports Jerseys',
      plateSubtitle: 'NBA · NRL · AFL',
      tone: 'espresso',
    } as ImageAsset,
    accessories: {
      src: CAT_ACCESSORIES,
      alt: 'Curated fashion accessories including woven belt, cap, and pouch',
      plateIndex: '08',
      plateTitle: 'Fashion Accessories',
      plateSubtitle: 'Finishing Details',
      tone: 'sand',
    } as ImageAsset,
  },
  products: {
    placeholderItem1: {
      src: BAGS_WALLETS,
      alt: 'Sample handbag display slot for Barokah Store',
      plateIndex: 'Bags',
      plateTitle: 'Everyday Handbag',
      plateSubtitle: 'Replaceable Slot',
      tone: 'clay',
      isPlaceholderAsset: true,
    } as ImageAsset,
    placeholderItem2: {
      src: CAT_WALLETS,
      alt: 'Sample wallet display slot for Barokah Store',
      plateIndex: 'Wallets',
      plateTitle: 'Classic Daily Wallet',
      plateSubtitle: 'Replaceable Slot',
      tone: 'linen',
      isPlaceholderAsset: true,
    } as ImageAsset,
    placeholderItem3: {
      src: CAT_SUNGLASSES,
      alt: 'Sample sunglasses display slot for Barokah Store',
      plateIndex: 'Eyewear',
      plateTitle: 'Sun Frame Eyewear',
      plateSubtitle: 'Replaceable Slot',
      tone: 'sand',
      isPlaceholderAsset: true,
    } as ImageAsset,
    placeholderItem4: {
      src: CAT_PERFUMES,
      alt: 'Sample perfume display slot for Barokah Store',
      plateIndex: 'Perfumes',
      plateTitle: 'Fragrance Selection',
      plateSubtitle: 'Replaceable Slot',
      tone: 'clay',
      isPlaceholderAsset: true,
    } as ImageAsset,
    placeholderItem5: {
      src: CAT_SANDALS,
      alt: 'Sample sandals display slot for Barokah Store',
      plateIndex: 'Footwear',
      plateTitle: 'Island Sandals',
      plateSubtitle: 'Replaceable Slot',
      tone: 'sand',
      isPlaceholderAsset: true,
    } as ImageAsset,
    placeholderItem6: {
      src: CAT_CLOTHING,
      alt: 'Sample clothing display slot for Barokah Store',
      plateIndex: 'Clothing',
      plateTitle: 'Everyday Apparel',
      plateSubtitle: 'Replaceable Slot',
      tone: 'linen',
      isPlaceholderAsset: true,
    } as ImageAsset,
    placeholderItem7: {
      src: CAT_JERSEYS,
      alt: 'Sample sports jersey display slot for Barokah Store',
      plateIndex: 'Jerseys',
      plateTitle: 'Sports Jersey',
      plateSubtitle: 'NBA / NRL / AFL',
      tone: 'espresso',
      isPlaceholderAsset: true,
    } as ImageAsset,
    placeholderItem8: {
      src: CAT_ACCESSORIES,
      alt: 'Sample fashion accessory display slot for Barokah Store',
      plateIndex: 'Accessories',
      plateTitle: 'Fashion Accessory',
      plateSubtitle: 'Replaceable Slot',
      tone: 'sand',
      isPlaceholderAsset: true,
    } as ImageAsset,
  },
};
