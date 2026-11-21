import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, MapPin, MessageCircle } from 'lucide-react';
import { BRAND, NavItem } from '../data/brand';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (item.to === '/#our-store') {
      e.preventDefault();
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

  return (
    <footer className="bg-espresso text-ivory border-t border-espresso">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-ivory/15">
          <div className="md:col-span-5">
            <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-ivory">
              {BRAND.name}
            </h2>
            <p className="mt-3 text-xs font-sans tracking-editorial uppercase text-earth">
              {BRAND.tagline}
            </p>
            <p className="mt-6 text-sm text-ivory/80 max-w-md leading-relaxed">
              {BRAND.description.full[0]}
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-sans text-xs tracking-editorial uppercase text-ivory/60">
              Navigation
            </h3>
            <ul className="mt-5 space-y-3">
              {BRAND.navigation.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={(e) => handleNavClick(e, item)}
                    className="text-sm text-ivory/85 hover:text-earth transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-5">
            <h3 className="font-sans text-xs tracking-editorial uppercase text-ivory/60">
              Visit &amp; Contact
            </h3>

            <div className="flex items-start gap-3 text-sm text-ivory/85">
              <MessageCircle className="w-4 h-4 text-earth shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-ivory/60">
                  WhatsApp
                </p>
                <a
                  href={buildWhatsAppUrl(
                    'Hello Barokah Store, I would like to get in touch.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors"
                >
                  {BRAND.contact.whatsappDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-ivory/85">
              <MapPin className="w-4 h-4 text-earth shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-ivory/60">
                  Address
                </p>
                <a
                  href={BRAND.location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors"
                >
                  {BRAND.location.fullAddress}
                </a>
                <p className="text-xs text-ivory/60 mt-1">{BRAND.location.reference}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-ivory/85">
              <Globe className="w-4 h-4 text-earth shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-ivory/60">
                  Shipping
                </p>
                <p>Worldwide Shipping Available.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-ivory/70">
          <p className="tracking-editorial uppercase text-ivory">
            {BRAND.statement}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-ivory/60 hover:text-earth transition-colors">
              Admin Panel
            </Link>
            <span aria-hidden="true">·</span>
            <p>
              © {new Date().getFullYear()} {BRAND.name}. Seminyak, Bali, Indonesia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
