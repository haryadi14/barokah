import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import EditorialImage from '../components/EditorialImage';
import ProductModal from '../components/ProductModal';
import Button from '../components/Button';
import { PRODUCTS, ProductItem } from '../data/products';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export default function NewArrivals() {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const arrivals = PRODUCTS.filter((item) => item.isNewArrival);

  return (
    <section className="border-b border-border bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-7">
            <span className="text-xs font-sans tracking-editorial uppercase text-earth">
              Latest Collection
            </span>
            <h2 className="mt-3 font-serif display-section text-charcoal">
              FRESH FINDS AT BAROKAH STORE
            </h2>
          </div>

          <div className="lg:col-span-5 flex lg:justify-end">
            <Button
              href={buildWhatsAppUrl(
                'Hello Barokah Store, could you share your latest new arrivals?'
              )}
              external
              variant="secondary"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Ask About New Arrivals</span>
            </Button>
          </div>
        </div>

        {/* Snap-scroll lookbook rail on mobile; asymmetric 12-col editorial spread on desktop */}
        <div className="flex md:grid md:grid-cols-12 gap-5 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-2 md:pb-0">
          {arrivals.map((item, idx) => {
            const spanClass =
              idx === 0
                ? 'w-[82vw] sm:w-[60vw] md:w-auto md:col-span-6 shrink-0 snap-start'
                : 'w-[72vw] sm:w-[48vw] md:w-auto md:col-span-3 shrink-0 snap-start';
            const aspectClass =
              idx === 0 ? 'aspect-[4/3] md:aspect-[5/4]' : 'aspect-[3/4]';

            return (
              <article key={item.id} className={`group ${spanClass}`}>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(item)}
                  className="w-full text-left block focus:outline-none focus-visible:ring-2 focus-visible:ring-earth"
                >
                  <EditorialImage image={item.image} aspectClass={aspectClass} />
                </button>
                <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-border pb-3">
                  <div>
                    <span className="text-[11px] font-sans tracking-editorial uppercase text-earth">
                      {item.categoryName}
                    </span>
                    <h3 className="mt-1 font-serif text-lg sm:text-xl text-charcoal group-hover:text-earth transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(item)}
                    className="text-xs font-sans tracking-editorial uppercase text-stone hover:text-charcoal shrink-0 whitespace-nowrap"
                  >
                    Preview
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
