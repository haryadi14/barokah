import { MessageCircle } from 'lucide-react';
import { ProductItem } from '../data/products';
import EditorialImage from './EditorialImage';
import { buildProductInquiryUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: ProductItem;
  onPreview?: (product: ProductItem) => void;
}

export default function ProductCard({ product, onPreview }: ProductCardProps) {
  return (
    <article className="group flex flex-col justify-between bg-ivory border border-border transition-colors duration-200 hover:border-charcoal/45">
      <div>
        <button
          type="button"
          onClick={() => onPreview?.(product)}
          className="w-full text-left block focus:outline-none focus-visible:ring-2 focus-visible:ring-earth"
          aria-label={`Preview ${product.name}`}
        >
          <EditorialImage image={product.image} aspectClass="aspect-[3/4]" />
        </button>

        <div className="p-4 sm:p-5">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] font-sans tracking-editorial uppercase text-earth">
            <span>{product.categoryName}</span>
            {product.subCollectionName && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-charcoal">{product.subCollectionName}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="text-stone tabular-nums">{product.styleCode}</span>
          </div>

          <h3 className="mt-1.5 font-serif text-lg sm:text-xl text-charcoal leading-snug">
            <button
              type="button"
              onClick={() => onPreview?.(product)}
              className="text-left hover:text-earth transition-colors focus:outline-none"
            >
              {product.name}
            </button>
          </h3>

          {product.price ? (
            <p className="mt-2 text-sm font-medium text-charcoal tabular-nums">
              {product.price}
            </p>
          ) : (
            <p className="mt-2 text-xs text-stone">
              Available for inquiry via WhatsApp
            </p>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-border flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onPreview?.(product)}
          className="min-h-[40px] px-1 text-xs font-sans tracking-editorial uppercase text-stone hover:text-charcoal transition-colors"
        >
          Details
        </button>

        <a
          href={buildProductInquiryUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[40px] px-1 inline-flex items-center gap-1.5 text-xs font-sans tracking-editorial uppercase text-charcoal hover:text-earth transition-colors font-medium"
        >
          <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Inquire to WhatsApp</span>
        </a>
      </div>
    </article>
  );
}
