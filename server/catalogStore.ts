import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export interface StoreCollection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

export interface StoreCategory {
  id: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  collectionId?: string;
  sortOrder: number;
}

export interface StoreSubCategory {
  id: string;
  categoryId: string;
  name: string;
  sortOrder: number;
}

export interface StoreProduct {
  id: string;
  styleCode: string;
  name: string;
  categoryId: string;
  subCategoryId?: string;
  collectionId?: string;
  price: string | null;
  description: string;
  imageUrl: string;
  isNewArrival: boolean;
  createdAt: string;
}

export interface CatalogDatabase {
  collections: StoreCollection[];
  categories: StoreCategory[];
  subCategories: StoreSubCategory[];
  products: StoreProduct[];
}

interface AdminAuthFile {
  salt: string;
  hash: string;
  createdAt: string;
}

export const STORAGE_ROOT = path.resolve(process.cwd(), 'storage');
export const MEDIA_ROOT = path.resolve(STORAGE_ROOT, 'catalog');
const DB_PATH = path.resolve(STORAGE_ROOT, 'catalog-db.json');
const AUTH_PATH = path.resolve(STORAGE_ROOT, 'admin-auth.json');

const DEFAULT_HERO_IMG = '/src/assets/images/barokah_hero_editorial_1795196285797.jpg';
const DEFAULT_BAGS_IMG = '/src/assets/images/barokah_bags_wallets_1795196284557.jpg';
const DEFAULT_WALLETS_IMG = '/src/assets/images/cat_wallets_1795264951085.jpg';
const DEFAULT_SUNGLASSES_IMG = '/src/assets/images/cat_sunglasses_1795264951235.jpg';
const DEFAULT_PERFUMES_IMG = '/src/assets/images/cat_perfumes_1795264951763.jpg';
const DEFAULT_SANDALS_IMG = '/src/assets/images/cat_sandals_1795264951857.jpg';
const DEFAULT_CLOTHING_IMG = '/src/assets/images/cat_clothing_1795264952664.jpg';
const DEFAULT_JERSEYS_IMG = '/src/assets/images/cat_jerseys_1795264952244.jpg';
const DEFAULT_ACCESSORIES_IMG = '/src/assets/images/cat_accessories_1795264951392.jpg';
const DEFAULT_EYEWEAR_IMG = '/src/assets/images/barokah_eyewear_perfumes_1795196289324.jpg';
const DEFAULT_APPAREL_IMG = '/src/assets/images/barokah_apparel_jerseys_1795196284713.jpg';
const DEFAULT_STORE_IMG = '/src/assets/images/barokah_store_interior_1795196284999.jpg';

const LEGACY_SHARED_CATEGORY_IMAGES = new Set([
  DEFAULT_HERO_IMG,
  DEFAULT_BAGS_IMG,
  DEFAULT_EYEWEAR_IMG,
  DEFAULT_APPAREL_IMG,
]);

const DISTINCT_CATEGORY_IMAGE_BY_ID: Record<string, string> = {
  'bags-handbags': DEFAULT_BAGS_IMG,
  wallets: DEFAULT_WALLETS_IMG,
  sunglasses: DEFAULT_SUNGLASSES_IMG,
  perfumes: DEFAULT_PERFUMES_IMG,
  'sandals-footwear': DEFAULT_SANDALS_IMG,
  clothing: DEFAULT_CLOTHING_IMG,
  'sports-jerseys': DEFAULT_JERSEYS_IMG,
  'fashion-accessories': DEFAULT_ACCESSORIES_IMG,
};

