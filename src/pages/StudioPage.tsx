import { useEffect, useRef, useState } from 'react';
import { BookingPanel } from '../components/booking/BookingPanel';
import { Gallery } from '../components/Gallery';
import { TypeTag } from '../components/TypeTag';
import { getStudio } from '../data/studios';
import { prefersReducedMotion } from '../hooks/useBookings';
import { formatPrice } from '../lib/format';
import { NotFoundPage } from './NotFoundPage';

export function StudioPage({ id }: { id: string }) {
  const studio = getStudio(id);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelVisible, setPanelVisible] = useState(false);

  // Telefonda pastki "Vaqt tanlash" paneli bron formasi ko‘rinib turganda yashiriladi.
  useEffect(() => {
    const el = panelRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setPanelVisible(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  if (!studio) return <NotFoundPage text="Bunday studiya topilmadi." />;

  const goToBooking = () => {
    const target = document.getElementById('bron');
    target?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    target?.focus({ preventScroll: true });
  };

  return (
    <div className="container studio">
      <a className="back-link" href="#/">
        <span aria-hidden="true">←</span> Katalog
      </a>
      <div className="studio__layout">
        <div className="studio__main">
          <Gallery studio={studio} />
          <div className="studio__head">
            <div className="studio__meta">
              <TypeTag type={studio.type} />
              <span>{studio.district}</span>
            </div>
            <h1 tabIndex={-1} data-page-title>
              {studio.name}
            </h1>
            <p className="price price--lg">
              <strong>{formatPrice(studio.pricePerHour)}</strong> <span>/ soat</span>
            </p>
            <button type="button" className="btn btn--primary btn--block studio__cta" onClick={goToBooking}>
              Vaqt tanlash
            </button>
          </div>

          <section className="info-block" aria-labelledby="about">
            <h2 id="about">Studiya haqida</h2>
            <p>{studio.description}</p>
            <dl className="facts">
              <div>
                <dt>Maydon</dt>
                <dd>{studio.area} m²</dd>
              </div>
              <div>
                <dt>Sig‘imi</dt>
                <dd>{studio.capacity} kishigacha</dd>
              </div>
              <div>
                <dt>Asosiy xususiyat</dt>
                <dd>{studio.highlight}</dd>
              </div>
            </dl>
          </section>

          <section className="info-block" aria-labelledby="equipment">
            <h2 id="equipment">Jihozlar</h2>
            <ul className="equipment">
              {studio.equipment.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </section>

          <section className="info-block" aria-labelledby="address">
            <h2 id="address">Manzil</h2>
            <p>
              Toshkent, {studio.district} tumani
              <br />
              {studio.address}
            </p>
          </section>
        </div>

        <aside className="studio__aside" ref={panelRef}>
          <BookingPanel key={studio.id} studio={studio} />
        </aside>
      </div>

      <div className={`sticky-cta ${panelVisible ? 'is-hidden' : ''}`} aria-hidden={panelVisible}>
        <p className="price">
          <strong>{formatPrice(studio.pricePerHour)}</strong> <span>/ soat</span>
        </p>
        <button type="button" className="btn btn--primary" onClick={goToBooking} tabIndex={panelVisible ? -1 : 0}>
          Vaqt tanlash
        </button>
      </div>
    </div>
  );
}
