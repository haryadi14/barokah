import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditorialImage from '../components/EditorialImage';
import { BRAND } from '../data/brand';
import { IMAGES } from '../data/images';
import { useReveal } from '../hooks/useReveal';

export default function BrandIntroduction() {
  const { ref, visible } = useReveal();

  return (
    <section
      ref={ref}
      className={`border-b border-border bg-sand reveal-base ${
        visible ? 'reveal-visible' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 lg:pr-6">
            <span className="text-xs font-sans tracking-editorial uppercase text-earth">
              About Barokah Store
            </span>

            <h2 className="mt-4 font-serif display-section text-charcoal">
              DISCOVER BAROKAH STORE
            </h2>

            <p className="mt-6 font-serif italic text-xl sm:text-2xl text-charcoal/90 leading-snug">
              Everyday fashion and lifestyle accessories curated in Seminyak —
              for Bali visitors, locals, and shoppers worldwide.
            </p>

            <div className="mt-6 space-y-4 text-base text-stone leading-[1.7] max-w-xl">
              {BRAND.description.intro.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-9 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 text-xs font-sans font-medium tracking-editorial uppercase text-charcoal hover:text-earth transition-colors"
              >
                <span>Read More About Us</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <span className="text-xs font-sans text-stone">
                {BRAND.location.reference}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <EditorialImage image={IMAGES.brandIntro} aspectClass="aspect-[4/3]" />
          </div>
        </div>
      </div>
    </section>
  );
}
