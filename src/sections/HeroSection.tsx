import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import EditorialImage from '../components/EditorialImage';
import { BRAND } from '../data/brand';
import { COLLECTIONS } from '../data/collections';
import { IMAGES } from '../data/images';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export default function HeroSection() {
  return (
    <section className="border-b border-border bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* Left Editorial Typography & Hierarchy */}
          <div className="lg:col-span-6 order-2 lg:order-1 pb-2">
            <div className="inline-flex items-center gap-3 text-[11px] font-sans tracking-editorial uppercase text-earth">
              <span>Seminyak, Bali</span>
              <span aria-hidden="true">·</span>
              <span>Jalan Camplung Tanduk No. 15</span>
            </div>

            <h1 className="mt-6 font-serif display-hero text-charcoal">
              GOOD QUALITY.
              <br />
              GOOD STYLE.
              <br />
              <span className="italic font-normal text-charcoal/90">
                REASONABLE PRICE.
              </span>
            </h1>

            <p className="mt-7 text-base sm:text-lg text-stone leading-[1.65] max-w-lg">
              {BRAND.description.short}
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button to="/collections" variant="primary">
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button
                href={buildWhatsAppUrl(
                  'Hello Barokah Store, I would like to inquire about your products.'
                )}
                external
                variant="secondary"
              >
                Contact Us
              </Button>
            </div>
          </div>

          {/* Right Asymmetrical Layered Lookbook Composition */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative">
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-12 sm:col-span-9">
                  <EditorialImage
                    image={IMAGES.heroPrimary}
                    aspectClass="aspect-[4/5]"
                  />
                </div>
                <div className="hidden sm:block sm:col-span-3" />
              </div>

              {/* Overlapping Secondary Lookbook Frame */}
              <div className="hidden sm:block w-[42%] absolute right-0 bottom-8">
                <EditorialImage
                  image={IMAGES.heroSecondary}
                  aspectClass="aspect-[4/3]"
                  className="bg-sand"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Architectural Category Index Strip */}
        <div className="mt-12 lg:mt-16 pt-6 border-t border-border">
          <div className="flex items-center justify-between gap-4 mb-3 lg:hidden">
            <span className="text-[11px] font-sans tracking-editorial uppercase text-stone">
              Quick Category Index
            </span>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {COLLECTIONS.map((cat) => (
              <Link
                key={cat.id}
                to={`/collections?category=${encodeURIComponent(cat.id)}`}
                className="shrink-0 whitespace-nowrap inline-flex items-center gap-2 px-3.5 py-2.5 border border-border bg-sand/60 hover:border-charcoal hover:bg-sand text-xs font-sans text-charcoal transition-colors"
              >
                <span className="text-[11px] text-earth tabular-nums">
                  {cat.shortLabel}
                </span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
