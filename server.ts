import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import {
  MEDIA_ROOT,
  claimInitialAdminPasscode,
  createAdminToken,
  deleteSafeMediaFileIfManaged,
  ensureStorageDirs,
  getAdminAuthStatus,
  readCatalogDb,
  resolveSafeMediaDir,
  sanitizeMediaUrl,
  sanitizeText,
  slugify,
  verifyAdminPasscode,
  verifyAdminToken,
  writeCatalogDb,
} from './server/catalogStore.ts';
import type {
  StoreCategory,
  StoreCollection,
  StoreProduct,
  StoreSubCategory,
} from './server/catalogStore.ts';

const PORT = Number(process.env.PORT) || 3000;
const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
};

function extractBearerToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return undefined;
  return header.slice('Bearer '.length).trim();
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized. Please sign in as admin.' });
    return;
  }
  next();
}

function formatFilenameToTitle(originalName: string): string {
  const stripped = originalName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!stripped) return 'Catalog Item';
  return stripped
    .split(' ')
    .map((word) => (word.toLowerCase() === 'ysl' ? 'YSL' : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
}

function buildStyleCode(prefix: string, nameSeed: string): string {
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9]+/g, '').toUpperCase().slice(0, 6) || 'ITEM';
  const cleanSeed = nameSeed
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase()
    .slice(0, 18);
  const shortSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return cleanSeed ? `${cleanPrefix}-${cleanSeed}-${shortSuffix}` : `${cleanPrefix}-${shortSuffix}`;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB max per photo
    files: 60, // up to 60 photos per batch
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TO_EXT[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP, and AVIF images are allowed.'));
    }
  },
});

