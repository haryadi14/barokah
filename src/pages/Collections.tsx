import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Button from '../components/Button';
import { COLLECTIONS } from '../data/collections';
import { PRODUCTS, ProductItem } from '../data/products';
import { buildCategoryInquiryUrl, buildWhatsAppUrl } from '../utils/whatsapp';

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const activeCategory = searchParams.get('category') || 'all';

  const activeCollectionObj = useMemo(
    () => COLLECTIONS.find((c) => c.id === activeCategory) || null,
    [activeCategory]
  );

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.categoryId === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  return (
    <div className="bg-ivory">
      <section className="border-b border-border bg-sand/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <span className="text-xs font-sans tracking-editorial uppercase text-earth">
            Collections
          </span>
          <h1 className="mt-3 font-serif display-section text-charcoal">
            {activeCollectionObj ? activeCollectionObj.name : 'ALL COLLECTIONS'}
          </h1>
          <p className="mt-4 text-base text-stone max-w-2xl leading-relaxed">
            {activeCollectionObj
              ? activeCollectionObj.subtitle
              : 'Explore handbags, wallets, sunglasses, perfumes, sandals, clothing, sports jerseys, and fashion accessories at reasonable prices.'}
          </p>

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
              All ({PRODUCTS.length})
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
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <p className="text-xs text-stone tabular-nums">
            Showing {filteredProducts.length} catalog{' '}
            {filteredProducts.length === 1 ? 'slot' : 'slots'} — message us on
            WhatsApp for live store stock and pricing.
          </p>

          <Button
            href={
              activeCollectionObj
                ? buildCategoryInquiryUrl(activeCollectionObj.name)
                : buildWhatsAppUrl(
                    'Hello Barokah Store, I would like to ask about your collections.'
                  )
            }
            external
            variant="secondary"
            className="self-start sm:self-auto"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>
              Inquire {activeCollectionObj ? activeCollectionObj.name : 'Collections'}
            </span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPreview={setSelectedProduct}
            />
          ))}
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
