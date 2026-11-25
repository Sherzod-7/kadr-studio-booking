import { STUDIO_TYPE_LABELS, type Studio } from '../data/studios';
import { formatPrice } from '../lib/format';
import { href } from '../lib/router';
import { StudioImage } from './StudioImage';
import { TypeTag } from './TypeTag';

export function StudioCard({ studio, priority }: { studio: Studio; priority: boolean }) {
  return (
    <li className="card">
      <a className="card__link" href={href(`/studiya/${studio.id}`)}>
        <StudioImage
          image={studio.images[0]}
          alt={`${studio.name} — ${STUDIO_TYPE_LABELS[studio.type].toLowerCase()} interyeri`}
          priority={priority}
          sizes="(min-width: 1100px) 360px, (min-width: 700px) 50vw, 100vw"
          className="card__media"
        />
        <div className="card__body">
          <div className="card__meta">
            <TypeTag type={studio.type} />
            <span className="card__district">{studio.district}</span>
          </div>
          <h2 className="card__title">{studio.name}</h2>
          <p className="card__highlight">{studio.highlight}</p>
          <p className="price">
            <strong>{formatPrice(studio.pricePerHour)}</strong> <span>/ soat</span>
          </p>
        </div>
      </a>
    </li>
  );
}
