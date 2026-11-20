import { BRAND } from '../data/brand';

export function buildWhatsAppUrl(message?: string): string {
  const base = BRAND.contact.whatsappUrl;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildProductInquiryUrl(productName: string): string {
  const message = `Hello Barokah Store, I would like to ask about ${productName}. Could you please provide more information?`;
  return buildWhatsAppUrl(message);
}

export function buildCategoryInquiryUrl(categoryName: string): string {
  const message = `Hello Barokah Store, I would like to explore your ${categoryName} collection. Could you please share what is currently available?`;
  return buildWhatsAppUrl(message);
}
