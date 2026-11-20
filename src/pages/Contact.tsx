import { Globe, MapPin, MessageCircle, Navigation } from 'lucide-react';
import Button from '../components/Button';
import EditorialImage from '../components/EditorialImage';
import FAQSection from '../sections/FAQSection';
import { BRAND } from '../data/brand';
import { IMAGES } from '../data/images';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export default function Contact() {
  return (
    <div>
      <section className="border-b border-border bg-sand/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <span className="text-xs font-sans tracking-editorial uppercase text-earth">
            Contact &amp; Store Location
          </span>
          <h1 className="mt-3 font-serif display-section text-charcoal">
            GET IN TOUCH WITH BAROKAH STORE
          </h1>
          <p className="mt-4 text-base text-stone max-w-2xl leading-relaxed">
            Whether you are visiting Seminyak, Bali in person or ordering from
            overseas, our team is ready to assist you via WhatsApp.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-6 space-y-8">
              <div className="p-6 sm:p-8 bg-sand/50 border border-border">
                <div className="flex items-start gap-4">
                  <MessageCircle className="w-5 h-5 text-earth shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal">
                      WhatsApp Inquiry &amp; Online Orders
                    </h2>
                    <p className="mt-2 text-sm text-stone leading-relaxed">
                      Ask about product styles, request recommendations, or place
                      an order with worldwide shipping.
                    </p>
                    <p className="mt-3 text-base font-medium text-charcoal">
                      {BRAND.contact.whatsappDisplay}
                    </p>
                    <div className="mt-5">
                      <Button
                        href={buildWhatsAppUrl(
                          'Hello Barokah Store, I would like to ask about your products and services.'
                        )}
                        external
                        variant="primary"
                      >
                        <MessageCircle className="w-4 h-4" aria-hidden="true" />
                        <span>Chat on WhatsApp</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 border border-border">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-earth shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal">
                      Physical Store — Seminyak
                    </h2>
                    <address className="mt-3 not-italic text-base text-charcoal leading-relaxed">
                      {BRAND.location.addressLine1}
                      <br />
                      {BRAND.location.addressLine2}
                    </address>
                    <p className="mt-2 text-sm text-earth font-medium">
                      {BRAND.location.reference}
                    </p>
                    <div className="mt-5">
                      <Button href={BRAND.location.mapsUrl} external variant="secondary">
                        <Navigation className="w-4 h-4" aria-hidden="true" />
                        <span>Open Google Maps</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 border border-border flex items-start gap-4">
                <Globe className="w-5 h-5 text-earth shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h2 className="font-serif text-xl text-charcoal">
                    Worldwide Shipping Available
                  </h2>
                  <p className="mt-2 text-sm text-stone leading-relaxed">
                    {BRAND.statement} Contact us on WhatsApp for shipping arrangements
                    to your destination.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <EditorialImage image={IMAGES.storefront} aspectClass="aspect-[4/3]" />
              <EditorialImage image={IMAGES.storeInterior} aspectClass="aspect-[4/3]" />
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
    </div>
  );
}
