import { useState } from 'react';
import { X } from 'lucide-react';
import { BRAND } from '../data/brand';

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-espresso text-ivory border-b border-espresso">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-4">
        <span className="hidden sm:block w-5" aria-hidden="true" />
        <p className="text-[10px] sm:text-[11px] font-sans tracking-editorial uppercase text-center text-ivory/90 truncate">
          {BRAND.announcement}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="text-ivory/60 hover:text-ivory transition-colors p-1 -mr-1 shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-earth"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