const INITIAL_CATALOG: CatalogDatabase = {
  collections: [
    {
      id: 'seminyak-essentials',
      name: 'Seminyak Essentials',
      description: 'Everyday bags, wallets, sunglasses, and accessories curated in Seminyak, Bali.',
      imageUrl: DEFAULT_HERO_IMG,
      sortOrder: 1,
    },
    {
      id: 'designer-bags-edit',
      name: 'Designer Bags Edit',
      description: 'Featured handbags across YSL, Prada, Miu Miu, Dior, and Goyard styles.',
      imageUrl: DEFAULT_BAGS_IMG,
      sortOrder: 2,
    },
    {
      id: 'island-lifestyle',
      name: 'Island & Resort Edit',
      description: 'Clothing, sandals, sunglasses, fragrances, and sports jerseys for Bali days.',
      imageUrl: DEFAULT_STORE_IMG,
      sortOrder: 3,
    },
  ],
  categories: [
    {
      id: 'bags-handbags',
      name: 'Bags & Handbags',
      subtitle: 'Everyday totes, shoulder bags, and compact carryalls.',
      imageUrl: DEFAULT_BAGS_IMG,
      collectionId: 'designer-bags-edit',
      sortOrder: 1,
    },
    {
      id: 'wallets',
      name: 'Wallets',
      subtitle: 'Compact and practical everyday essentials.',
      imageUrl: DEFAULT_WALLETS_IMG,
      collectionId: 'seminyak-essentials',
      sortOrder: 2,
    },
    {
      id: 'sunglasses',
      name: 'Sunglasses',
      subtitle: 'Sun-ready eyewear suited for island days.',
      imageUrl: DEFAULT_SUNGLASSES_IMG,
      collectionId: 'seminyak-essentials',
      sortOrder: 3,
    },
    {
      id: 'perfumes',
      name: 'Perfumes',
      subtitle: 'Selected scents for daily wear and travel.',
      imageUrl: DEFAULT_PERFUMES_IMG,
      collectionId: 'island-lifestyle',
      sortOrder: 4,
    },
    {
      id: 'sandals-footwear',
      name: 'Sandals & Footwear',
      subtitle: 'Comfortable footwear for Bali streets and beyond.',
      imageUrl: DEFAULT_SANDALS_IMG,
      collectionId: 'island-lifestyle',
      sortOrder: 5,
    },
    {
      id: 'clothing',
      name: 'Clothing',
      subtitle: 'Versatile apparel for relaxed and everyday dressing.',
      imageUrl: DEFAULT_CLOTHING_IMG,
      collectionId: 'island-lifestyle',
      sortOrder: 6,
    },
    {
      id: 'sports-jerseys',
      name: 'Sports Jerseys',
      subtitle: 'Featuring NBA, NRL, and AFL jersey styles.',
      imageUrl: DEFAULT_JERSEYS_IMG,
      collectionId: 'island-lifestyle',
      sortOrder: 7,
    },
    {
      id: 'fashion-accessories',
      name: 'Fashion Accessories',
      subtitle: 'Finishing touches to match your personal style.',
      imageUrl: DEFAULT_ACCESSORIES_IMG,
      collectionId: 'seminyak-essentials',
      sortOrder: 8,
    },
  ],
  subCategories: [
    { id: 'ysl', categoryId: 'bags-handbags', name: 'YSL', sortOrder: 1 },
    { id: 'prada', categoryId: 'bags-handbags', name: 'Prada', sortOrder: 2 },
    { id: 'miu-miu', categoryId: 'bags-handbags', name: 'Miu Miu', sortOrder: 3 },
    { id: 'dior', categoryId: 'bags-handbags', name: 'Dior', sortOrder: 4 },
    { id: 'goyard', categoryId: 'bags-handbags', name: 'Goyard', sortOrder: 5 },
  ],
  products: [],
};

export function ensureStorageDirs(): void {
  if (!fs.existsSync(STORAGE_ROOT)) {
    fs.mkdirSync(STORAGE_ROOT, { recursive: true });
  }
  if (!fs.existsSync(MEDIA_ROOT)) {
    fs.mkdirSync(MEDIA_ROOT, { recursive: true });
  }
}

export function slugify(input: string): string {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export function sanitizeText(input: unknown, maxLength = 240): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

export function sanitizeMediaUrl(input: unknown): string {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed.slice(0, 512);
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString().slice(0, 512);
    }
  } catch {
    return '';
  }
  return '';
}

export function resolveSafeMediaDir(categoryId: string, subCategoryId?: string): string {
  ensureStorageDirs();
  const safeCat = slugify(categoryId);
  if (!safeCat) {
    throw new Error('Invalid category identifier.');
  }
  const segments = [MEDIA_ROOT, safeCat];
  if (subCategoryId) {
    const safeSub = slugify(subCategoryId);
    if (!safeSub) {
      throw new Error('Invalid sub-category identifier.');
    }
    segments.push(safeSub);
  }
  const resolved = path.resolve(...segments);
  if (!resolved.startsWith(MEDIA_ROOT + path.sep)) {
    throw new Error('Invalid media directory path.');
  }
  fs.mkdirSync(resolved, { recursive: true });
  return resolved;
}

