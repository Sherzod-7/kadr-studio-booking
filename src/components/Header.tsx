import { useMyBookings, useNow } from '../hooks/useBookings';
import { toDateTime } from '../lib/dates';

export function Header({ current }: { current: 'catalog' | 'bookings' | 'other' }) {
  const mine = useMyBookings();
  const now = useNow(60_000);
  const upcoming = mine?.filter((b) => toDateTime(b.date, b.end) > now).length ?? 0;
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="logo" href="#/" aria-label="Kadr — bosh sahifa" aria-current={current === 'catalog' ? 'page' : undefined}>
          <span className="logo__mark" aria-hidden="true" />
          Kadr
        </a>
        <nav aria-label="Asosiy">
          <a className="nav-link" href="#/bronlarim" aria-current={current === 'bookings' ? 'page' : undefined}>
            Bronlarim
            {upcoming > 0 && (
              <span className="badge" aria-label={`${upcoming} ta faol bron`}>
                {upcoming}
              </span>
            )}
          </a>
        </nav>
      </div>
    </header>
  );
}
