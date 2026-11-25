// O‘zbekcha formatlash: narx, vaqt va sanalar.
import { addDays, parseISODate, toISODate, type ISODate } from './dates';

const NBSP = ' ';

/** 180000 → "180 000 so‘m" (bo‘sh joylar qatorda uzilmaydi). */
export function formatPrice(sum: number): string {
  const digits = Math.round(sum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${digits}${NBSP}so‘m`;
}

export const formatPricePerHour = (sum: number) => `${formatPrice(sum)} / soat`;

/** 840 → "14:00" */
export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** 840, 960 → "14:00–16:00" */
export const formatRange = (start: number, end: number) => `${formatTime(start)}–${formatTime(end)}`;

export const formatDuration = (hours: number) => `${hours} soat`;

export const MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];
export const WEEKDAYS = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'];
export const WEEKDAYS_SHORT = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

/** "26-noyabr, payshanba" */
export function formatDateLong(iso: ISODate): string {
  const d = parseISODate(iso);
  return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${WEEKDAYS[d.getDay()]}`;
}

/** "Bugun", "Ertaga" yoki null */
export function relativeDayLabel(iso: ISODate, today: ISODate): string | null {
  if (iso === today) return 'Bugun';
  if (iso === addDays(today, 1)) return 'Ertaga';
  return null;
}

/** "Ertaga, 26-noyabr" yoki "28-noyabr, shanba" */
export function formatDateFriendly(iso: ISODate, now = new Date()): string {
  const rel = relativeDayLabel(iso, toISODate(now));
  if (!rel) return formatDateLong(iso);
  const d = parseISODate(iso);
  return `${rel}, ${d.getDate()}-${MONTHS[d.getMonth()]}`;
}
