import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { FAQ_ITEMS } from '../data/faq';

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="text-xs font-sans tracking-editorial uppercase text-earth">
              Information
            </span>
            <h2 className="mt-3 font-serif display-section text-charcoal">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="mt-4 text-sm sm:text-base text-stone leading-relaxed">
              Clear answers about visiting our Seminyak store, product categories,
              and international orders via WhatsApp.
            </p>
          </div>

          <div className="lg:col-span-8 border-t border-border">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    className="w-full py-6 text-left flex items-center justify-between gap-6 group focus:outline-none focus-visible:ring-2 focus-visible:ring-earth"
                  >
                    <span className="font-serif text-lg sm:text-xl text-charcoal group-hover:text-earth transition-colors">
                      {item.question}
                    </span>
                    <span className="w-10 h-10 border border-border flex items-center justify-center shrink-0 text-charcoal group-hover:border-charcoal transition-colors">
                      {isOpen ? (
                        <Minus className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Plus className="w-4 h-4" aria-hidden="true" />
                      )}
                    </span>
                  </button>

                  <div
                    id={`faq-panel-${item.id}`}
                    data-open={isOpen}
                    className="accordion-panel"
                  >
                    <div className="accordion-inner">
                      <p className="pb-6 pr-12 text-sm sm:text-base text-stone leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
