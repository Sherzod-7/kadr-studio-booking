import { useCallback, useEffect, useState } from 'react';
import { BOOKINGS_CHANGED, bookingRepository } from '../booking/repository';
import type { Booking } from '../booking/rules';
import type { ISODate } from '../lib/dates';

/** Bronlar o‘zgarganda (shu yoki boshqa vkladkada) qayta yuklash uchun hisoblagich. */
export function useBookingsVersion(): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    const bump = () => setV((x) => x + 1);
    window.addEventListener(BOOKINGS_CHANGED, bump);
    window.addEventListener('storage', bump);
    return () => {
      window.removeEventListener(BOOKINGS_CHANGED, bump);
      window.removeEventListener('storage', bump);
    };
  }, []);
  return v;
}

export function useMyBookings() {
  const version = useBookingsVersion();
  const [list, setList] = useState<Booking[] | null>(null);
  useEffect(() => {
    let alive = true;
    bookingRepository.listMine().then((l) => alive && setList(l));
    return () => {
      alive = false;
    };
  }, [version]);
  return list;
}

export function useBusy(studioId: string, date: ISODate) {
  const version = useBookingsVersion();
  const [state, setState] = useState<{ key: string; list: Booking[] } | null>(null);
  const key = `${studioId}|${date}`;
  const load = useCallback(() => {
    let alive = true;
    bookingRepository.getBusy(studioId, date).then((list) => alive && setState({ key, list }));
    return () => {
      alive = false;
    };
  }, [studioId, date, key]);
  useEffect(load, [load, version]);
  return state?.key === key ? state.list : null;
}

/** Joriy vaqt; o‘tgan soatlar avtomatik yopilishi uchun har 30 soniyada yangilanadi. */
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);
  return now;
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
