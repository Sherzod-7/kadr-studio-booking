// Sana va vaqt yordamchilari. Sana — mahalliy vaqt bo‘yicha 'YYYY-MM-DD' qatori,
// vaqt — kun boshidan beri o‘tgan daqiqalar (14:00 → 840).

export type ISODate = string;

const pad = (n: number) => String(n).padStart(2, '0');

export function toISODate(d: Date): ISODate {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseISODate(iso: ISODate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: ISODate, days: number): ISODate {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function isValidISODate(v: string | null | undefined): v is ISODate {
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  return toISODate(parseISODate(v)) === v;
}

/** Sana va daqiqadan mahalliy Date obyekti. */
export function toDateTime(iso: ISODate, minutes: number): Date {
  const d = parseISODate(iso);
  d.setMinutes(minutes);
  return d;
}

export const hoursToMinutes = (h: number) => h * 60;
