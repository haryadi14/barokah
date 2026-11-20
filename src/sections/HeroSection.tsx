import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { BRAND } from '../data/brand';
import { IMAGES } from '../data/images';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export default function HeroSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative w-full overflow-hidden border-b border-border bg-espresso min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] flex items-end lg:items-center">
      {/* Unified Full-Bleed Hero Image */}
      {!imgError && IMAGES.heroPrimary.src && (
        <img
          src={IMAGES.heroPrimary.src}
          alt={IMAGES.heroPrimary.alt}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}

      {/* Measured Contrast Scrim for WCAG AA Legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#1C1B18]/85 via-[#1C1B18]/50 to-[#1C1B18]/25 lg:bg-gradient-to-r lg:from-[#1C1B18]/85 lg:via-[#1C1B18]/50 lg:to-[#1C1B18]/15"
      />

      {/* Overlaid Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="max-w-xl">
          <p className="text-xs font-sans tracking-editorial uppercase text-ivory/80">
            Seminyak, Bali · Worldwide Shipping
          </p>

          <h1 className="mt-4 font-serif display-hero text-ivory">
            GOOD QUALITY.
            <br />
            GOOD STYLE.
            <br />
            <span className="italic font-normal text-ivory/95">
              REASONABLE PRICE.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-ivory/85 leading-[1.65] max-w-md">
            {BRAND.description.short}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Button to="/collections" variant="ivory">
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button
              href={buildWhatsAppUrl(
                'Hello Barokah Store, I would like to inquire about your products.'
              )}
              external
              variant="secondary"
              className="border-ivory text-ivory hover:bg-ivory hover:text-charcoal"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
