import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, MessageCircle, X } from 'lucide-react';
import { BRAND, NavItem } from '../data/brand';
import { COLLECTIONS } from '../data/collections';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import AnnouncementBar from './AnnouncementBar';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash, location.search]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (item.to === '/#our-store') {
      e.preventDefault();
      setMobileOpen(false);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById('our-store')?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        document.getElementById('our-store')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/' && location.hash !== '#our-store';
    if (to === '/#our-store') return location.pathname === '/' && location.hash === '#our-store';
    return location.pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory border-b border-border">
      <AnnouncementBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-[72px] flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            to="/"
            className="font-serif text-xl sm:text-2xl tracking-tight text-charcoal whitespace-nowrap shrink-0 hover:text-earth transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-earth"
          >
            {BRAND.name}
          </Link>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8">
            {BRAND.navigation.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`relative py-1.5 text-xs font-sans tracking-editorial uppercase whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'text-charcoal font-medium'
                      : 'text-stone hover:text-charcoal'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 right-0 bottom-0 h-[1.5px] bg-charcoal transition-transform duration-200 origin-left ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Primary WhatsApp Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={buildWhatsAppUrl(
                'Hello Barokah Store, I would like to ask about your products.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-charcoal text-ivory px-4 py-2.5 text-xs font-sans tracking-editorial uppercase whitespace-nowrap shrink-0 hover:bg-earth transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-earth"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 border border-border text-charcoal hover:border-charcoal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-earth"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Height Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-ivory border-t border-border overflow-y-auto"
        >
          <nav
            aria-label="Mobile navigation"
            className="max-w-7xl mx-auto px-5 py-6 flex flex-col justify-between min-h-full"
          >
            <div>
              <div className="divide-y divide-border border-b border-border">
                {BRAND.navigation.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={(e) => handleNavClick(e, item)}
                    className="py-4 font-serif text-2xl text-charcoal flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs font-sans text-stone" aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>

              <div className="mt-7">
                <p className="text-[11px] font-sans tracking-editorial uppercase text-earth mb-3">
                  Browse Collections
                </p>
                <div className="flex flex-wrap gap-2">
                  {COLLECTIONS.map((col) => (
                    <Link
                      key={col.id}
                      to={`/collections?category=${encodeURIComponent(col.id)}`}
                      className="px-3.5 py-2.5 text-xs font-sans tracking-wider uppercase border border-border bg-sand text-charcoal hover:border-charcoal transition-colors"
                    >
                      {col.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 pb-6 mt-8 border-t border-border">
              <a
                href={buildWhatsAppUrl(
                  'Hello Barokah Store, I would like to inquire about your collections.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-charcoal text-ivory px-5 py-4 text-xs font-sans tracking-editorial uppercase"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>WhatsApp ({BRAND.contact.whatsappDisplay})</span>
              </a>
              <p className="mt-4 text-xs text-stone text-center">
                {BRAND.location.fullAddress}
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
