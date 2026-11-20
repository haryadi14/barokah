import { useState } from 'react';
import { ImageAsset } from '../data/images';

interface EditorialImageProps {
  image?: ImageAsset;
  aspectClass?: string;
  className?: string;
  imgClassName?: string;
  minimal?: boolean;
}

const TONE_CLASSES: Record<string, string> = {
  sand: 'bg-[#EEEAE2] text-charcoal',
  linen: 'bg-[#F2EFE8] text-charcoal',
  clay: 'bg-[#E5DCCF] text-charcoal',
  espresso: 'bg-[#252522] text-ivory',
};

export default function EditorialImage({
  image,
  aspectClass = 'aspect-[3/4]',
  className = '',
  imgClassName = '',
  minimal = false,
}: EditorialImageProps) {
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(image?.src) && !hasError;
  const toneKey = image?.tone || 'sand';
  const toneClass = TONE_CLASSES[toneKey] || TONE_CLASSES.sand;
  const isDarkTone = toneKey === 'espresso';

  return (
    <div
      className={`relative overflow-hidden border border-border bg-sand ${aspectClass} ${className}`}
    >
      {showImage ? (
        <img
          src={image!.src}
          alt={image!.alt || 'Barokah Store fashion photography'}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] ${imgClassName}`}
        />
      ) : (
        <div
          className={`w-full h-full relative flex flex-col justify-between p-5 sm:p-7 ${toneClass}`}
        >
          <div
            className={`relative z-10 flex items-center justify-between gap-2 text-[10px] font-sans tracking-editorial uppercase ${
              isDarkTone ? 'text-ivory/65' : 'text-stone'
            }`}
          >
            <span>{image?.plateIndex || 'Barokah'}</span>
            <span>Seminyak · Bali</span>
          </div>

          {!minimal && (
            <div className="relative z-10 my-auto py-2">
              <p
                className={`font-serif italic text-xl sm:text-2xl leading-tight ${
                  isDarkTone ? 'text-ivory' : 'text-charcoal'
                }`}
              >
                {image?.plateTitle || 'Barokah Store'}
              </p>
              {image?.plateSubtitle && (
                <p
                  className={`mt-2 text-[11px] font-sans tracking-wider uppercase ${
                    isDarkTone ? 'text-ivory/70' : 'text-stone'
                  }`}
                >
                  {image.plateSubtitle}
                </p>
              )}
            </div>
          )}

          <div
            className={`relative z-10 pt-3 border-t text-[10px] tracking-editorial uppercase ${
              isDarkTone
                ? 'border-ivory/15 text-ivory/50'
                : 'border-charcoal/10 text-stone'
            }`}
          >
            <span>BAROKAH STORE</span>
          </div>
        </div>
      )}
    </div>
  );
}
