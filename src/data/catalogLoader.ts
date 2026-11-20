import { COLLECTIONS } from './collections';
import { PLACEHOLDER_PRODUCTS, ProductItem } from './products';

export interface SubCollection {
  id: string;
  name: string;
  folderName: string;
}

export const BAG_SUBCOLLECTIONS: SubCollection[] = [
  { id: 'ysl', name: 'YSL', folderName: 'ysl' },
  { id: 'prada', name: 'Prada', folderName: 'prada' },
  { id: 'miu-miu', name: 'Miu Miu', folderName: 'miu-miu' },
  { id: 'dior', name: 'Dior', folderName: 'dior' },
  { id: 'goyard', name: 'Goyard', folderName: 'goyard' },
];

const SUBCOLLECTION_LABELS: Record<string, string> = {
  ysl: 'YSL',
  prada: 'Prada',
  'miu-miu': 'Miu Miu',
  dior: 'Dior',
  goyard: 'Goyard',
};

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  COLLECTIONS.map((col) => [col.id, col.name])
);

function formatTitleSegment(raw: string): string {
  const normalized = raw
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return 'Collection Item';

  return normalized
    .split(' ')
    .map((word) => {
      if (word.toLowerCase() === 'ysl') return 'YSL';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function buildStyleCode(
  fileName: string,
  subCollectionId?: string,
  categoryId?: string
): string {
  const baseName = fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase();

  if (subCollectionId) {
    const prefix = subCollectionId.replace(/[^a-zA-Z0-9]+/g, '').toUpperCase();
    return baseName.startsWith(prefix) ? baseName : `${prefix}-${baseName}`;
  }

  const catPrefix = (categoryId || 'ITEM')
    .split('-')[0]
    .slice(0, 4)
    .toUpperCase();
  return baseName.startsWith(catPrefix) ? baseName : `${catPrefix}-${baseName}`;
}

/**
 * Automatically imports every image file placed inside `/src/assets/catalog/**`.
 * Adding 10 or 500 new photos requires zero manual entries in code:
 * simply drop the image files into their category or brand subfolder.
 */
const catalogImageModules = import.meta.glob<string>(
  '/src/assets/catalog/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, import: 'default' }
);

function buildCatalogFromFolders(): ProductItem[] {
  const entries = Object.entries(catalogImageModules).sort(([a], [b]) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );

  const discovered: ProductItem[] = [];

  for (const [filePath, imageUrl] of entries) {
    const relative = filePath.replace(/^\/src\/assets\/catalog\//, '');
    const parts = relative.split('/').filter(Boolean);
    if (parts.length < 2) continue;

    const categoryId = parts[0].toLowerCase();
    const categoryName = CATEGORY_LABELS[categoryId] || formatTitleSegment(categoryId);

    let subCollectionId: string | undefined;
    let subCollectionName: string | undefined;
    let fileName: string;

    if (parts.length >= 3) {
      subCollectionId = parts[1].toLowerCase();
      subCollectionName =
        SUBCOLLECTION_LABELS[subCollectionId] || formatTitleSegment(parts[1]);
      fileName = parts[parts.length - 1];
    } else {
      fileName = parts[1];
    }

    const itemTitle = formatTitleSegment(fileName);
    const displayName = subCollectionName
      ? `${subCollectionName} · ${itemTitle}`
      : itemTitle;
    const styleCode = buildStyleCode(fileName, subCollectionId, categoryId);

    discovered.push({
      id: `catalog-${relative.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      styleCode,
      name: displayName,
      categoryId,
      categoryName,
      subCollectionId,
      subCollectionName,
      price: null,
      isFeatured: false,
      isNewArrival: false,
      isPlaceholder: false,
      description: `Available at Barokah Store Seminyak (${categoryName}${
        subCollectionName ? ` · ${subCollectionName}` : ''
      }). Contact us on WhatsApp for available colors, sizes, and pricing.`,
      image: {
        src: imageUrl,
        alt: `${displayName} — ${categoryName} at Barokah Store`,
        plateIndex: subCollectionName || categoryName,
        plateTitle: displayName,
        plateSubtitle: categoryName,
        tone: 'sand',
      },
    });
  }

  return discovered;
}

export const DISCOVERED_CATALOG_PRODUCTS: ProductItem[] = buildCatalogFromFolders();

/**
 * Merges bulk folder images with placeholder slots:
 * - If a brand subfolder (e.g., `bags-handbags/ysl/`) has real photos,
 *   its placeholder slot is automatically replaced by the real photos.
 * - If a category (without subfolders) has real photos, its placeholder slot is replaced.
 */
export const ALL_CATALOG_PRODUCTS: ProductItem[] = (() => {
  const populatedKeys = new Set(
    DISCOVERED_CATALOG_PRODUCTS.map((item) =>
      item.subCollectionId
        ? `${item.categoryId}::${item.subCollectionId}`
        : item.categoryId
    )
  );

  const activePlaceholders = PLACEHOLDER_PRODUCTS.filter((placeholder) => {
    const key = placeholder.subCollectionId
      ? `${placeholder.categoryId}::${placeholder.subCollectionId}`
      : placeholder.categoryId;
    return !populatedKeys.has(key);
  });

  return [...DISCOVERED_CATALOG_PRODUCTS, ...activePlaceholders];
})();
