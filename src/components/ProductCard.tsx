import { Eye, MessageCircle } from 'lucide-react';
import { ProductItem } from '../data/products';
import EditorialImage from './EditorialImage';
import { buildProductInquiryUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: ProductItem;
  onPreview?: (product: ProductItem) => void;
}

export default function ProductCard({ product, onPreview }: ProductCardProps) {
  return (
    <article className="group flex flex-col justify-between bg-ivory border border-border transition-all duration-200 hover:-translate-y-0.5 hover:border-charcoal/45">
      <div>
        <div className="relative">
          <button
            type="button"
            onClick={() => onPreview?.(product)}
            className="w-full text-left block focus:outline-none focus-visible:ring-2 focus-visible:ring-earth"
            aria-label={`Preview ${product.name}`}
          >
            <EditorialImage image={product.image} aspectClass="aspect-[3/4]" />
          </button>

          {/* Desktop Quick-Action Hover Overlay */}
          <div className="hidden lg:flex absolute inset-x-3 bottom-3 z-20 gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <button
              type="button"
              onClick={() => onPreview?.(product)}
              className="flex-1 bg-ivory text-charcoal border border-charcoal py-2.5 px-3 text-[11px] font-sans tracking-editorial uppercase whitespace-nowrap inline-flex items-center justify-center gap-1.5 hover:bg-sand transition-colors"
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Quick View</span>
            </button>
            <a
              href={buildProductInquiryUrl(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-charcoal text-ivory border border-charcoal py-2.5 px-3 text-[11px] font-sans tracking-editorial uppercase whitespace-nowrap inline-flex items-center justify-center gap-1.5 hover:bg-earth hover:border-earth transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Inquire</span>
            </a>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-[11px] font-sans tracking-editorial uppercase text-earth">
            <span>{product.categoryName}</span>
            {product.isNewArrival && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-charcoal">New</span>
              </>
            )}
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

      {/* Mobile & Tablet Action Row */}
      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-border flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => onPreview?.(product)}
          className="min-h-[40px] px-1 text-xs font-sans tracking-editorial uppercase text-stone hover:text-charcoal"
        >
          Details
        </button>

        <a
          href={buildProductInquiryUrl(product.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[40px] px-1 inline-flex items-center gap-1.5 text-xs font-sans tracking-editorial uppercase text-charcoal font-medium"
        >
          <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Inquire</span>
        </a>
      </div>
    </article>
  );
}
