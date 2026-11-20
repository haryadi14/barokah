export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'location',
    question: 'Where is Barokah Store located?',
    answer:
      'Barokah Store is located at Jalan Camplung Tanduk No. 15, Seminyak, Bali, Indonesia — right in front of Honeyboy Optic.',
  },
  {
    id: 'products',
    question: 'What products are available at Barokah Store?',
    answer:
      'We offer a wide selection of fashion and lifestyle items, including bags & handbags, wallets, sunglasses, perfumes, sandals & footwear, clothing, sports jerseys, and fashion accessories.',
  },
  {
    id: 'shipping',
    question: 'Do you offer worldwide shipping?',
    answer:
      'Yes. We welcome both local and international customers and offer worldwide shipping so you can shop with Barokah Store from anywhere.',
  },
  {
    id: 'online-order',
    question: 'How can I place an online order?',
    answer:
      'You can contact us directly via WhatsApp at +62 819-9913-0819 to inquire about products, check available options, and place your order.',
  },
  {
    id: 'consultation',
    question: 'Can I ask for product recommendations?',
    answer:
      'Yes. Our friendly team provides product consultation and helpful recommendations both in-store in Seminyak and online through WhatsApp.',
  },
  {
    id: 'contact',
    question: 'How can I contact Barokah Store?',
    answer:
      'You can reach us anytime on WhatsApp at +62 819-9913-0819 or visit our physical store at Jalan Camplung Tanduk No. 15, Seminyak, Bali.',
  },
];
