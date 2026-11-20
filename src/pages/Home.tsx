import HeroSection from '../sections/HeroSection';
import CollectionSection from '../sections/CollectionSection';
import StoreSection from '../sections/StoreSection';
import ShippingCTA from '../sections/ShippingCTA';
import FAQSection from '../sections/FAQSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CollectionSection />
      <StoreSection />
      <ShippingCTA />
      <FAQSection />
    </>
  );
}