async function startServer(): Promise<void> {
  ensureStorageDirs();
  const app = express();

  app.use(express.json({ limit: '2mb' }));

  // Serve uploaded product and category photos publicly for storefront & WhatsApp link previews
  app.use(
    '/catalog-media',
    express.static(MEDIA_ROOT, {
      maxAge: '7d',
      fallthrough: false,
    })
  );

  // Public Catalog Read API
  app.get('/api/catalog', (_req, res) => {
    const db = readCatalogDb();
    res.json(db);
  });

  // Admin Authentication Status & Setup/Login
  app.get('/api/admin/status', (req, res) => {
    const status = getAdminAuthStatus();
    const authenticated = verifyAdminToken(extractBearerToken(req));
    res.json({ ...status, authenticated });
  });

  app.post('/api/admin/claim', (req, res) => {
    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
    if (passcode.length < 6) {
      res.status(400).json({ error: 'Admin passcode must be at least 6 characters.' });
      return;
    }
    const ok = claimInitialAdminPasscode(passcode);
    if (!ok) {
      res.status(409).json({ error: 'Admin passcode is already configured.' });
      return;
    }
    const token = createAdminToken();
    res.json({ token });
  });

  app.post('/api/admin/login', (req, res) => {
    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
    const status = getAdminAuthStatus();
    if (!status.configured) {
      res.status(400).json({ error: 'Admin passcode has not been set up yet.' });
      return;
    }
    if (!verifyAdminPasscode(passcode)) {
      res.status(401).json({ error: 'Invalid admin passcode.' });
      return;
    }
    const token = createAdminToken();
    res.json({ token });
  });

  // --- COLLECTIONS CRUD ---
  app.post('/api/admin/collections', requireAdmin, (req, res) => {
    const name = sanitizeText(req.body?.name, 80);
    const description = sanitizeText(req.body?.description, 400);
    const imageUrl = sanitizeMediaUrl(req.body?.imageUrl) || '/src/assets/images/barokah_hero_editorial_1795196285797.jpg';
    const id = slugify(req.body?.id || name);

    if (!id || !name) {
      res.status(400).json({ error: 'Collection name is required.' });
      return;
    }

    const db = readCatalogDb();
    if (db.collections.some((c) => c.id === id)) {
      res.status(409).json({ error: 'A collection with this ID already exists.' });
      return;
    }

    const created: StoreCollection = {
      id,
      name,
      description,
      imageUrl,
      sortOrder: db.collections.length + 1,
    };
    db.collections.push(created);
    writeCatalogDb(db);
    res.status(201).json(created);
  });

  app.delete('/api/admin/collections/:id', requireAdmin, (req, res) => {
    const id = slugify(String(req.params.id || ''));
    const db = readCatalogDb();
    const before = db.collections.length;
    db.collections = db.collections.filter((c) => c.id !== id);
    if (db.collections.length === before) {
      res.status(404).json({ error: 'Collection not found.' });
      return;
    }
    db.categories = db.categories.map((cat) =>
      cat.collectionId === id ? { ...cat, collectionId: undefined } : cat
    );
    db.products = db.products.map((prod) =>
      prod.collectionId === id ? { ...prod, collectionId: undefined } : prod
    );
    writeCatalogDb(db);
    res.json({ ok: true });
  });

  // --- CATEGORIES CRUD ---
  app.post('/api/admin/categories', requireAdmin, (req, res) => {
    const name = sanitizeText(req.body?.name, 80);
    const subtitle = sanitizeText(req.body?.subtitle, 200);
    const collectionId = req.body?.collectionId ? slugify(req.body.collectionId) : undefined;
    const imageUrl = sanitizeMediaUrl(req.body?.imageUrl) || '/src/assets/images/barokah_store_interior_1795196284999.jpg';
    const id = slugify(req.body?.id || name);

    if (!id || !name) {
      res.status(400).json({ error: 'Category name is required.' });
      return;
    }

    const db = readCatalogDb();
    if (db.categories.some((c) => c.id === id)) {
      res.status(409).json({ error: 'Category already exists.' });
      return;
    }

    resolveSafeMediaDir(id);

    const created: StoreCategory = {
      id,
      name,
      subtitle: subtitle || `Explore ${name} at Barokah Store.`,
      imageUrl,
      collectionId,
      sortOrder: db.categories.length + 1,
    };
    db.categories.push(created);
    writeCatalogDb(db);
    res.status(201).json(created);
  });

  app.patch('/api/admin/categories/:id', requireAdmin, (req, res) => {
    const id = slugify(String(req.params.id || ''));
    const db = readCatalogDb();
    const target = db.categories.find((c) => c.id === id);
    if (!target) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }

    if (typeof req.body?.name === 'string') {
      const nextName = sanitizeText(req.body.name, 80);
      if (!nextName) {
        res.status(400).json({ error: 'Category name cannot be empty.' });
        return;
      }
      target.name = nextName;
    }
    if (typeof req.body?.subtitle === 'string') {
      target.subtitle = sanitizeText(req.body.subtitle, 200) || `Explore ${target.name} at Barokah Store.`;
    }
    if (req.body?.collectionId !== undefined) {
      target.collectionId = req.body.collectionId ? slugify(req.body.collectionId) : undefined;
    }
    if (typeof req.body?.imageUrl === 'string') {
      const nextImg = sanitizeMediaUrl(req.body.imageUrl);
      if (nextImg) target.imageUrl = nextImg;
    }

    writeCatalogDb(db);
    res.json(target);
  });

  app.delete('/api/admin/categories/:id', requireAdmin, (req, res) => {
    const id = slugify(String(req.params.id || ''));
    const db = readCatalogDb();
    const before = db.categories.length;
    db.categories = db.categories.filter((c) => c.id !== id);
    if (db.categories.length === before) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }
    db.subCategories = db.subCategories.filter((sub) => sub.categoryId !== id);
    const removedProducts = db.products.filter((p) => p.categoryId === id);
    for (const prod of removedProducts) {
      deleteSafeMediaFileIfManaged(prod.imageUrl);
    }
    db.products = db.products.filter((p) => p.categoryId !== id);
    writeCatalogDb(db);
    res.json({ ok: true });
  });

  // --- SUB-CATEGORIES CRUD ---
  app.post('/api/admin/subcategories', requireAdmin, (req, res) => {
    const name = sanitizeText(req.body?.name, 80);
    const categoryId = slugify(req.body?.categoryId || '');
    const id = slugify(req.body?.id || name);

    if (!id || !name || !categoryId) {
      res.status(400).json({ error: 'Category and sub-category name are required.' });
      return;
    }

    const db = readCatalogDb();
    if (!db.categories.some((c) => c.id === categoryId)) {
      res.status(404).json({ error: 'Parent category not found.' });
      return;
    }
    if (db.subCategories.some((s) => s.categoryId === categoryId && s.id === id)) {
      res.status(409).json({ error: 'Sub-category already exists in this category.' });
      return;
    }

    resolveSafeMediaDir(categoryId, id);

    const created: StoreSubCategory = {
      id,
      categoryId,
      name,
      sortOrder: db.subCategories.filter((s) => s.categoryId === categoryId).length + 1,
    };
    db.subCategories.push(created);
    writeCatalogDb(db);
    res.status(201).json(created);
  });

  app.patch('/api/admin/subcategories/:categoryId/:id', requireAdmin, (req, res) => {
    const categoryId = slugify(String(req.params.categoryId || ''));
    const id = slugify(String(req.params.id || ''));
    const nextName = sanitizeText(req.body?.name, 80);

    if (!nextName) {
      res.status(400).json({ error: 'Sub-category name cannot be empty.' });
      return;
    }

    const db = readCatalogDb();
    const target = db.subCategories.find((s) => s.categoryId === categoryId && s.id === id);
    if (!target) {
      res.status(404).json({ error: 'Sub-category not found.' });
      return;
    }

    target.name = nextName;
    writeCatalogDb(db);
    res.json(target);
  });

  app.delete('/api/admin/subcategories/:categoryId/:id', requireAdmin, (req, res) => {
    const categoryId = slugify(String(req.params.categoryId || ''));
    const id = slugify(String(req.params.id || ''));
    const db = readCatalogDb();
    const before = db.subCategories.length;
    db.subCategories = db.subCategories.filter(
      (s) => !(s.categoryId === categoryId && s.id === id)
    );
    if (db.subCategories.length === before) {
      res.status(404).json({ error: 'Sub-category not found.' });
      return;
    }
    db.products = db.products.map((p) =>
      p.categoryId === categoryId && p.subCategoryId === id
        ? { ...p, subCategoryId: undefined }
        : p
    );
    writeCatalogDb(db);
    res.json({ ok: true });
  });

  // --- SINGLE & BULK MEDIA UPLOAD + PRODUCT CREATION ---
  app.post('/api/admin/upload', requireAdmin, upload.single('image'), (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: 'No valid image file uploaded.' });
      return;
    }
    const categoryId = slugify(String(req.body?.categoryId || 'general')) || 'general';
    const subCategoryId = req.body?.subCategoryId
      ? slugify(String(req.body.subCategoryId))
      : undefined;

    const ext = ALLOWED_MIME_TO_EXT[req.file.mimetype] || '.jpg';
    const safeBase = slugify(path.basename(req.file.originalname, path.extname(req.file.originalname))) || 'photo';
    const uniqueName = `${safeBase}-${crypto.randomBytes(3).toString('hex')}${ext}`;
    const targetDir = resolveSafeMediaDir(categoryId, subCategoryId);
    const targetFile = path.resolve(targetDir, uniqueName);
    if (!targetFile.startsWith(MEDIA_ROOT + path.sep)) {
      res.status(400).json({ error: 'Invalid upload path.' });
      return;
    }

    fs.writeFileSync(targetFile, req.file.buffer);
    const relativeUrl = subCategoryId
      ? `/catalog-media/${categoryId}/${subCategoryId}/${uniqueName}`
      : `/catalog-media/${categoryId}/${uniqueName}`;
    res.status(201).json({ imageUrl: relativeUrl });
  });

  app.post('/api/admin/products', requireAdmin, (req, res) => {
    const name = sanitizeText(req.body?.name, 120);
    const categoryId = slugify(req.body?.categoryId || '');
    const subCategoryId = req.body?.subCategoryId ? slugify(req.body.subCategoryId) : undefined;
    const collectionId = req.body?.collectionId ? slugify(req.body.collectionId) : undefined;
    const description = sanitizeText(req.body?.description, 500);
    const price = req.body?.price ? sanitizeText(req.body.price, 60) : null;
    const imageUrl = sanitizeMediaUrl(req.body?.imageUrl);
    const isNewArrival = Boolean(req.body?.isNewArrival);

    if (!name || !categoryId || !imageUrl) {
      res.status(400).json({ error: 'Product name, category, and valid image are required.' });
      return;
    }

    const db = readCatalogDb();
    if (!db.categories.some((c) => c.id === categoryId)) {
      res.status(404).json({ error: 'Selected category does not exist.' });
      return;
    }

    const prefix = subCategoryId || categoryId.split('-')[0] || 'ITEM';
    const rawStyle = sanitizeText(req.body?.styleCode, 40).toUpperCase().replace(/[^A-Z0-9-]+/g, '-');
    const styleCode = rawStyle || buildStyleCode(prefix, name);

    const created: StoreProduct = {
      id: `prod-${crypto.randomBytes(6).toString('hex')}`,
      styleCode,
      name,
      categoryId,
      subCategoryId,
      collectionId,
      price,
      description:
        description ||
        `Available at Barokah Store Seminyak. Contact us on WhatsApp for available colors, sizes, and pricing.`,
      imageUrl,
      isNewArrival,
      createdAt: new Date().toISOString(),
    };

    db.products.unshift(created);
    writeCatalogDb(db);
    res.status(201).json(created);
  });

  // Bulk Upload: upload up to 60 photos in one click and auto-create products
  app.post('/api/admin/products/bulk-upload', requireAdmin, upload.array('images', 60), (req, res) => {
    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length === 0) {
      res.status(400).json({ error: 'Please select at least one image file.' });
      return;
    }

    const categoryId = slugify(String(req.body?.categoryId || ''));
    const subCategoryId = req.body?.subCategoryId
      ? slugify(String(req.body.subCategoryId))
      : undefined;
    const collectionId = req.body?.collectionId
      ? slugify(String(req.body.collectionId))
      : undefined;

    if (!categoryId) {
      res.status(400).json({ error: 'Category is required for bulk upload.' });
      return;
    }

    const db = readCatalogDb();
    const category = db.categories.find((c) => c.id === categoryId);
    if (!category) {
      res.status(404).json({ error: 'Selected category does not exist.' });
      return;
    }
    const subCategory = subCategoryId
      ? db.subCategories.find((s) => s.categoryId === categoryId && s.id === subCategoryId)
      : undefined;

    const targetDir = resolveSafeMediaDir(categoryId, subCategoryId);
    const createdProducts: StoreProduct[] = [];

    for (const file of files) {
      const ext = ALLOWED_MIME_TO_EXT[file.mimetype] || '.jpg';
      const origBase = path.basename(file.originalname, path.extname(file.originalname));
      const safeBase = slugify(origBase) || 'item';
      const uniqueName = `${safeBase}-${crypto.randomBytes(3).toString('hex')}${ext}`;
      const targetFile = path.resolve(targetDir, uniqueName);
      if (!targetFile.startsWith(MEDIA_ROOT + path.sep)) continue;

      fs.writeFileSync(targetFile, file.buffer);
      const imageUrl = subCategoryId
        ? `/catalog-media/${categoryId}/${subCategoryId}/${uniqueName}`
        : `/catalog-media/${categoryId}/${uniqueName}`;

      const itemTitle = formatFilenameToTitle(origBase);
      const displayName = subCategory ? `${subCategory.name} · ${itemTitle}` : itemTitle;
      const prefix = subCategory?.id || category.id.split('-')[0];
      const styleCode = buildStyleCode(prefix, origBase);

      const product: StoreProduct = {
        id: `prod-${crypto.randomBytes(6).toString('hex')}`,
        styleCode,
        name: displayName,
        categoryId,
        subCategoryId: subCategory?.id,
        collectionId,
        price: null,
        description: `Available at Barokah Store Seminyak (${category.name}${
          subCategory ? ` · ${subCategory.name}` : ''
        }). Contact us on WhatsApp for available colors, sizes, and pricing.`,
        imageUrl,
        isNewArrival: false,
        createdAt: new Date().toISOString(),
      };
      createdProducts.push(product);
    }

    db.products = [...createdProducts, ...db.products];
    writeCatalogDb(db);
    res.status(201).json({ count: createdProducts.length, products: createdProducts });
  });

  app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
    const id = sanitizeText(req.params.id, 100);
    const db = readCatalogDb();
    const target = db.products.find((p) => p.id === id);
    if (!target) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    deleteSafeMediaFileIfManaged(target.imageUrl);
    db.products = db.products.filter((p) => p.id !== id);
    writeCatalogDb(db);
    res.json({ ok: true });
  });

  // Error handler for multer / JSON payload errors
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(400).json({ error: err.message || 'Bad request.' });
  });

  // Mount Vite middleware in development, or serve built dist/ in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BAROKAH STORE server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
