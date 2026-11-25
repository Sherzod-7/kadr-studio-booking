import { useState } from 'react';
import { bookingRepository } from '../booking/repository';
import type { Booking } from '../booking/rules';
import { StudioImage } from '../components/StudioImage';
import { getStudio } from '../data/studios';
import { useMyBookings, useNow } from '../hooks/useBookings';
import { toDateTime } from '../lib/dates';
import { formatDateFriendly, formatPrice, formatRange } from '../lib/format';
import { href } from '../lib/router';

export function BookingsPage() {
  const mine = useMyBookings();
  const now = useNow();
  const [resetDone, setResetDone] = useState(false);

  const upcoming = mine?.filter((b) => toDateTime(b.date, b.end) > now) ?? [];
  const past = (mine?.filter((b) => toDateTime(b.date, b.end) <= now) ?? []).reverse();

  return (
    <div className="container narrow bookings">
      <h1 tabIndex={-1} data-page-title>
        Bronlarim
      </h1>
      <p className="muted">Bronlar shu brauzerda saqlanadi — sahifani yangilasangiz ham o‘chmaydi.</p>

      {mine === null ? null : mine.length === 0 ? (
        <div className="empty">
          <p className="empty__title">Hozircha bron yo‘q</p>
          <a className="btn btn--primary" href={href('/')}>
            Studiya tanlash
          </a>
        </div>
      ) : (
        <>
          <section aria-labelledby="upcoming">
            <h2 id="upcoming" className="section-title">
              Kelgusi ({upcoming.length})
            </h2>
            {upcoming.length === 0 ? (
              <p className="muted">Kelgusi bronlar yo‘q.</p>
            ) : (
              <ul className="booking-list">
                {upcoming.map((b) => (
                  <BookingItem key={b.id} booking={b} />
                ))}
              </ul>
            )}
          </section>
          {past.length > 0 && (
            <section aria-labelledby="past">
              <h2 id="past" className="section-title">
                O‘tgan ({past.length})
              </h2>
              <ul className="booking-list booking-list--past">
                {past.map((b) => (
                  <BookingItem key={b.id} booking={b} past />
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <section className="demo-box" aria-labelledby="demo-title">
        <h2 id="demo-title">Namoyish uchun</h2>
        <p>
          “Yorug‘ Loft” studiyasida ertaga 15:00–16:00 oldindan band qilingan. Qabul va rad etish holatlarini qaytadan
          sinash uchun o‘z bronlaringizni o‘chirib, boshlang‘ich holatga qayting.
        </p>
        <div className="demo-box__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={async () => {
              await bookingRepository.resetDemo();
              setResetDone(true);
            }}
          >
            Demo holatini tiklash
          </button>
          <a className="btn btn--ghost" href={href('/studiya/yorug-loft')}>
            Yorug‘ Loft sahifasi
          </a>
        </div>
        {resetDone && (
          <p className="inline-note" role="status">
            Tayyor: barcha bronlaringiz o‘chirildi, demo boshlang‘ich holatda.
          </p>
        )}
      </section>
    </div>
  );
}

function BookingItem({ booking, past = false }: { booking: Booking; past?: boolean }) {
  const studio = getStudio(booking.studioId);
  const [confirming, setConfirming] = useState(false);
  return (
    <li className="booking-item">
      {studio && <StudioImage image={studio.images[0]} alt="" sizes="96px" className="booking-item__media" />}
      <div className="booking-item__body">
        <a className="booking-item__title" href={href(`/studiya/${booking.studioId}`)}>
          {studio?.name ?? booking.studioId}
        </a>
        <p>{formatDateFriendly(booking.date)}</p>
        <p className="booking-item__time">
          {formatRange(booking.start, booking.end)} · {formatPrice(booking.total)}
        </p>
        {!past && (
          <div className="booking-item__actions">
            {confirming ? (
              <>
                <span className="muted">Bekor qilinsinmi?</span>
                <button type="button" className="btn btn--danger btn--sm" onClick={() => bookingRepository.cancel(booking.id)}>
                  Ha, bekor qilish
                </button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(false)}>
                  Yo‘q
                </button>
              </>
            ) : (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(true)}>
                Bekor qilish
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
