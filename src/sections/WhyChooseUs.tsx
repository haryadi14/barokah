import { BRAND } from '../data/brand';
import { useReveal } from '../hooks/useReveal';

export default function WhyChooseUs() {
  const { ref, visible } = useReveal();

  return (
    <section
      ref={ref}
      className={`border-b border-border bg-ivory reveal-base ${
        visible ? 'reveal-visible' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
            <span className="text-xs font-sans tracking-editorial uppercase text-earth">
              Our Promise
            </span>
            <h2 className="mt-3 font-serif display-section text-charcoal">
              WHY BAROKAH STORE?
            </h2>
            <p className="mt-5 text-base text-stone leading-[1.7] max-w-md">
              Built around straightforward value, curated everyday style, and
              attentive customer care for shoppers in Bali and around the globe.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 border-t border-l border-border">
            {BRAND.advantages.map((item) => (
              <div
                key={item.index}
                className="p-7 sm:p-9 border-r border-b border-border bg-ivory hover:bg-sand/40 transition-colors"
              >
                <span className="font-serif italic text-3xl text-earth tabular-nums">
                  {item.index}
                </span>
                <h3 className="mt-6 font-sans text-xs sm:text-sm font-semibold tracking-editorial uppercase text-charcoal">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-stone leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
