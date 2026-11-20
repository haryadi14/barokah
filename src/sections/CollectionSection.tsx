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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border">
          <div>
            <span className="text-xs font-sans tracking-editorial uppercase text-earth">
              Shop By Category
            </span>
            <h2 className="mt-3 font-serif display-section text-charcoal">
              EXPLORE OUR COLLECTIONS
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-8">
            <p className="text-sm sm:text-base text-stone">
              Find something that matches your style.
            </p>
            <Link
              to="/collections"
              className="text-xs font-sans tracking-editorial uppercase text-charcoal border-b border-charcoal pb-1 hover:text-earth hover:border-earth transition-colors self-start sm:self-auto whitespace-nowrap shrink-0"
            >
              View All 8 Categories
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
          {COLLECTIONS.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
}
