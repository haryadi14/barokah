import { MessageCircle } from 'lucide-react';
import Button from '../components/Button';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export default function ShippingCTA() {
  return (
    <section className="border-b border-border bg-espresso text-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <span className="text-xs font-sans tracking-editorial uppercase text-earth">
              Worldwide Shipping Available
            </span>
            <h2 className="mt-4 font-serif display-section text-ivory">
              FROM BALI TO THE WORLD!
            </h2>
            <p className="mt-5 text-base sm:text-lg text-ivory/80 leading-[1.7] max-w-2xl">
              Discover your favorite fashion collections at Barokah Store. Visit our
              store in Seminyak, Bali, or shop with us from anywhere in the world
              through our international shipping service.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <Button
              href={buildWhatsAppUrl(
                'Hello Barokah Store, I would like to shop with you and ask about worldwide shipping.'
              )}
              external
              variant="ivory"
              className="w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Shop With Us</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
