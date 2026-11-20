import { Link } from 'react-router-dom';
import CollectionCard from '../components/CollectionCard';
import { COLLECTIONS } from '../data/collections';
import { useReveal } from '../hooks/useReveal';

export default function CollectionSection() {
  const { ref, visible } = useReveal();

  return (
    <section
      ref={ref}
      className={`border-b border-border bg-ivory reveal-base ${
        visible ? 'reveal-visible' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-border">
          <div>
            <span className="text-xs font-sans tracking-editorial uppercase text-earth">
              Collections
            </span>
            <h2 className="mt-2.5 font-serif display-section text-charcoal">
              EXPLORE OUR COLLECTIONS
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone">
              Choose a collection to start browsing — find something that matches your style.
            </p>
          </div>

          <Link
            to="/collections"
            className="text-xs font-sans tracking-editorial uppercase text-charcoal border-b border-charcoal pb-1 hover:text-earth hover:border-earth transition-colors self-start sm:self-auto whitespace-nowrap shrink-0"
          >
            View All
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
          {COLLECTIONS.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
}
