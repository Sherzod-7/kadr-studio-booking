import { useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { BookingsPage } from './pages/BookingsPage';
import { CatalogPage } from './pages/CatalogPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { StudioPage } from './pages/StudioPage';
import { matchPath, useLocation } from './lib/router';

const TITLES: Record<string, string> = {
  catalog: 'Kadr — studiya toping',
  bookings: 'Bronlarim — Kadr',
};

export function App() {
  const { path } = useLocation();
  const first = useRef(true);

  let page: React.ReactNode;
  let section: 'catalog' | 'bookings' | 'other' = 'other';
  let p: Record<string, string> | null;
  if (path === '/') {
    page = <CatalogPage />;
    section = 'catalog';
  } else if (path === '/bronlarim') {
    page = <BookingsPage />;
    section = 'bookings';
  } else if ((p = matchPath('/studiya/:id', path))) {
    page = <StudioPage id={p.id} />;
  } else if ((p = matchPath('/bron/:id', path))) {
    page = <ConfirmationPage id={p.id} />;
  } else {
    page = <NotFoundPage />;
  }

  // Sahifa almashganda: tepaga qaytish va fokusni sarlavhaga o‘tkazish (klaviatura va ekran o‘quvchilar uchun).
  useEffect(() => {
    document.title = TITLES[section] ?? 'Kadr — studiya bron qilish';
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    const t = window.setTimeout(() => {
      document.querySelector<HTMLElement>('[data-page-title]')?.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(t);
  }, [path, section]);

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Asosiy qismga o‘tish
      </a>
      <Header current={section} />
      <main id="main" tabIndex={-1}>
        {page}
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>Kadr · demo versiya. Studiyalar, narxlar va bandlik namunaviy ma’lumotlar.</p>
        </div>
      </footer>
    </>
  );
}
