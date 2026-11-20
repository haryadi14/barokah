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
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-earth"
    >
      <EditorialImage
        image={collection.image}
        aspectClass="aspect-[4/5]"
        minimal
      />

      <div className="pt-3.5 pb-2 border-b border-border flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-serif text-lg sm:text-xl text-charcoal group-hover:text-earth transition-colors truncate">
            {collection.name}
          </h3>
          <p className="mt-0.5 text-xs text-stone truncate">
            {collection.subtitle}
          </p>
        </div>

        <ArrowUpRight
          aria-hidden="true"
          className="w-4 h-4 text-stone group-hover:text-charcoal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
        />
      </div>
    </Link>
  );
}
