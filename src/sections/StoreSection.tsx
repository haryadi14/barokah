import { useState } from 'react';
import { Check, Copy, MapPin, MessageCircle, Navigation } from 'lucide-react';
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
      className="border-b border-border bg-sand/70 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Exterior + Interior Editorial Plates */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-7">
              <EditorialImage
                image={IMAGES.storefront}
                aspectClass="aspect-[4/5]"
              />
            </div>
            <div className="sm:col-span-5">
              <EditorialImage
                image={IMAGES.storeInterior}
                aspectClass="aspect-[4/3] sm:aspect-[3/4]"
              />
            </div>
          </div>

          {/* Store Location Dossier */}
          <div className="lg:col-span-5">
            <span className="text-xs font-sans tracking-editorial uppercase text-earth">
              Store Experience
            </span>

            <h2 className="mt-3 font-serif display-section text-charcoal">
              VISIT US IN SEMINYAK
            </h2>

            <div className="mt-8 border-t border-border pt-6 space-y-6">
              <div>
                <p className="text-[11px] font-sans tracking-editorial uppercase text-stone">
                  Physical Retail Store
                </p>
                <p className="mt-1 font-serif text-2xl text-charcoal">
                  {BRAND.name}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-earth shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-sans tracking-editorial uppercase text-stone">
                      Address
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      aria-live="polite"
                      className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-sans tracking-editorial uppercase text-stone hover:text-charcoal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-earth"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-earth" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                  </div>

                  <address className="mt-1 not-italic text-base text-charcoal leading-relaxed">
                    {BRAND.location.addressLine1}
                    <br />
                    {BRAND.location.addressLine2}
                  </address>
                  <p className="mt-2 text-sm text-earth font-medium">
                    {BRAND.location.reference}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-earth shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-sans tracking-editorial uppercase text-stone">
                    WhatsApp
                  </p>
                  <a
                    href={buildWhatsAppUrl(
                      'Hello Barokah Store, I would like directions or store information.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-base text-charcoal hover:text-earth transition-colors"
                  >
                    {BRAND.contact.whatsappDisplay}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-9 flex flex-col sm:flex-row gap-3.5">
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
                WhatsApp Store
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
