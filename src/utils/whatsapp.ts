import { BRAND } from '../data/brand';
import { ProductItem } from '../data/products';

function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith('data:')) return '';
  if (typeof window === 'undefined') return pathOrUrl;
  try {
    return new URL(pathOrUrl, window.location.origin).toString();
  } catch {
    return pathOrUrl;
  }
}

export function buildWhatsAppUrl(message?: string): string {
  const base = BRAND.contact.whatsappUrl;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildProductViewUrl(product: ProductItem): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams();
  params.set('category', product.categoryId);
  if (product.subCollectionId) {
    params.set('brand', product.subCollectionId);
  }
  params.set('style', product.styleCode);
  return `${origin}/collections?${params.toString()}`;
}

export function buildProductInquiryUrl(product: ProductItem): string {
  const photoUrl = product.image?.src ? toAbsoluteUrl(product.image.src) : '';
  const viewStyleUrl = buildProductViewUrl(product);

  const lines = [
    `Hi ${BRAND.name}! I'm interested in ${product.categoryName} · ${product.name} (style ${product.styleCode}). Could you confirm available colours, sizes, and pricing before I visit or order?`,
    '',
    'Barokah Store collection',
    ...(photoUrl ? [`Photo: ${photoUrl}`] : []),
    `View style: ${viewStyleUrl}`,
  ];

  return buildWhatsAppUrl(lines.join('\n'));
}

export function buildCategoryInquiryUrl(
  categoryName: string,
  categoryId?: string,
  brandId?: string
): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams();
  if (categoryId && categoryId !== 'all') params.set('category', categoryId);
  if (brandId && brandId !== 'all') params.set('brand', brandId);
  const query = params.toString();
  const viewUrl = origin
    ? `${origin}/collections${query ? `?${query}` : ''}`
    : '';

  const lines = [
    `Hi ${BRAND.name}! I would like to explore your ${categoryName} collection. Could you please share what is currently available?`,
    ...(viewUrl ? ['', `View collection: ${viewUrl}`] : []),
  ];

  return buildWhatsAppUrl(lines.join('\n'));
}
