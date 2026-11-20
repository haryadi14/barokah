export interface NavItem {
  label: string;
  to: string;
}

export interface AdvantageItem {
  index: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export const BRAND = {
  name: 'BAROKAH STORE',
  category: 'Fashion Retail & Lifestyle Accessories',
  tagline: 'GOOD QUALITY. GOOD STYLE. REASONABLE PRICE.',
  statement: 'BAROKAH STORE — FROM BALI TO THE WORLD!',
  announcement: 'WORLDWIDE SHIPPING AVAILABLE — SHOP FROM ANYWHERE!',
  description: {
    short:
      'Discover your favorite fashion collections at Barokah Store. Explore stylish bags, accessories, footwear, clothing, and more — all at reasonable prices.',
    intro: [
      'Located in the heart of Seminyak, Bali, Barokah Store brings together a diverse selection of fashionable products and accessories for every style and occasion.',
      'From everyday essentials to stylish accessories, we aim to make quality fashion accessible through great products, reasonable prices, and friendly service.',
    ],
    full: [
      'Barokah Store is a fashion retail store located in Seminyak, Bali, Indonesia, offering a wide selection of fashionable products and accessories at affordable and reasonable prices.',
      'We offer a variety of products, including handbags, wallets, sunglasses, perfumes, sandals, clothing, sports jerseys, and other fashion accessories.',
      'Our mission is to provide customers with great quality, stylish designs, competitive prices, and excellent customer service.',
      'We welcome both local and international customers and aim to make shopping convenient and enjoyable, whether visiting our physical store in Bali or shopping from overseas.',
    ],
  },
  location: {
    area: 'Seminyak, Bali, Indonesia',
    addressLine1: 'Jalan Camplung Tanduk No. 15,',
    addressLine2: 'Seminyak, Bali, Indonesia.',
    fullAddress: 'Jalan Camplung Tanduk No. 15, Seminyak, Bali, Indonesia.',
    reference: 'Located right in front of Honeyboy Optic.',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Jalan+Camplung+Tanduk+No.+15+Seminyak+Bali+Indonesia',
  },
  contact: {
    whatsappDisplay: '+62 819-9913-0819',
    whatsappUrl: 'https://wa.me/6281999130819',
  },
  navigation: [
    { label: 'Home', to: '/' },
    { label: 'Collections', to: '/collections' },
    { label: 'About Us', to: '/about' },
    { label: 'Find a Store', to: '/#our-store' },
    { label: 'Contact', to: '/contact' },
  ] as NavItem[],
  advantages: [
    {
      index: '01.',
      title: 'QUALITY & STYLE',
      description:
        'Fashionable products and accessories selected to suit different styles and preferences.',
    },
    {
      index: '02.',
      title: 'REASONABLE PRICES',
      description:
        'Great value and competitive prices for everyday fashion shopping.',
    },
    {
      index: '03.',
      title: 'FRIENDLY SERVICE',
      description:
        'Helpful product consultation and customer assistance.',
    },
    {
      index: '04.',
      title: 'WORLDWIDE SHIPPING',
      description:
        'Shopping convenience for customers beyond Bali.',
    },
  ] as AdvantageItem[],
  services: [
    {
      title: 'IN-STORE SHOPPING',
      description:
        'Enjoy a convenient shopping experience at our physical store in Seminyak, Bali.',
    },
    {
      title: 'PRODUCT CONSULTATION',
      description:
        'Friendly assistance and recommendations to help customers find their favorite products.',
    },
    {
      title: 'WORLDWIDE SHIPPING',
      description:
        'We offer international shipping to customers around the world.',
    },
    {
      title: 'ONLINE ORDERS',
      description:
        'Customers can contact us through WhatsApp to inquire about products and place orders.',
    },
    {
      title: 'NEW ARRIVALS',
      description:
        'Regular updates featuring our latest collections and products.',
    },
  ] as ServiceItem[],
};
