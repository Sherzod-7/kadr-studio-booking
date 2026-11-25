import { useEffect, useState } from 'react';
import { bookingRepository } from '../booking/repository';
import type { Booking } from '../booking/rules';
import { getStudio } from '../data/studios';
import { formatDateFriendly, formatPrice, formatRange } from '../lib/format';
import { href } from '../lib/router';
import { NotFoundPage } from './NotFoundPage';

export function ConfirmationPage({ id }: { id: string }) {
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);

  useEffect(() => {
    bookingRepository.getMine(id).then((b) => setBooking(b ?? null));
  }, [id]);

  if (booking === undefined) return <div className="container narrow" aria-busy="true" />;
  if (booking === null) return <NotFoundPage text="Bu bron topilmadi yoki bekor qilingan." />;

  const studio = getStudio(booking.studioId);
  return (
    <div className="container narrow">
      <div className="confirm">
        <div className="confirm__icon" aria-hidden="true">
          ✓
        </div>
        <h1 tabIndex={-1} data-page-title>
          Bron tasdiqlandi
        </h1>
        <dl className="confirm__details">
          <div>
            <dt>Studiya</dt>
            <dd>{studio?.name ?? booking.studioId}</dd>
          </div>
          <div>
            <dt>Sana</dt>
            <dd>{formatDateFriendly(booking.date)}</dd>
          </div>
          <div>
            <dt>Vaqt</dt>
            <dd>{formatRange(booking.start, booking.end)}</dd>
          </div>
          <div className="confirm__total">
            <dt>Jami narx</dt>
            <dd>{formatPrice(booking.total)}</dd>
          </div>
        </dl>
        <p className="muted confirm__note">To‘lov studiyada amalga oshiriladi (demo versiya).</p>
        <div className="confirm__actions">
          <a className="btn btn--primary btn--block" href={href('/bronlarim')}>
            Bronlarimga o‘tish
          </a>
          <a className="btn btn--ghost btn--block" href={href('/')}>
            Katalogga qaytish
          </a>
        </div>
      </div>
    </div>
  );
}
