import { useState } from 'react';
import { IMAGE_WIDTHS, type GeneratedImage } from '../data/images.generated';

const BASE = `${import.meta.env.BASE_URL}studios/`;

interface Props {
  image: GeneratedImage;
  alt: string;
  /** Birinchi ko‘rinadigan suratlar uchun true: darhol, yuqori ustuvorlik bilan yuklanadi. */
  priority?: boolean;
  sizes: string;
  className?: string;
}

/**
 * 4:3 nisbatli joy oldindan ajratiladi (karta sakramaydi), rang + 16 px xira surat
 * yuklanguncha fon bo‘lib turadi, haqiqiy surat ekran kengligiga mos o‘lchamda keladi.
 */
export function StudioImage({ image, alt, priority = false, sizes, className = '' }: Props) {
  const [loaded, setLoaded] = useState(false);
  const srcSet = IMAGE_WIDTHS.map((w) => `${BASE}${image.file}-${w}.webp ${w}w`).join(', ');
  return (
    <div
      className={`media ${loaded ? 'is-loaded' : ''} ${className}`}
      style={{ backgroundColor: image.color, backgroundImage: `url(${image.lqip})` }}
    >
      <img
        src={`${BASE}${image.file}-800.webp`}
        srcSet={srcSet}
        sizes={sizes}
        width={1200}
        height={900}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        ref={(el) => {
          // keshdan darhol kelgan suratlar uchun
          if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true);
        }}
      />
    </div>
  );
}
