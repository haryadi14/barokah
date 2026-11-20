import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import EditorialImage from '../components/EditorialImage';
import Button from '../components/Button';
import { BRAND } from '../data/brand';
import { IMAGES } from '../data/images';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface ServiceAction {
  label: string;
  href: string;
  external: boolean;
}

const SERVICE_ACTIONS: Record<string, ServiceAction> = {
  'IN-STORE SHOPPING': {
    label: 'Get Store Directions',
    href: BRAND.location.mapsUrl,
    external: true,
  },
  'PRODUCT CONSULTATION': {
    label: 'Ask for Recommendations',
    href: buildWhatsAppUrl(
      'Hello Barokah Store, I would like product recommendations.'
    ),
    external: true,
  },
  'WORLDWIDE SHIPPING': {
    label: 'Inquire About Shipping',
    href: buildWhatsAppUrl(
      'Hello Barokah Store, I would like to ask about worldwide shipping.'
    ),
    external: true,
  },
  'ONLINE ORDERS': {
    label: 'Order via WhatsApp',
    href: buildWhatsAppUrl(
      'Hello Barokah Store, I would like to place an online order.'
    ),
    external: true,
  },
  'NEW ARRIVALS': {
    label: 'Ask About Latest Items',
    href: buildWhatsAppUrl(
      'Hello Barokah Store, could you share your latest arrivals?'
    ),
    external: true,
  },
};

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = BRAND.services[activeIndex];
  const activeAction = SERVICE_ACTIONS[activeService.title];

  return (
    <section className="border-b border-border bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          <span className="text-xs font-sans tracking-editorial uppercase text-earth">
            Our Services
          </span>
          <h2 className="mt-3 font-serif display-section text-charcoal">
            A CONVENIENT SHOPPING EXPERIENCE
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Interactive Service Selector */}
          <div className="lg:col-span-7 divide-y divide-border border-t border-b border-border">
            {BRAND.services.map((service, index) => {
              const isSelected = index === activeIndex;
              return (
                <button
                  key={service.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left py-6 px-3 sm:px-5 transition-colors flex items-start gap-4 sm:gap-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-earth ${
                    isSelected ? 'bg-ivory' : 'hover:bg-ivory/50'
                  }`}
                >
                  <span
                    className={`text-xs font-sans tracking-editorial w-8 shrink-0 pt-1 tabular-nums ${
                      isSelected ? 'text-earth font-semibold' : 'text-stone'
                    }`}
                  >
                    0{index + 1}.
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-sans text-xs sm:text-sm font-semibold tracking-editorial uppercase text-charcoal">
                        {service.title}
                      </h3>
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected
                            ? 'text-charcoal translate-x-0'
                            : 'text-stone/50 -translate-x-1'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-2 text-sm sm:text-base text-stone leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Contextual Service Feature Panel */}
          <div className="lg:col-span-5 bg-ivory border border-border p-5 sm:p-6">
            <EditorialImage
              image={IMAGES.servicesFeature}
              aspectClass="aspect-[4/3]"
            />
            <div className="mt-6">
              <div className="flex items-center gap-2 text-[11px] font-sans tracking-editorial uppercase text-earth">
                <span>Selected Service</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">0{activeIndex + 1}</span>
              </div>
              <h3 className="mt-2 font-serif text-2xl text-charcoal">
                {activeService.title}
              </h3>
              <p className="mt-2 text-sm text-stone leading-relaxed">
                {activeService.description}
              </p>
              {activeAction && (
                <div className="mt-6">
                  <Button
                    href={activeAction.href}
                    external={activeAction.external}
                    variant="primary"
                    className="w-full"
                  >
                    <span>{activeAction.label}</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
