import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { COLLECTIONS } from '../data/collections';
import { PRODUCTS, ProductItem } from '../data/products';

export default function ProductSection() {
  const [activeFilter, setActiveFilter] = useState<string>('featured');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const visibleProducts = useMemo(() => {
    if (activeFilter === 'featured') {
      return PRODUCTS.filter((item) => item.isFeatured);
    }
    return PRODUCTS.filter((item) => item.categoryId === activeFilter);
  }, [activeFilter]);

  return (
    <section className="border-b border-border bg-sand/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-sans tracking-editorial uppercase text-earth">
              Curated Showcase
            </span>
            <h2 className="mt-3 font-serif display-section text-charcoal">
              OUR FAVORITE PICKS
            </h2>
          </div>

          <Link
            to="/collections"
            className="text-xs font-sans tracking-editorial uppercase text-charcoal border-b border-charcoal pb-1 hover:text-earth hover:border-earth transition-colors self-start lg:self-auto whitespace-nowrap shrink-0"
          >
            Browse Full Catalog
          </Link>
        </div>

        {/* Interactive Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-8 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveFilter('featured')}
            className={`shrink-0 whitespace-nowrap px-4 py-2.5 text-xs font-sans tracking-editorial uppercase border transition-colors ${
              activeFilter === 'featured'
                ? 'bg-charcoal text-ivory border-charcoal'
                : 'bg-ivory text-charcoal border-border hover:border-charcoal'
            }`}
          >
            Favorite Picks
          </button>

          {COLLECTIONS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveFilter(cat.id)}
              className={`shrink-0 whitespace-nowrap px-4 py-2.5 text-xs font-sans tracking-editorial uppercase border transition-colors ${
                activeFilter === cat.id
                  ? 'bg-charcoal text-ivory border-charcoal'
                  : 'bg-ivory text-charcoal border-border hover:border-charcoal'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div
          aria-live="polite"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPreview={setSelectedProduct}
            />
          ))}
        </div>

        <p className="mt-6 text-xs text-stone">
          Sample catalog slots active — contact us via WhatsApp for live store
          availability and pricing.
        </p>
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
