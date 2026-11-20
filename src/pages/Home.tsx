import HeroSection from '../sections/HeroSection';
import BrandIntroduction from '../sections/BrandIntroduction';
import CollectionSection from '../sections/CollectionSection';
import ProductSection from '../sections/ProductSection';
import WhyChooseUs from '../sections/WhyChooseUs';
import ServicesSection from '../sections/ServicesSection';
import NewArrivals from '../sections/NewArrivals';
import StoreSection from '../sections/StoreSection';
import ShippingCTA from '../sections/ShippingCTA';
import FAQSection from '../sections/FAQSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <BrandIntroduction />
      <CollectionSection />
      <ProductSection />
      <WhyChooseUs />
      <ServicesSection />
      <NewArrivals />
      <StoreSection />
      <ShippingCTA />
      <FAQSection />
    </>
  );
}
