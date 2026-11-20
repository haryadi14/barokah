import { useEffect } from 'react';
import { MapPin, MessageCircle, X } from 'lucide-react';
import { ProductItem } from '../data/products';
import EditorialImage from './EditorialImage';
import Button from './Button';
import { buildProductInquiryUrl } from '../utils/whatsapp';
import { BRAND } from '../data/brand';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  useEffect(() => {
    if (!product) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-espresso/65 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-ivory border border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="md:col-span-6">
          <EditorialImage
            image={product.image}
            aspectClass="aspect-[3/4] h-full"
            className="border-0 md:border-r border-border"
          />
        </div>

        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-[11px] font-sans tracking-editorial uppercase text-earth">
                {product.categoryName}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close product details"
                className="w-10 h-10 inline-flex items-center justify-center border border-border text-charcoal hover:border-charcoal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-earth"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3
              id="product-modal-title"
              className="mt-5 font-serif text-2xl sm:text-3xl text-charcoal leading-snug"
            >
              {product.name}
            </h3>

            <p className="mt-4 text-sm sm:text-base text-stone leading-relaxed">
              {product.description}
            </p>

            {product.price ? (
              <p className="mt-5 text-lg font-medium text-charcoal tabular-nums">
                {product.price}
              </p>
            ) : (
              <div className="mt-6 p-4 bg-sand border border-border text-xs text-stone leading-relaxed">
                Message our team on WhatsApp to check current colors, sizes, and
                pricing. Worldwide shipping available.
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-border space-y-3.5">
            <Button
              href={buildProductInquiryUrl(product.name)}
              external
              variant="primary"
              className="w-full"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Inquire via WhatsApp</span>
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-stone text-center">
              <MapPin className="w-3.5 h-3.5 text-earth shrink-0" aria-hidden="true" />
              <span>{BRAND.location.fullAddress}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
