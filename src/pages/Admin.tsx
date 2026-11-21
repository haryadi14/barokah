import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  FolderPlus,
  ImagePlus,
  Layers,
  Lock,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import Button from '../components/Button';
import { useCatalog } from '../context/CatalogContext';
import { IMAGES } from '../data/images';

type AdminTab = 'products' | 'subcategories' | 'categories' | 'collections';

const PRESET_IMAGES = [
  { label: 'Hero Store Display', url: IMAGES.heroPrimary.src },
  { label: 'Bags & Handbags', url: IMAGES.categories.bags.src },
  { label: 'Wallets', url: IMAGES.categories.wallets.src },
  { label: 'Sunglasses', url: IMAGES.categories.sunglasses.src },
  { label: 'Perfumes', url: IMAGES.categories.perfumes.src },
  { label: 'Sandals & Footwear', url: IMAGES.categories.sandals.src },
  { label: 'Clothing', url: IMAGES.categories.clothing.src },
  { label: 'Sports Jerseys', url: IMAGES.categories.jerseys.src },
  { label: 'Fashion Accessories', url: IMAGES.categories.accessories.src },
  { label: 'Boutique Interior', url: IMAGES.storefront.src },
];

export default function Admin() {
  const {
    curatedCollections,
    categories,
    subCategories,
    products,
    adminToken,
    setAdminToken,
    refreshCatalog,
  } = useCatalog();

  const [authStatus, setAuthStatus] = useState<{
    loading: boolean;
    configured: boolean;
    usingEnvPasscode: boolean;
    authenticated: boolean;
  }>({
    loading: true,
    configured: true,
    usingEnvPasscode: false,
    authenticated: false,
  });

  const [passcodeInput, setPasscodeInput] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [busy, setBusy] = useState(false);

  // --- Bulk Upload Form State ---
  const [bulkCategory, setBulkCategory] = useState('bags-handbags');
  const [bulkSubCategory, setBulkSubCategory] = useState('ysl');
  const [bulkCollection, setBulkCollection] = useState('');
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);

  // --- Single Product Form State ---
  const [prodName, setProdName] = useState('');
  const [prodStyleCode, setProdStyleCode] = useState('');
  const [prodCategory, setProdCategory] = useState('bags-handbags');
  const [prodSubCategory, setProdSubCategory] = useState('');
  const [prodCollection, setProdCollection] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodFile, setProdFile] = useState<File | null>(null);
  const [prodIsNew, setProdIsNew] = useState(false);

  // --- Product Search / Filter ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // --- Sub-Category Form State ---
  const [subParentCat, setSubParentCat] = useState('bags-handbags');
  const [subName, setSubName] = useState('');

  // --- Category Form State ---
  const [catName, setCatName] = useState('');
  const [catSubtitle, setCatSubtitle] = useState('');
  const [catCollectionId, setCatCollectionId] = useState('');
  const [catImageUrl, setCatImageUrl] = useState(PRESET_IMAGES[1].url);
  const [catFile, setCatFile] = useState<File | null>(null);

  // --- Collection Form State ---
  const [colName, setColName] = useState('');
  const [colDesc, setColDesc] = useState('');
  const [colImageUrl, setColImageUrl] = useState(PRESET_IMAGES[0].url);
  const [colFile, setColFile] = useState<File | null>(null);

  // --- Inline Quick-Add (in Products & Bulk Upload tab) ---
  const [quickAddTarget, setQuickAddTarget] = useState<
    'bulk-cat' | 'bulk-sub' | 'prod-cat' | 'prod-sub' | null
  >(null);
  const [quickCatName, setQuickCatName] = useState('');
  const [quickCatSubtitle, setQuickCatSubtitle] = useState('');
  const [quickSubName, setQuickSubName] = useState('');

  // --- Inline Edit State (Categories & Sub-Categories) ---
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatSubtitle, setEditCatSubtitle] = useState('');
  const [editCatCollectionId, setEditCatCollectionId] = useState('');

  const [editingSubKey, setEditingSubKey] = useState<string | null>(null);
  const [editSubName, setEditSubName] = useState('');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/admin/status', {
          headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : undefined,
        });
        if (!res.ok) throw new Error('Status check failed');
        const data = (await res.json()) as {
          configured: boolean;
          usingEnvPasscode: boolean;
          authenticated: boolean;
        };
        setAuthStatus({
          loading: false,
          configured: data.configured,
          usingEnvPasscode: data.usingEnvPasscode,
          authenticated: data.authenticated || Boolean(adminToken && data.authenticated),
        });
      } catch {
        setAuthStatus((prev) => ({ ...prev, loading: false }));
      }
    };
    void checkStatus();
  }, [adminToken]);

  const bulkSubOptions = useMemo(
    () => subCategories.filter((s) => s.categoryId === bulkCategory),
    [subCategories, bulkCategory]
  );

  const singleSubOptions = useMemo(
    () => subCategories.filter((s) => s.categoryId === prodCategory),
    [subCategories, prodCategory]
  );

  useEffect(() => {
    if (categories.length > 0 && !categories.some((c) => c.id === bulkCategory)) {
      setBulkCategory(categories[0].id);
    }
    if (categories.length > 0 && !categories.some((c) => c.id === prodCategory)) {
      setProdCategory(categories[0].id);
    }
    if (categories.length > 0 && !categories.some((c) => c.id === subParentCat)) {
      setSubParentCat(categories[0].id);
    }
  }, [categories, bulkCategory, prodCategory, subParentCat]);

  useEffect(() => {
    if (!bulkSubOptions.some((s) => s.id === bulkSubCategory)) {
      setBulkSubCategory(bulkSubOptions[0]?.id || '');
    }
  }, [bulkCategory, bulkSubOptions, bulkSubCategory]);

  useEffect(() => {
    if (prodSubCategory && !singleSubOptions.some((s) => s.id === prodSubCategory)) {
      setProdSubCategory('');
    }
  }, [prodCategory, singleSubOptions, prodSubCategory]);

  const managedProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.isPlaceholder) return false;
      if (filterCategory !== 'all' && p.categoryId !== filterCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.styleCode.toLowerCase().includes(q) ||
          (p.subCollectionName || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, filterCategory, searchQuery]);

  const authHeaders = (): Record<string, string> =>
    adminToken ? { Authorization: `Bearer ${adminToken}` } : {};

  const uploadSingleImage = async (
    file: File,
    categoryId: string,
    subCategoryId?: string
  ): Promise<string> => {
    const form = new FormData();
    form.append('image', file);
    form.append('categoryId', categoryId);
    if (subCategoryId) form.append('subCategoryId', subCategoryId);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: authHeaders(),
      body: form,
    });
    const data = (await res.json()) as { imageUrl?: string; error?: string };
    if (!res.ok || !data.imageUrl) {
      throw new Error(data.error || 'Image upload failed.');
    }
    return data.imageUrl;
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (passcodeInput.length < 6) {
      setAuthError('Passcode must be at least 6 characters.');
      return;
    }
    if (passcodeInput !== confirmPasscode) {
      setAuthError('Passcodes do not match.');
      return;
    }
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeInput }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        setAuthError(data.error || 'Unable to set initial passcode.');
        return;
      }
      setAdminToken(data.token);
      setPasscodeInput('');
      setConfirmPasscode('');
    } catch {
      setAuthError('Network error while setting up admin access.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeInput }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        setAuthError(data.error || 'Invalid admin passcode.');
        return;
      }
      setAdminToken(data.token);
      setPasscodeInput('');
    } catch {
      setAuthError('Network error while signing in.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkFiles.length === 0) {
      setFeedback({ type: 'error', message: 'Please choose one or more image files first.' });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      const form = new FormData();
      form.append('categoryId', bulkCategory);
      if (bulkSubCategory) form.append('subCategoryId', bulkSubCategory);
      if (bulkCollection) form.append('collectionId', bulkCollection);
      for (const file of bulkFiles) {
        form.append('images', file);
      }

      const res = await fetch('/api/admin/products/bulk-upload', {
        method: 'POST',
        headers: authHeaders(),
        body: form,
      });
      const data = (await res.json()) as { count?: number; error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Bulk upload failed.');
      }
      setBulkFiles([]);
      await refreshCatalog();
      setFeedback({
        type: 'success',
        message: `${data.count || 0} products uploaded and published to the storefront.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Bulk upload failed.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleAddSingleProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      setFeedback({ type: 'error', message: 'Product name is required.' });
      return;
    }
    if (!prodFile && !prodImageUrl.trim()) {
      setFeedback({ type: 'error', message: 'Upload an image file or enter an image URL.' });
      return;
    }

    setBusy(true);
    setFeedback(null);
    try {
      let finalImageUrl = prodImageUrl.trim();
      if (prodFile) {
        finalImageUrl = await uploadSingleImage(
          prodFile,
          prodCategory,
          prodSubCategory || undefined
        );
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          name: prodName.trim(),
          styleCode: prodStyleCode.trim() || undefined,
          categoryId: prodCategory,
          subCategoryId: prodSubCategory || undefined,
          collectionId: prodCollection || undefined,
          price: prodPrice.trim() || null,
          description: prodDesc.trim(),
          imageUrl: finalImageUrl,
          isNewArrival: prodIsNew,
        }),
      });
      const data = (await res.json()) as { name?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to add product.');

      setProdName('');
      setProdStyleCode('');
      setProdPrice('');
      setProdDesc('');
      setProdImageUrl('');
      setProdFile(null);
      setProdIsNew(false);
      await refreshCatalog();
      setFeedback({ type: 'success', message: `Added product "${data.name}".` });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to add product.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (id.startsWith('catalog-')) {
      setFeedback({
        type: 'error',
        message: 'Bundled folder items from src/assets/catalog/ must be removed from disk.',
      });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Delete failed.');
      await refreshCatalog();
      setFeedback({ type: 'success', message: 'Product deleted.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Delete failed.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) {
      setFeedback({ type: 'error', message: 'Sub-category name is required.' });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/subcategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          categoryId: subParentCat,
          name: subName.trim(),
        }),
      });
      const data = (await res.json()) as { name?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to add sub-category.');
      setSubName('');
      await refreshCatalog();
      setFeedback({ type: 'success', message: `Added sub-category "${data.name}".` });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to add sub-category.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleSaveSubCategoryEdit = async (categoryId: string, id: string) => {
    if (!editSubName.trim()) {
      setFeedback({ type: 'error', message: 'Sub-category name cannot be empty.' });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch(
        `/api/admin/subcategories/${encodeURIComponent(categoryId)}/${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
          },
          body: JSON.stringify({ name: editSubName.trim() }),
        }
      );
      const data = (await res.json()) as { name?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'Update failed.');
      setEditingSubKey(null);
      setEditSubName('');
      await refreshCatalog();
      setFeedback({ type: 'success', message: `Renamed sub-category to "${data.name}".` });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Update failed.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteSubCategory = async (categoryId: string, id: string) => {
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch(
        `/api/admin/subcategories/${encodeURIComponent(categoryId)}/${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
          headers: authHeaders(),
        }
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Delete failed.');
      await refreshCatalog();
      setFeedback({ type: 'success', message: 'Sub-category deleted.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Delete failed.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      setFeedback({ type: 'error', message: 'Category name is required.' });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      let imageUrl = catImageUrl.trim();
      if (catFile) {
        imageUrl = await uploadSingleImage(catFile, catName.trim());
      }
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          name: catName.trim(),
          subtitle: catSubtitle.trim(),
          collectionId: catCollectionId || undefined,
          imageUrl,
        }),
      });
      const data = (await res.json()) as { name?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to add category.');
      setCatName('');
      setCatSubtitle('');
      setCatCollectionId('');
      setCatFile(null);
      await refreshCatalog();
      setFeedback({ type: 'success', message: `Added category "${data.name}".` });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to add category.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleSaveCategoryEdit = async (id: string) => {
    if (!editCatName.trim()) {
      setFeedback({ type: 'error', message: 'Category name cannot be empty.' });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          name: editCatName.trim(),
          subtitle: editCatSubtitle.trim(),
          collectionId: editCatCollectionId || '',
        }),
      });
      const data = (await res.json()) as { name?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to update category.');
      setEditingCatId(null);
      await refreshCatalog();
      setFeedback({ type: 'success', message: `Updated category "${data.name}".` });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update category.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleQuickCreateCategory = async (target: 'bulk' | 'prod') => {
    if (!quickCatName.trim()) {
      setFeedback({ type: 'error', message: 'Enter a category name first.' });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          name: quickCatName.trim(),
          subtitle: quickCatSubtitle.trim(),
          imageUrl: PRESET_IMAGES[1].url,
        }),
      });
      const data = (await res.json()) as { id?: string; name?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error || 'Failed to create category.');
      await refreshCatalog();
      if (target === 'bulk') {
        setBulkCategory(data.id);
        setBulkSubCategory('');
      } else {
        setProdCategory(data.id);
        setProdSubCategory('');
      }
      setQuickCatName('');
      setQuickCatSubtitle('');
      setQuickAddTarget(null);
      setFeedback({ type: 'success', message: `Category "${data.name}" created and selected.` });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create category.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleQuickCreateSubCategory = async (target: 'bulk' | 'prod') => {
    const parentCatId = target === 'bulk' ? bulkCategory : prodCategory;
    if (!quickSubName.trim()) {
      setFeedback({ type: 'error', message: 'Enter a sub-category name first.' });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/subcategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          categoryId: parentCatId,
          name: quickSubName.trim(),
        }),
      });
      const data = (await res.json()) as { id?: string; name?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error || 'Failed to create sub-category.');
      await refreshCatalog();
      if (target === 'bulk') {
        setBulkSubCategory(data.id);
      } else {
        setProdSubCategory(data.id);
      }
      setQuickSubName('');
      setQuickAddTarget(null);
      setFeedback({ type: 'success', message: `Sub-category "${data.name}" created and selected.` });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create sub-category.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Delete failed.');
      await refreshCatalog();
      setFeedback({ type: 'success', message: 'Category deleted.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Delete failed.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleAddCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) {
      setFeedback({ type: 'error', message: 'Collection name is required.' });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      let imageUrl = colImageUrl.trim();
      if (colFile) {
        imageUrl = await uploadSingleImage(colFile, 'collections');
      }
      const res = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          name: colName.trim(),
          description: colDesc.trim(),
          imageUrl,
        }),
      });
      const data = (await res.json()) as { name?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to add collection.');
      setColName('');
      setColDesc('');
      setColFile(null);
      await refreshCatalog();
      setFeedback({ type: 'success', message: `Added collection "${data.name}".` });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to add collection.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/collections/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Delete failed.');
      await refreshCatalog();
      setFeedback({ type: 'success', message: 'Collection deleted.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Delete failed.',
      });
    } finally {
      setBusy(false);
    }
  };

  if (authStatus.loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-sm text-stone">Checking admin session…</p>
      </section>
    );
  }

  // --- AUTH GATE (First-Run Claim or Sign In) ---
  if (!authStatus.authenticated) {
    return (
      <section className="bg-ivory border-b border-border py-16 sm:py-24">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-sand/50 border border-border p-7 sm:p-9">
            <div className="flex items-center gap-2.5 text-xs font-sans tracking-editorial uppercase text-earth">
              <Lock className="w-4 h-4" aria-hidden="true" />
              <span>Barokah Store · Admin Access</span>
            </div>

            <h1 className="mt-4 font-serif text-3xl text-charcoal">
              {authStatus.configured ? 'Admin Sign In' : 'Create Admin Passcode'}
            </h1>
            <p className="mt-2.5 text-sm text-stone leading-relaxed">
              {authStatus.configured
                ? 'Sign in with your store passcode to manage collections, categories, sub-categories, and products.'
                : 'First-time setup: create a secure admin passcode (minimum 6 characters) to protect your catalog manager.'}
            </p>

            {authError && (
              <p
                role="alert"
                className="mt-4 p-3 border border-charcoal bg-ivory text-xs text-charcoal"
              >
                {authError}
              </p>
            )}

            <form
              onSubmit={authStatus.configured ? handleLogin : handleClaim}
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="admin-passcode"
                  className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                >
                  Admin Passcode
                </label>
                <input
                  id="admin-passcode"
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="current-password"
                  placeholder="Enter passcode"
                  className="w-full px-3.5 py-3 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                />
              </div>

              {!authStatus.configured && (
                <div>
                  <label
                    htmlFor="admin-passcode-confirm"
                    className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                  >
                    Confirm Passcode
                  </label>
                  <input
                    id="admin-passcode-confirm"
                    type="password"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Re-enter passcode"
                    className="w-full px-3.5 py-3 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                  />
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={authSubmitting}
                className="w-full"
              >
                {authSubmitting
                  ? 'Please wait…'
                  : authStatus.configured
                  ? 'Sign In to Admin'
                  : 'Save & Open Admin'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-ivory">
      {/* Admin Top Header */}
      <section className="border-b border-border bg-sand/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-sans tracking-editorial uppercase text-earth">
                Catalog Management
              </span>
              <h1 className="mt-2 font-serif display-section text-charcoal">
                BAROKAH STORE ADMIN
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone tabular-nums">
                <span>{curatedCollections.length} Collections</span>
                <span aria-hidden="true">·</span>
                <span>{categories.length} Categories</span>
                <span aria-hidden="true">·</span>
                <span>{subCategories.length} Sub-Categories</span>
                <span aria-hidden="true">·</span>
                <span>{products.filter((p) => !p.isPlaceholder).length} Uploaded Products</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/collections"
                className="px-4 py-2.5 text-xs font-sans tracking-editorial uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory transition-colors whitespace-nowrap"
              >
                View Live Catalog
              </Link>
              <button
                type="button"
                onClick={() => setAdminToken(null)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-sans tracking-editorial uppercase border border-border bg-ivory text-stone hover:text-charcoal hover:border-charcoal transition-colors whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Admin Section Tabs */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {(
              [
                { id: 'products', label: 'Products & Bulk Upload' },
                { id: 'subcategories', label: 'Sub-Categories' },
                { id: 'categories', label: 'Categories' },
                { id: 'collections', label: 'Collections' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setFeedback(null);
                }}
                className={`shrink-0 whitespace-nowrap px-4 py-2.5 text-xs font-sans tracking-editorial uppercase border transition-colors ${
                  activeTab === tab.id
                    ? 'bg-charcoal text-ivory border-charcoal'
                    : 'bg-ivory text-charcoal border-border hover:border-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {feedback && (
          <div
            role="status"
            className={`mb-8 p-4 border text-sm flex items-center justify-between gap-4 ${
              feedback.type === 'error'
                ? 'bg-sand border-charcoal text-charcoal'
                : 'bg-ivory border-earth text-charcoal'
            }`}
          >
            <span>{feedback.message}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-xs uppercase tracking-wider text-stone hover:text-charcoal"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: PRODUCTS & BULK UPLOAD */}
        {activeTab === 'products' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Bulk Multi-Photo Upload */}
              <form
                onSubmit={handleBulkUpload}
                className="lg:col-span-6 p-6 sm:p-8 bg-sand/50 border border-border space-y-5"
              >
                <div className="flex items-center gap-2.5 text-xs font-sans tracking-editorial uppercase text-earth">
                  <Upload className="w-4 h-4" aria-hidden="true" />
                  <span>Bulk Upload (Up to 60 Photos at Once)</span>
                </div>
                <h2 className="font-serif text-2xl text-charcoal">
                  Upload Banyak Foto Sekaligus
                </h2>
                <p className="text-xs sm:text-sm text-stone leading-relaxed">
                  Pilih kategori dan sub-kategori, lalu pilih puluhan foto produk
                  sekaligus. Nama produk dan kode style dibuat otomatis dari nama file.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="bulk-cat"
                        className="block text-[11px] font-sans tracking-editorial uppercase text-stone"
                      >
                        Category
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setQuickAddTarget(quickAddTarget === 'bulk-cat' ? null : 'bulk-cat')
                        }
                        className="text-[11px] font-sans tracking-wider uppercase text-earth hover:text-charcoal"
                      >
                        {quickAddTarget === 'bulk-cat' ? 'Close' : '+ New Category'}
                      </button>
                    </div>
                    <select
                      id="bulk-cat"
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="bulk-sub"
                        className="block text-[11px] font-sans tracking-editorial uppercase text-stone"
                      >
                        Sub-Category
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setQuickAddTarget(quickAddTarget === 'bulk-sub' ? null : 'bulk-sub')
                        }
                        className="text-[11px] font-sans tracking-wider uppercase text-earth hover:text-charcoal"
                      >
                        {quickAddTarget === 'bulk-sub' ? 'Close' : '+ New Sub-Category'}
                      </button>
                    </div>
                    <select
                      id="bulk-sub"
                      value={bulkSubCategory}
                      onChange={(e) => setBulkSubCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                    >
                      <option value="">None / General</option>
                      {bulkSubOptions.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {quickAddTarget === 'bulk-cat' && (
                  <div className="p-4 bg-ivory border border-border space-y-3">
                    <p className="text-[11px] font-sans tracking-editorial uppercase text-earth">
                      Quick-Add New Category
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={quickCatName}
                        onChange={(e) => setQuickCatName(e.target.value)}
                        placeholder="Category name (e.g. Travel Bags)"
                        className="px-3 py-2 bg-ivory border border-border text-xs text-charcoal focus:outline-none focus:border-charcoal"
                      />
                      <input
                        type="text"
                        value={quickCatSubtitle}
                        onChange={(e) => setQuickCatSubtitle(e.target.value)}
                        placeholder="Short subtitle (optional)"
                        className="px-3 py-2 bg-ivory border border-border text-xs text-charcoal focus:outline-none focus:border-charcoal"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleQuickCreateCategory('bulk')}
                        className="px-3.5 py-2 bg-charcoal text-ivory text-[11px] font-sans tracking-editorial uppercase hover:bg-espresso transition-colors"
                      >
                        Save &amp; Select
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickAddTarget(null)}
                        className="px-3.5 py-2 border border-border text-[11px] font-sans tracking-editorial uppercase text-stone hover:text-charcoal"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {quickAddTarget === 'bulk-sub' && (
                  <div className="p-4 bg-ivory border border-border space-y-3">
                    <p className="text-[11px] font-sans tracking-editorial uppercase text-earth">
                      Add Sub-Category Under{' '}
                      {categories.find((c) => c.id === bulkCategory)?.name || bulkCategory}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={quickSubName}
                        onChange={(e) => setQuickSubName(e.target.value)}
                        placeholder="e.g. Chanel, Celine, NBA"
                        className="flex-1 px-3 py-2 bg-ivory border border-border text-xs text-charcoal focus:outline-none focus:border-charcoal"
                      />
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleQuickCreateSubCategory('bulk')}
                        className="px-3.5 py-2 bg-charcoal text-ivory text-[11px] font-sans tracking-editorial uppercase hover:bg-espresso transition-colors shrink-0"
                      >
                        Save &amp; Select
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickAddTarget(null)}
                        className="px-3.5 py-2 border border-border text-[11px] font-sans tracking-editorial uppercase text-stone hover:text-charcoal shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="bulk-col"
                    className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                  >
                    Collection (Optional)
                  </label>
                  <select
                    id="bulk-col"
                    value={bulkCollection}
                    onChange={(e) => setBulkCollection(e.target.value)}
                    className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                  >
                    <option value="">None</option>
                    {curatedCollections.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="bulk-files"
                    className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                  >
                    Select Product Images (JPG, PNG, WEBP, AVIF)
                  </label>
                  <input
                    id="bulk-files"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(e) => setBulkFiles(Array.from(e.target.files || []))}
                    className="w-full px-3 py-2.5 bg-ivory border border-border text-xs text-charcoal file:mr-3 file:px-3 file:py-1.5 file:border file:border-border file:bg-sand file:text-xs file:uppercase file:tracking-wider"
                  />
                  {bulkFiles.length > 0 && (
                    <p className="mt-2 text-xs text-charcoal tabular-nums">
                      {bulkFiles.length} {bulkFiles.length === 1 ? 'file' : 'files'} selected
                    </p>
                  )}
                </div>

                <Button type="submit" variant="primary" disabled={busy} className="w-full">
                  <Upload className="w-4 h-4" aria-hidden="true" />
                  <span>{busy ? 'Uploading…' : 'Upload & Create Products'}</span>
                </Button>
              </form>

              {/* Single Product Form */}
              <form
                onSubmit={handleAddSingleProduct}
                className="lg:col-span-6 p-6 sm:p-8 bg-ivory border border-border space-y-4"
              >
                <div className="flex items-center gap-2.5 text-xs font-sans tracking-editorial uppercase text-earth">
                  <ImagePlus className="w-4 h-4" aria-hidden="true" />
                  <span>Single Item</span>
                </div>
                <h2 className="font-serif text-2xl text-charcoal">Add Single Product</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="prod-name"
                      className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                    >
                      Product Name *
                    </label>
                    <input
                      id="prod-name"
                      type="text"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      required
                      placeholder="e.g. YSL Kate Shoulder Bag"
                      className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="prod-style"
                      className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                    >
                      Style Code (Optional)
                    </label>
                    <input
                      id="prod-style"
                      type="text"
                      value={prodStyleCode}
                      onChange={(e) => setProdStyleCode(e.target.value)}
                      placeholder="Auto-generated if blank"
                      className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="prod-cat"
                        className="block text-[11px] font-sans tracking-editorial uppercase text-stone"
                      >
                        Category *
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setQuickAddTarget(quickAddTarget === 'prod-cat' ? null : 'prod-cat')
                        }
                        className="text-[11px] font-sans tracking-wider uppercase text-earth hover:text-charcoal"
                      >
                        {quickAddTarget === 'prod-cat' ? 'Close' : '+ New'}
                      </button>
                    </div>
                    <select
                      id="prod-cat"
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="prod-sub"
                        className="block text-[11px] font-sans tracking-editorial uppercase text-stone"
                      >
                        Sub-Category
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setQuickAddTarget(quickAddTarget === 'prod-sub' ? null : 'prod-sub')
                        }
                        className="text-[11px] font-sans tracking-wider uppercase text-earth hover:text-charcoal"
                      >
                        {quickAddTarget === 'prod-sub' ? 'Close' : '+ New'}
                      </button>
                    </div>
                    <select
                      id="prod-sub"
                      value={prodSubCategory}
                      onChange={(e) => setProdSubCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                    >
                      <option value="">None</option>
                      {singleSubOptions.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="prod-price"
                      className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                    >
                      Price (Optional)
                    </label>
                    <input
                      id="prod-price"
                      type="text"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="Leave blank for WA inquiry"
                      className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                    />
                  </div>
                </div>

                {quickAddTarget === 'prod-cat' && (
                  <div className="p-4 bg-sand/40 border border-border space-y-3">
                    <p className="text-[11px] font-sans tracking-editorial uppercase text-earth">
                      Quick-Add New Category
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={quickCatName}
                        onChange={(e) => setQuickCatName(e.target.value)}
                        placeholder="Category name (e.g. Travel Bags)"
                        className="px-3 py-2 bg-ivory border border-border text-xs text-charcoal focus:outline-none focus:border-charcoal"
                      />
                      <input
                        type="text"
                        value={quickCatSubtitle}
                        onChange={(e) => setQuickCatSubtitle(e.target.value)}
                        placeholder="Short subtitle (optional)"
                        className="px-3 py-2 bg-ivory border border-border text-xs text-charcoal focus:outline-none focus:border-charcoal"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleQuickCreateCategory('prod')}
                        className="px-3.5 py-2 bg-charcoal text-ivory text-[11px] font-sans tracking-editorial uppercase hover:bg-espresso transition-colors"
                      >
                        Save &amp; Select
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickAddTarget(null)}
                        className="px-3.5 py-2 border border-border text-[11px] font-sans tracking-editorial uppercase text-stone hover:text-charcoal"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {quickAddTarget === 'prod-sub' && (
                  <div className="p-4 bg-sand/40 border border-border space-y-3">
                    <p className="text-[11px] font-sans tracking-editorial uppercase text-earth">
                      Add Sub-Category Under{' '}
                      {categories.find((c) => c.id === prodCategory)?.name || prodCategory}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={quickSubName}
                        onChange={(e) => setQuickSubName(e.target.value)}
                        placeholder="e.g. Chanel, Celine, NBA"
                        className="flex-1 px-3 py-2 bg-ivory border border-border text-xs text-charcoal focus:outline-none focus:border-charcoal"
                      />
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleQuickCreateSubCategory('prod')}
                        className="px-3.5 py-2 bg-charcoal text-ivory text-[11px] font-sans tracking-editorial uppercase hover:bg-espresso transition-colors shrink-0"
                      >
                        Save &amp; Select
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickAddTarget(null)}
                        className="px-3.5 py-2 border border-border text-[11px] font-sans tracking-editorial uppercase text-stone hover:text-charcoal shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="prod-col"
                      className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                    >
                      Collection (Optional)
                    </label>
                    <select
                      id="prod-col"
                      value={prodCollection}
                      onChange={(e) => setProdCollection(e.target.value)}
                      className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                    >
                      <option value="">None</option>
                      {curatedCollections.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="prod-file"
                      className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                    >
                      Upload Photo File
                    </label>
                    <input
                      id="prod-file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={(e) => setProdFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 bg-ivory border border-border text-xs text-charcoal"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="prod-img-url"
                    className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                  >
                    Or Image URL (if not uploading a file)
                  </label>
                  <input
                    id="prod-img-url"
                    type="text"
                    value={prodImageUrl}
                    onChange={(e) => setProdImageUrl(e.target.value)}
                    placeholder="https://... or /catalog-media/..."
                    className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label
                    htmlFor="prod-desc"
                    className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                  >
                    Description
                  </label>
                  <textarea
                    id="prod-desc"
                    rows={2}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Optional notes on material, colors, or sizes"
                    className="w-full px-3 py-2 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-xs text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsNew}
                    onChange={(e) => setProdIsNew(e.target.checked)}
                    className="accent-charcoal"
                  />
                  <span>Mark as New Arrival</span>
                </label>

                <Button type="submit" variant="primary" disabled={busy} className="w-full">
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add Product</span>
                </Button>
              </form>
            </div>

            {/* Uploaded Products List */}
            <div className="border-t border-border pt-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="font-serif text-2xl text-charcoal">
                  Catalog Products ({managedProducts.length})
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search
                      className="w-4 h-4 text-stone absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name or style..."
                      className="pl-9 pr-3 py-2 bg-ivory border border-border text-xs text-charcoal focus:outline-none focus:border-charcoal"
                    />
                  </div>

                  <select
                    aria-label="Filter products by category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 bg-ivory border border-border text-xs text-charcoal focus:outline-none focus:border-charcoal"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {managedProducts.length === 0 ? (
                <div className="p-8 border border-border bg-sand/40 text-center text-sm text-stone">
                  No uploaded products yet. Use Bulk Upload or Add Single Product above.
                </div>
              ) : (
                <div className="divide-y divide-border border border-border">
                  {managedProducts.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between gap-4 bg-ivory"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={item.image.src}
                          alt={item.name}
                          className="w-14 h-16 object-cover border border-border bg-sand shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center flex-wrap gap-x-2 text-[11px] font-sans tracking-wider uppercase text-earth">
                            <span>{item.categoryName}</span>
                            {item.subCollectionName && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-charcoal">{item.subCollectionName}</span>
                              </>
                            )}
                            <span aria-hidden="true">·</span>
                            <span className="text-stone tabular-nums">{item.styleCode}</span>
                          </div>
                          <p className="mt-1 font-serif text-lg text-charcoal truncate">
                            {item.name}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(item.id)}
                        disabled={busy}
                        aria-label={`Delete ${item.name}`}
                        className="p-2.5 border border-border text-stone hover:text-charcoal hover:border-charcoal transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SUB-CATEGORIES */}
        {activeTab === 'subcategories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <form
              onSubmit={handleAddSubCategory}
              className="lg:col-span-5 p-6 sm:p-8 bg-sand/50 border border-border space-y-5 self-start"
            >
              <div className="flex items-center gap-2 text-xs font-sans tracking-editorial uppercase text-earth">
                <FolderPlus className="w-4 h-4" aria-hidden="true" />
                <span>Add Sub-Category</span>
              </div>
              <h2 className="font-serif text-2xl text-charcoal">New Sub-Category</h2>
              <p className="text-xs text-stone leading-relaxed">
                Add brand or style folders under any category (for example YSL, Prada,
                Miu Miu, Dior, Goyard under Bags &amp; Handbags, or NBA / NRL / AFL under Sports Jerseys).
              </p>

              <div>
                <label
                  htmlFor="sub-parent"
                  className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                >
                  Parent Category *
                </label>
                <select
                  id="sub-parent"
                  value={subParentCat}
                  onChange={(e) => setSubParentCat(e.target.value)}
                  className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="sub-name"
                  className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                >
                  Sub-Category Name *
                </label>
                <input
                  id="sub-name"
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  required
                  placeholder="e.g. Chanel, Celine, NBA"
                  className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                />
              </div>

              <Button type="submit" variant="primary" disabled={busy} className="w-full">
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Sub-Category</span>
              </Button>
            </form>

            <div className="lg:col-span-7 space-y-6">
              {categories.map((cat) => {
                const subs = subCategories.filter((s) => s.categoryId === cat.id);
                return (
                  <div key={cat.id} className="border border-border bg-ivory">
                    <div className="px-5 py-3.5 bg-sand/40 border-b border-border flex items-center justify-between">
                      <h3 className="font-serif text-lg text-charcoal">{cat.name}</h3>
                      <span className="text-xs text-stone tabular-nums">
                        {subs.length} {subs.length === 1 ? 'folder' : 'folders'}
                      </span>
                    </div>
                    {subs.length === 0 ? (
                      <div className="px-5 py-4 flex items-center justify-between gap-4">
                        <p className="text-xs text-stone">
                          No sub-categories yet under {cat.name}.
                        </p>
                        <button
                          type="button"
                          onClick={() => setSubParentCat(cat.id)}
                          className="text-xs font-sans tracking-wider uppercase text-earth hover:text-charcoal"
                        >
                          Select to add
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {subs.map((sub) => {
                          const subKey = `${cat.id}::${sub.id}`;
                          const isEditing = editingSubKey === subKey;
                          return (
                            <div
                              key={sub.id}
                              className="px-5 py-3.5 flex items-center justify-between gap-4"
                            >
                              {isEditing ? (
                                <div className="flex-1 flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editSubName}
                                    onChange={(e) => setEditSubName(e.target.value)}
                                    aria-label="Edit sub-category name"
                                    className="flex-1 px-3 py-1.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                                  />
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => handleSaveSubCategoryEdit(cat.id, sub.id)}
                                    aria-label="Save sub-category name"
                                    className="p-2 bg-charcoal text-ivory hover:bg-espresso transition-colors"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingSubKey(null);
                                      setEditSubName('');
                                    }}
                                    aria-label="Cancel sub-category edit"
                                    className="p-2 border border-border text-stone hover:text-charcoal"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div>
                                    <p className="text-sm font-medium text-charcoal">{sub.name}</p>
                                    <p className="text-xs text-stone">
                                      /{cat.id}/{sub.id}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingSubKey(subKey);
                                        setEditSubName(sub.name);
                                      }}
                                      disabled={busy}
                                      aria-label={`Edit sub-category ${sub.name}`}
                                      className="p-2 border border-border text-stone hover:text-charcoal hover:border-charcoal transition-colors"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSubCategory(cat.id, sub.id)}
                                      disabled={busy}
                                      aria-label={`Delete sub-category ${sub.name}`}
                                      className="p-2 border border-border text-stone hover:text-charcoal hover:border-charcoal transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <form
              onSubmit={handleAddCategory}
              className="lg:col-span-5 p-6 sm:p-8 bg-sand/50 border border-border space-y-4 self-start"
            >
              <div className="flex items-center gap-2 text-xs font-sans tracking-editorial uppercase text-earth">
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>Add Category</span>
              </div>
              <h2 className="font-serif text-2xl text-charcoal">New Category</h2>

              <div>
                <label
                  htmlFor="cat-name"
                  className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                >
                  Category Name *
                </label>
                <input
                  id="cat-name"
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                  placeholder="e.g. Travel Bags"
                  className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label
                  htmlFor="cat-sub"
                  className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                >
                  Short Subtitle
                </label>
                <input
                  id="cat-sub"
                  type="text"
                  value={catSubtitle}
                  onChange={(e) => setCatSubtitle(e.target.value)}
                  placeholder="Short description shown on category card"
                  className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label
                  htmlFor="cat-col"
                  className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                >
                  Linked Collection (Optional)
                </label>
                <select
                  id="cat-col"
                  value={catCollectionId}
                  onChange={(e) => setCatCollectionId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                >
                  <option value="">None</option>
                  {curatedCollections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="cat-file"
                  className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                >
                  Upload Cover Image (Optional)
                </label>
                <input
                  id="cat-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => setCatFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 bg-ivory border border-border text-xs text-charcoal"
                />
              </div>

              <div>
                <label
                  htmlFor="cat-img-preset"
                  className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                >
                  Or Cover Image URL / Preset
                </label>
                <select
                  id="cat-img-preset"
                  value={catImageUrl}
                  onChange={(e) => setCatImageUrl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal mb-2"
                >
                  {PRESET_IMAGES.map((img) => (
                    <option key={img.label} value={img.url}>
                      Preset: {img.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={catImageUrl}
                  onChange={(e) => setCatImageUrl(e.target.value)}
                  placeholder="https://... or /catalog-media/..."
                  className="w-full px-3 py-2.5 bg-ivory border border-border text-xs text-charcoal focus:outline-none focus:border-charcoal"
                />
              </div>

              <Button type="submit" variant="primary" disabled={busy} className="w-full">
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Category</span>
              </Button>
            </form>

            <div className="lg:col-span-7 divide-y divide-border border border-border self-start">
              {categories.map((cat) => {
                const isEditing = editingCatId === cat.id;
                return (
                  <div key={cat.id} className="p-4 bg-ivory">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editCatName}
                            onChange={(e) => setEditCatName(e.target.value)}
                            aria-label="Edit category name"
                            placeholder="Category name"
                            className="px-3 py-2 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                          />
                          <select
                            aria-label="Edit linked collection"
                            value={editCatCollectionId}
                            onChange={(e) => setEditCatCollectionId(e.target.value)}
                            className="px-3 py-2 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                          >
                            <option value="">No Linked Collection</option>
                            {curatedCollections.map((col) => (
                              <option key={col.id} value={col.id}>
                                {col.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="text"
                          value={editCatSubtitle}
                          onChange={(e) => setEditCatSubtitle(e.target.value)}
                          aria-label="Edit category subtitle"
                          placeholder="Category subtitle"
                          className="w-full px-3 py-2 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleSaveCategoryEdit(cat.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-charcoal text-ivory text-[11px] font-sans tracking-editorial uppercase hover:bg-espresso transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCatId(null)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-border text-[11px] font-sans tracking-editorial uppercase text-stone hover:text-charcoal"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={cat.image.src}
                            alt={cat.name}
                            className="w-14 h-16 object-cover border border-border bg-sand shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-serif text-lg text-charcoal truncate">{cat.name}</p>
                            <p className="text-xs text-stone truncate">{cat.subtitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCatId(cat.id);
                              setEditCatName(cat.name);
                              setEditCatSubtitle(cat.subtitle);
                              setEditCatCollectionId(cat.collectionId || '');
                            }}
                            disabled={busy}
                            aria-label={`Edit category ${cat.name}`}
                            className="p-2.5 border border-border text-stone hover:text-charcoal hover:border-charcoal transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            disabled={busy}
                            aria-label={`Delete category ${cat.name}`}
                            className="p-2.5 border border-border text-stone hover:text-charcoal hover:border-charcoal transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: COLLECTIONS */}
        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <form
              onSubmit={handleAddCollection}
              className="lg:col-span-5 p-6 sm:p-8 bg-sand/50 border border-border space-y-4 self-start"
            >
              <div className="flex items-center gap-2 text-xs font-sans tracking-editorial uppercase text-earth">
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>Add Collection</span>
              </div>
              <h2 className="font-serif text-2xl text-charcoal">New Collection</h2>

              <div>
                <label
                  htmlFor="col-name"
                  className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                >
                  Collection Name *
                </label>
                <input
                  id="col-name"
                  type="text"
                  value={colName}
                  onChange={(e) => setColName(e.target.value)}
                  required
                  placeholder="e.g. Holiday Bali Edit"
                  className="w-full px-3 py-2.5 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label
                  htmlFor="col-desc"
                  className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="col-desc"
                  rows={3}
                  value={colDesc}
                  onChange={(e) => setColDesc(e.target.value)}
                  placeholder="Short description of this curated edit"
                  className="w-full px-3 py-2 bg-ivory border border-border text-sm text-charcoal focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label
                  htmlFor="col-file"
                  className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                >
                  Upload Cover Image (Optional)
                </label>
                <input
                  id="col-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => setColFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 bg-ivory border border-border text-xs text-charcoal"
                />
              </div>

              <div>
                <label
                  htmlFor="col-img"
                  className="block text-[11px] font-sans tracking-editorial uppercase text-stone mb-1.5"
                >
                  Or Cover Image URL
                </label>
                <input
                  id="col-img"
                  type="text"
                  value={colImageUrl}
                  onChange={(e) => setColImageUrl(e.target.value)}
                  placeholder="https://... or /catalog-media/..."
                  className="w-full px-3 py-2.5 bg-ivory border border-border text-xs text-charcoal focus:outline-none focus:border-charcoal"
                />
              </div>

              <Button type="submit" variant="primary" disabled={busy} className="w-full">
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Collection</span>
              </Button>
            </form>

            <div className="lg:col-span-7 divide-y divide-border border border-border self-start">
              {curatedCollections.map((col) => (
                <div
                  key={col.id}
                  className="p-4 flex items-center justify-between gap-4 bg-ivory"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={col.imageUrl}
                      alt={col.name}
                      className="w-14 h-16 object-cover border border-border bg-sand shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-serif text-lg text-charcoal truncate">{col.name}</p>
                      <p className="text-xs text-stone line-clamp-2">{col.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCollection(col.id)}
                    disabled={busy}
                    aria-label={`Delete collection ${col.name}`}
                    className="p-2.5 border border-border text-stone hover:text-charcoal hover:border-charcoal transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
