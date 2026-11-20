import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Folder, MessageCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Button from '../components/Button';
import { COLLECTIONS } from '../data/collections';
import { ALL_CATALOG_PRODUCTS, BAG_SUBCOLLECTIONS } from '../data/catalogLoader';
import { ProductItem } from '../data/products';
import { buildCategoryInquiryUrl, buildWhatsAppUrl } from '../utils/whatsapp';

const PAGE_SIZE = 24;

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const activeCategory = searchParams.get('category') || 'all';
  const activeBrand = searchParams.get('brand') || 'all';
  const styleParam = searchParams.get('style');

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, activeBrand]);

  // Open product detail modal automatically when visiting a WhatsApp View style link (?style=...)
  useEffect(() => {
    if (!styleParam) {
      setSelectedProduct(null);
      return;
    }
    const matched = ALL_CATALOG_PRODUCTS.find(
      (item) => item.styleCode.toLowerCase() === styleParam.toLowerCase()
    );
    if (matched) {
      setSelectedProduct(matched);
    }
  }, [styleParam]);

  const activeCollectionObj = useMemo(
    () => COLLECTIONS.find((c) => c.id === activeCategory) || null,
    [activeCategory]
  );

  const activeBrandObj = useMemo(
    () => BAG_SUBCOLLECTIONS.find((b) => b.id === activeBrand) || null,
    [activeBrand]
  );

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const brand of BAG_SUBCOLLECTIONS) {
      counts[brand.id] = ALL_CATALOG_PRODUCTS.filter(
        (p) => p.categoryId === 'bags-handbags' && p.subCollectionId === brand.id
      ).length;
    }
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    let items = ALL_CATALOG_PRODUCTS;
    if (activeCategory !== 'all') {
      items = items.filter((p) => p.categoryId === activeCategory);
    }
    if (activeCategory === 'bags-handbags' && activeBrand !== 'all') {
      items = items.filter((p) => p.subCollectionId === activeBrand);
    }
    return items;
  }, [activeCategory, activeBrand]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleCount < filteredProducts.length;

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const handleBrandChange = (brandId: string) => {
    if (brandId === 'all') {
      setSearchParams({ category: 'bags-handbags' });
    } else {
      setSearchParams({ category: 'bags-handbags', brand: brandId });
    }
  };

  const handleOpenProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    const next = new URLSearchParams(searchParams);
    next.set('style', product.styleCode);
    setSearchParams(next, { replace: true });
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    if (searchParams.has('style')) {
      const next = new URLSearchParams(searchParams);
      next.delete('style');
      setSearchParams(next, { replace: true });
    }
  };

  const inquiryLabel =
    activeCategory === 'bags-handbags' && activeBrandObj
      ? `${activeBrandObj.name} Bags`
      : activeCollectionObj
      ? activeCollectionObj.name
      : 'Collections';

  return (
    <div className="bg-ivory">
      <section className="border-b border-border bg-sand/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <span className="text-xs font-sans tracking-editorial uppercase text-earth">
            Collections
          </span>
          <h1 className="mt-3 font-serif display-section text-charcoal">
            {activeCategory === 'bags-handbags' && activeBrandObj
              ? `${activeBrandObj.name} — Bags & Handbags`
              : activeCollectionObj
              ? activeCollectionObj.name
              : 'ALL COLLECTIONS'}
          </h1>
          <p className="mt-4 text-base text-stone max-w-2xl leading-relaxed">
            {activeCollectionObj
              ? activeCollectionObj.subtitle
              : 'Explore handbags, wallets, sunglasses, perfumes, sandals, clothing, sports jerseys, and fashion accessories at reasonable prices.'}
          </p>

          {/* Main Category Filter Tabs */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className={`shrink-0 whitespace-nowrap px-4 py-2.5 text-xs font-sans tracking-editorial uppercase border transition-colors ${
                activeCategory === 'all'
                  ? 'bg-charcoal text-ivory border-charcoal'
                  : 'bg-ivory text-charcoal border-border hover:border-charcoal'
              }`}
            >
              All ({ALL_CATALOG_PRODUCTS.length})
            </button>

            {COLLECTIONS.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`shrink-0 whitespace-nowrap px-4 py-2.5 text-xs font-sans tracking-editorial uppercase border transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-charcoal text-ivory border-charcoal'
                    : 'bg-ivory text-charcoal border-border hover:border-charcoal'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Bags & Handbags Sub-Collection Folders (YSL, Prada, Miu Miu, Dior, Goyard) */}
          {activeCategory === 'bags-handbags' && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-[11px] font-sans tracking-editorial uppercase text-stone mb-3">
                Bags &amp; Handbags Folders
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleBrandChange('all')}
                  className={`flex items-center justify-between gap-2 px-4 py-3 text-left border transition-colors ${
                    activeBrand === 'all'
                      ? 'bg-charcoal text-ivory border-charcoal'
                      : 'bg-ivory text-charcoal border-border hover:border-charcoal'
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider truncate">
                    <Folder className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>All Brands</span>
                  </span>
                </button>

                {BAG_SUBCOLLECTIONS.map((brand) => {
                  const isSelected = activeBrand === brand.id;
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => handleBrandChange(brand.id)}
                      className={`flex items-center justify-between gap-2 px-4 py-3 text-left border transition-colors ${
                        isSelected
                          ? 'bg-charcoal text-ivory border-charcoal'
                          : 'bg-ivory text-charcoal border-border hover:border-charcoal'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs font-sans font-medium truncate">
                        <Folder
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? 'text-earth' : 'text-stone'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{brand.name}</span>
                      </span>
                      <span
                        className={`text-[11px] tabular-nums shrink-0 ${
                          isSelected ? 'text-ivory/75' : 'text-stone'
                        }`}
                      >
                        {brandCounts[brand.id] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <p className="text-xs text-stone tabular-nums">
            Showing {visibleProducts.length} of {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'item' : 'items'} — message us on
            WhatsApp for live store stock and pricing.
          </p>

          <Button
            href={
              activeCollectionObj
                ? buildCategoryInquiryUrl(
                    inquiryLabel,
                    activeCategory,
                    activeCategory === 'bags-handbags' ? activeBrand : undefined
                  )
                : buildWhatsAppUrl(
                    'Hello Barokah Store, I would like to ask about your collections.'
                  )
            }
            external
            variant="secondary"
            className="self-start sm:self-auto"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>Inquire {inquiryLabel}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPreview={handleOpenProduct}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            >
              Load More ({filteredProducts.length - visibleCount} remaining)
            </Button>
          </div>
        )}
      </section>

      <ProductModal product={selectedProduct} onClose={handleCloseProduct} />
    </div>
  );
}
