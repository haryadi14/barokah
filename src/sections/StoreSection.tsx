import { useState } from 'react';
import { Check, Copy, MapPin, MessageCircle, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditorialImage from '../components/EditorialImage';
import Button from '../components/Button';
import { BRAND } from '../data/brand';
import { IMAGES } from '../data/images';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export default function StoreSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(BRAND.location.fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard API unavailable in restricted contexts
    }
  };

  return (
    <section
      id="our-store"
      className="border-b border-border bg-sand/50 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Store Photograph */}
          <div className="lg:col-span-6">
            <EditorialImage
              image={IMAGES.storefront}
              aspectClass="aspect-[4/3] lg:aspect-[5/4]"
            />
          </div>

          {/* Store Story + Visit Details */}
          <div className="lg:col-span-6">
            <span className="text-xs font-sans tracking-editorial uppercase text-earth">
              Visit Us in Seminyak
            </span>

            <h2 className="mt-3 font-serif display-section text-charcoal">
              DISCOVER {BRAND.name}
            </h2>

            <p className="mt-4 text-base text-stone leading-relaxed max-w-xl">
              {BRAND.description.intro[0]} {BRAND.description.intro[1]}
            </p>

            <div className="mt-7 pt-6 border-t border-border space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-earth shrink-0 mt-1" aria-hidden="true" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-sans tracking-editorial uppercase text-stone">
                      Seminyak Store
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      aria-live="polite"
                      className="inline-flex items-center gap-1.5 text-[11px] font-sans tracking-editorial uppercase text-stone hover:text-charcoal transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-earth" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <address className="mt-1 not-italic text-base text-charcoal">
                    {BRAND.location.fullAddress}
                  </address>
                  <p className="mt-1 text-sm text-earth">
                    {BRAND.location.reference}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-earth shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-sans tracking-editorial uppercase text-stone">
                    WhatsApp
                  </p>
                  <a
                    href={buildWhatsAppUrl(
                      'Hello Barokah Store, I would like store directions or product info.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-block text-base text-charcoal hover:text-earth transition-colors"
                  >
                    {BRAND.contact.whatsappDisplay}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href={BRAND.location.mapsUrl} external variant="primary">
                <Navigation className="w-4 h-4" aria-hidden="true" />
                <span>Get Directions</span>
              </Button>
              <Button
                href={buildWhatsAppUrl(
                  'Hello Barokah Store, I plan to visit your store in Seminyak.'
                )}
                external
                variant="secondary"
              >
                WhatsApp Us
              </Button>
              <Link
                to="/about"
                className="ml-1 text-xs font-sans tracking-editorial uppercase text-stone hover:text-charcoal border-b border-transparent hover:border-charcoal pb-0.5 transition-colors"
              >
                About Us →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
