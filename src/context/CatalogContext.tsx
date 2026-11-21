import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { COLLECTIONS, CollectionCategory } from '../data/collections';
import {
  ALL_CATALOG_PRODUCTS,
  BAG_SUBCOLLECTIONS,
  DISCOVERED_CATALOG_PRODUCTS,
  SubCollection,
} from '../data/catalogLoader';
import { IMAGES } from '../data/images';
import { PLACEHOLDER_PRODUCTS, ProductItem } from '../data/products';

export interface CuratedCollection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

export interface CategorySubItem extends SubCollection {
  categoryId: string;
}

interface ServerCatalogPayload {
  collections: CuratedCollection[];
  categories: Array<{
    id: string;
    name: string;
    subtitle: string;
    imageUrl: string;
    collectionId?: string;
    sortOrder: number;
  }>;
  subCategories: Array<{
    id: string;
    categoryId: string;
    name: string;
    sortOrder: number;
  }>;
  products: Array<{
    id: string;
    styleCode: string;
    name: string;
    categoryId: string;
    subCategoryId?: string;
    collectionId?: string;
    price: string | null;
    description: string;
    imageUrl: string;
    isNewArrival?: boolean;
    createdAt: string;
  }>;
}

interface CatalogContextValue {
  curatedCollections: CuratedCollection[];
  categories: CollectionCategory[];
  subCategories: CategorySubItem[];
  products: ProductItem[];
  loading: boolean;
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  refreshCatalog: () => Promise<void>;
}

const DEFAULT_CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'seminyak-essentials',
    name: 'Seminyak Essentials',
    description: 'Everyday bags, wallets, sunglasses, and accessories curated in Seminyak, Bali.',
    imageUrl: IMAGES.heroPrimary.src,
    sortOrder: 1,
  },
  {
    id: 'designer-bags-edit',
    name: 'Designer Bags Edit',
    description: 'Featured handbags across YSL, Prada, Miu Miu, Dior, and Goyard styles.',
    imageUrl: IMAGES.categories.bags.src,
    sortOrder: 2,
  },
  {
    id: 'island-lifestyle',
    name: 'Island & Resort Edit',
    description: 'Clothing, sandals, sunglasses, fragrances, and sports jerseys for Bali days.',
    imageUrl: IMAGES.brandIntro.src,
    sortOrder: 3,
  },
];

const DEFAULT_SUBCATEGORIES: CategorySubItem[] = BAG_SUBCOLLECTIONS.map((sub) => ({
  ...sub,
  categoryId: 'bags-handbags',
}));

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [serverData, setServerData] = useState<ServerCatalogPayload | null>(null);
  const [loading, setLoading] = useState(true);
  // Keep admin token strictly in React memory (never persisted to browser storage)
  const [adminToken, setAdminToken] = useState<string | null>(null);

  const refreshCatalog = useCallback(async () => {
    try {
      const res = await fetch('/api/catalog');
      if (!res.ok) return;
      const payload = (await res.json()) as ServerCatalogPayload;
      setServerData(payload);
    } catch {
      // Fallback safely to bundled static catalog when running without backend
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCatalog();
  }, [refreshCatalog]);

  const curatedCollections = useMemo<CuratedCollection[]>(() => {
    if (!serverData?.collections?.length) return DEFAULT_CURATED_COLLECTIONS;
    return serverData.collections;
  }, [serverData]);

  const categories = useMemo<CollectionCategory[]>(() => {
    if (!serverData?.categories?.length) return COLLECTIONS;

    return serverData.categories.map((cat, idx) => {
      const staticMatch = COLLECTIONS.find((c) => c.id === cat.id);
      return {
        id: cat.id,
        name: cat.name,
        shortLabel: `${String(idx + 1).padStart(2, '0')}.`,
        subtitle: cat.subtitle,
        collectionId: cat.collectionId,
        layoutClass: staticMatch?.layoutClass || 'col-span-1 md:col-span-6 lg:col-span-3',
        aspectClass: staticMatch?.aspectClass || 'aspect-[4/5]',
        image: {
          src: cat.imageUrl || staticMatch?.image.src || IMAGES.brandIntro.src,
          alt: `${cat.name} collection at Barokah Store`,
          plateIndex: String(idx + 1).padStart(2, '0'),
          plateTitle: cat.name,
          plateSubtitle: cat.subtitle,
          tone: staticMatch?.image.tone || 'sand',
        },
      };
    });
  }, [serverData]);

  const subCategories = useMemo<CategorySubItem[]>(() => {
    if (!serverData?.subCategories) return DEFAULT_SUBCATEGORIES;
    return serverData.subCategories.map((sub) => ({
      id: sub.id,
      categoryId: sub.categoryId,
      name: sub.name,
      folderName: sub.id,
    }));
  }, [serverData]);

  const products = useMemo<ProductItem[]>(() => {
    if (!serverData) return ALL_CATALOG_PRODUCTS;

    const categoryNameMap = new Map(categories.map((c) => [c.id, c.name]));
    const subNameMap = new Map(
      subCategories.map((s) => [`${s.categoryId}::${s.id}`, s.name])
    );

    const serverProducts: ProductItem[] = serverData.products.map((prod) => {
      const categoryName = categoryNameMap.get(prod.categoryId) || prod.categoryId;
      const subCollectionName = prod.subCategoryId
        ? subNameMap.get(`${prod.categoryId}::${prod.subCategoryId}`) || prod.subCategoryId
        : undefined;

      return {
        id: prod.id,
        styleCode: prod.styleCode,
        name: prod.name,
        categoryId: prod.categoryId,
        categoryName,
        subCollectionId: prod.subCategoryId,
        subCollectionName,
        collectionId: prod.collectionId,
        price: prod.price,
        isFeatured: false,
        isNewArrival: Boolean(prod.isNewArrival),
        isPlaceholder: false,
        description: prod.description,
        image: {
          src: prod.imageUrl,
          alt: `${prod.name} — ${categoryName} at Barokah Store`,
          plateIndex: subCollectionName || categoryName,
          plateTitle: prod.name,
          plateSubtitle: categoryName,
          tone: 'sand',
        },
      };
    });

    const combinedReal = [...serverProducts, ...DISCOVERED_CATALOG_PRODUCTS];
    const populatedKeys = new Set(
      combinedReal.map((item) =>
        item.subCollectionId
          ? `${item.categoryId}::${item.subCollectionId}`
          : item.categoryId
      )
    );

    // Keep fallback placeholder slots only for categories/sub-categories that still exist and have 0 real items
    const validCatIds = new Set(categories.map((c) => c.id));
    const activePlaceholders = PLACEHOLDER_PRODUCTS.filter((placeholder) => {
      if (!validCatIds.has(placeholder.categoryId)) return false;
      const key = placeholder.subCollectionId
        ? `${placeholder.categoryId}::${placeholder.subCollectionId}`
        : placeholder.categoryId;
      return !populatedKeys.has(key);
    });

    return [...combinedReal, ...activePlaceholders];
  }, [serverData, categories, subCategories]);

  const value = useMemo<CatalogContextValue>(
    () => ({
      curatedCollections,
      categories,
      subCategories,
      products,
      loading,
      adminToken,
      setAdminToken,
      refreshCatalog,
    }),
    [curatedCollections, categories, subCategories, products, loading, adminToken, refreshCatalog]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error('useCatalog must be used inside CatalogProvider');
  }
  return ctx;
}
