import EditorialImage from '../components/EditorialImage';
import WhyChooseUs from '../sections/WhyChooseUs';
import ServicesSection from '../sections/ServicesSection';
import ShippingCTA from '../sections/ShippingCTA';
import { BRAND } from '../data/brand';
import { IMAGES } from '../data/images';

export default function About() {
  return (
    <div>
      <section className="border-b border-border bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-sans tracking-editorial uppercase text-earth">
                About Us
              </span>
              <h1 className="mt-3 font-serif display-section text-charcoal">
                {BRAND.name}
              </h1>
              <p className="mt-3 text-xs font-sans tracking-editorial uppercase text-stone">
                {BRAND.tagline}
              </p>

              <div className="mt-8 space-y-4 text-base text-stone leading-relaxed">
                {BRAND.description.full.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <EditorialImage
                image={IMAGES.brandIntro}
                aspectClass="aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <ServicesSection />
      <ShippingCTA />
    </div>
  );
}
