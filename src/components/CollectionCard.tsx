import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CollectionCategory } from '../data/collections';
import EditorialImage from './EditorialImage';

interface CollectionCardProps {
  collection: CollectionCategory;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      to={`/collections?category=${encodeURIComponent(collection.id)}`}
      className={`group block focus:outline-none focus-visible:ring-2 focus-visible:ring-earth ${collection.layoutClass}`}
    >
      <EditorialImage
        image={collection.image}
        aspectClass={collection.aspectClass}
        minimal
      />

      <div className="pt-4 pb-3 border-b border-border flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-sans tracking-editorial text-earth shrink-0 tabular-nums">
              {collection.shortLabel}
            </span>
            <h3 className="font-serif text-lg sm:text-2xl text-charcoal group-hover:text-earth transition-colors truncate">
              {collection.name}
            </h3>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-stone leading-relaxed line-clamp-2">
            {collection.subtitle}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex items-center justify-center w-9 h-9 border border-border text-charcoal group-hover:bg-charcoal group-hover:text-ivory group-hover:border-charcoal transition-all duration-200 shrink-0"
        >
          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
