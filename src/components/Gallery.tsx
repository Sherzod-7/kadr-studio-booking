import { useState } from 'react';
import type { Studio } from '../data/studios';
import { StudioImage } from './StudioImage';

const VIEW_NAMES = ['umumiy ko‘rinish', 'boshqa burchak', 'jihozlar'];

export function Gallery({ studio }: { studio: Studio }) {
  const [active, setActive] = useState(0);
  const alt = (i: number) => `${studio.name}: ${VIEW_NAMES[i] ?? `${i + 1}-surat`}`;
  return (
    <section className="gallery" aria-label="Studiya suratlari">
      <StudioImage
        key={active}
        image={studio.images[active]}
        alt={alt(active)}
        priority
        sizes="(min-width: 1024px) 720px, 100vw"
        className="gallery__main"
      />
      <ul className="gallery__thumbs">
        {studio.images.map((img, i) => (
          <li key={img.file}>
            <button
              type="button"
              className="gallery__thumb"
              aria-label={`${i + 1}-suratni ko‘rsatish: ${VIEW_NAMES[i] ?? ''}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              <StudioImage image={img} alt="" sizes="160px" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