export function deleteSafeMediaFileIfManaged(imageUrl: string): void {
  if (!imageUrl.startsWith('/catalog-media/')) return;
  const rel = imageUrl.slice('/catalog-media/'.length);
  const resolved = path.resolve(MEDIA_ROOT, rel);
  if (!resolved.startsWith(MEDIA_ROOT + path.sep)) return;
  try {
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      fs.unlinkSync(resolved);
    }
  } catch {
    // Ignore file cleanup errors safely
  }
}

export function readCatalogDb(): CatalogDatabase {
  ensureStorageDirs();
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_CATALOG, null, 2), 'utf8');
    return structuredClone(INITIAL_CATALOG);
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<CatalogDatabase>;
    const rawCategories = Array.isArray(parsed.categories)
      ? parsed.categories
      : INITIAL_CATALOG.categories;

    let upgraded = false;
    const categories = rawCategories.map((cat) => {
      const distinctUrl = DISTINCT_CATEGORY_IMAGE_BY_ID[cat.id];
      if (
        distinctUrl &&
        cat.imageUrl !== distinctUrl &&
        LEGACY_SHARED_CATEGORY_IMAGES.has(cat.imageUrl)
      ) {
        upgraded = true;
        return { ...cat, imageUrl: distinctUrl };
      }
      return cat;
    });

    const db: CatalogDatabase = {
      collections: Array.isArray(parsed.collections)
        ? parsed.collections
        : INITIAL_CATALOG.collections,
      categories,
      subCategories: Array.isArray(parsed.subCategories)
        ? parsed.subCategories
        : INITIAL_CATALOG.subCategories,
      products: Array.isArray(parsed.products) ? parsed.products : [],
    };
    if (upgraded) {
      writeCatalogDb(db);
    }
    return db;
  } catch {
    return structuredClone(INITIAL_CATALOG);
  }
}

export function writeCatalogDb(db: CatalogDatabase): void {
  ensureStorageDirs();
  const tmpPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmpPath, DB_PATH);
}

export function getEnvAdminPasscode(): string {
  return (process.env.ADMIN_PASSCODE || '').trim();
}

export function getAdminAuthStatus(): { configured: boolean; usingEnvPasscode: boolean } {
  const envPass = getEnvAdminPasscode();
  if (envPass.length > 0) {
    return { configured: true, usingEnvPasscode: true };
  }
  ensureStorageDirs();
  return {
    configured: fs.existsSync(AUTH_PATH),
    usingEnvPasscode: false,
  };
}

export function claimInitialAdminPasscode(passcode: string): boolean {
  if (getEnvAdminPasscode().length > 0) {
    return false;
  }
  ensureStorageDirs();
  if (fs.existsSync(AUTH_PATH)) {
    return false;
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(passcode, salt, 64).toString('hex');
  const record: AdminAuthFile = {
    salt,
    hash,
    createdAt: new Date().toISOString(),
  };
  try {
    fs.writeFileSync(AUTH_PATH, JSON.stringify(record, null, 2), {
      encoding: 'utf8',
      flag: 'wx',
    });
    return true;
  } catch {
    return false;
  }
}

export function verifyAdminPasscode(passcode: string): boolean {
  const envPass = getEnvAdminPasscode();
  if (envPass.length > 0) {
    const a = crypto.createHash('sha256').update(passcode).digest();
    const b = crypto.createHash('sha256').update(envPass).digest();
    return crypto.timingSafeEqual(a, b);
  }
  if (!fs.existsSync(AUTH_PATH)) {
    return false;
  }
  try {
    const raw = fs.readFileSync(AUTH_PATH, 'utf8');
    const saved = JSON.parse(raw) as AdminAuthFile;
    if (!saved.salt || !saved.hash) return false;
    const derived = crypto.scryptSync(passcode, saved.salt, 64);
    const stored = Buffer.from(saved.hash, 'hex');
    if (derived.length !== stored.length) return false;
    return crypto.timingSafeEqual(derived, stored);
  } catch {
    return false;
  }
}

const SESSION_SECRET =
  (process.env.SESSION_SECRET || '').trim() || crypto.randomBytes(32).toString('hex');

export function createAdminToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      role: 'admin',
      exp: Date.now() + 1000 * 60 * 60 * 12,
    })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  if (!payload || !sig) return false;

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return parsed.role === 'admin' && typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
}
