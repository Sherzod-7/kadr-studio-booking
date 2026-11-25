// Bron qoidalari — sof funksiyalar, UI va saqlash usuliga bog‘liq emas.
// Backend ulanganda xuddi shu qoida serverda ham tekshiriladi; frontend esa
// javobni shu turlar (BookingDecision) ko‘rinishida qabul qiladi.
import { toDateTime, type ISODate } from '../lib/dates';

export interface TimeRange {
  start: number; // daqiqa, kun boshidan
  end: number;
}

export interface Booking extends TimeRange {
  id: string;
  studioId: string;
  date: ISODate;
  total: number;
  createdAt: string;
}

export interface BookingRequest {
  studioId: string;
  date: ISODate;
  start: number;
  durationHours: number;
}

export interface StudioHours {
  id: string;
  openHour: number;
  closeHour: number;
  pricePerHour: number;
}

export const ALLOWED_DURATIONS = [1, 2, 3] as const;
export const SLOT_STEP_MINUTES = 60;

export type InvalidCode = 'past' | 'before-open' | 'after-close' | 'invalid-duration';

export type BookingDecision =
  | { status: 'accepted'; range: TimeRange; total: number }
  | { status: 'invalid'; code: InvalidCode; range: TimeRange }
  | { status: 'conflict'; range: TimeRange; conflicts: TimeRange[]; suggestions: TimeRange[] };

export const toRange = (start: number, durationHours: number): TimeRange => ({
  start,
  end: start + durationHours * 60,
});

/** Yarim ochiq oraliqlar [start, end): 14–16 va 16–17 kesishmaydi. */
export const overlaps = (a: TimeRange, b: TimeRange) => a.start < b.end && b.start < a.end;

/** Bir studiya va bir sanadagi bronlar ichidan kesishganlarini qaytaradi. */
export function findConflicts(
  req: { studioId: string; date: ISODate } & TimeRange,
  existing: Booking[],
): Booking[] {
  return existing
    .filter((b) => b.studioId === req.studioId && b.date === req.date && overlaps(b, req))
    .sort((a, b) => a.start - b.start);
}

/** Kesishishdan tashqari tekshiruvlar: davomiylik, o‘tgan vaqt, ish vaqti. */
  
    expect(slotState(loft, tomorrow, H(8), [], now)).toBe('closed');
    expect(slotState(loft, tomorrow, H(9), [], now)).toBe('free');
  });
export function validateRequest(req: BookingRequest, studio: StudioHours, now: Date): InvalidCode | null {
  if (!(ALLOWED_DURATIONS as readonly number[]).includes(req.durationHours)) return 'invalid-duration';
  const range = toRange(req.start, req.durationHours);
  if (toDateTime(req.date, range.start).getTime() <= now.getTime()) return 'past';
  if (range.start < studio.openHour * 60) return 'before-open';
  if (range.end > studio.closeHour * 60) return 'after-close';
  return null;
}

/**
 * Shu sanada kerakli davomiylikka sig‘adigan bo‘sh boshlanish vaqtlari,
 * so‘ralgan vaqtga yaqinligi bo‘yicha saralangan.
 */
export function findFreeSlots(
  studio: StudioHours,
  date: ISODate,
  durationHours: number,
  existing: Booking[],
  now: Date,
  preferredStart: number,
  limit = 2,
): TimeRange[] {
  const result: TimeRange[] = [];
  const open = studio.openHour * 60;
  const lastStart = studio.closeHour * 60 - durationHours * 60;
  for (let start = open; start <= lastStart; start += SLOT_STEP_MINUTES) {
    const req: BookingRequest = { studioId: studio.id, date, start, durationHours };
    if (validateRequest(req, studio, now)) continue;
    const range = toRange(start, durationHours);
    if (findConflicts({ studioId: studio.id, date, ...range }, existing).length === 0) result.push(range);
  }
  return result
    .sort((a, b) => Math.abs(a.start - preferredStart) - Math.abs(b.start - preferredStart) || a.start - b.start)
    .slice(0, limit);
}

/**
 * Eng yaqin bo‘sh vaqt birinchi turadi; ikkinchi variant — undan qarama-qarshi tomondagi
 * eng yaqin vaqt (masalan, biri bandlikdan oldin, biri keyin).
 */
function pickSuggestions(sorted: TimeRange[], preferredStart: number): TimeRange[] {
  if (sorted.length === 0) return [];
  const [first] = sorted;
  const firstIsEarlier = first.start < preferredStart;
  const other = sorted.find((r) => (firstIsEarlier ? r.start > preferredStart : r.start < preferredStart));
  return other ? [first, other] : sorted.slice(0, 2);
}

/** Asosiy qoida: tekshiruvdan o‘tsa va boshqa bron bilan kesishmasa — tasdiqlanadi. */
export function decideBooking(
  req: BookingRequest,
  studio: StudioHours,
  existing: Booking[],
  now: Date,
): BookingDecision {
  const range = toRange(req.start, req.durationHours);
  const invalid = validateRequest(req, studio, now);
  if (invalid) return { status: 'invalid', code: invalid, range };

  const conflicts = findConflicts({ studioId: req.studioId, date: req.date, ...range }, existing);
  if (conflicts.length > 0) {
    return {
      status: 'conflict',
      range,
      conflicts: conflicts.map(({ start, end }) => ({ start, end })),
      suggestions: pickSuggestions(
        findFreeSlots(studio, req.date, req.durationHours, existing, now, req.start, Infinity),
        req.start,
      ),
    };
  }
  return { status: 'accepted', range, total: studio.pricePerHour * req.durationHours };
}

export type SlotState = 'free' | 'busy' | 'past' | 'closed';

/** Bir soatlik katakning holati (vaqtlar to‘rida ko‘rsatish uchun). */
export function slotState(
  studio: StudioHours,
  date: ISODate,
  start: number,
  existing: Booking[],
  now: Date,
): SlotState {
    if (start < studio.openHour * 60) return 'closed';
  if (toDateTime(date, start).getTime() <= now.getTime()) return 'past';
  if (start + SLOT_STEP_MINUTES > studio.closeHour * 60) return 'closed';
  const range = { start, end: start + SLOT_STEP_MINUTES };
  return findConflicts({ studioId: studio.id, date, ...range }, existing).length ? 'busy' : 'free';
}
