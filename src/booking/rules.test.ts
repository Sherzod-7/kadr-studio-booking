import { describe, expect, it } from 'vitest';
import { decideBooking, findFreeSlots, overlaps, slotState, type Booking } from './rules';
import { getDemoBookings, DEMO_STUDIO_ID } from '../data/demoBookings';
import { getStudio } from '../data/studios';
import { addDays, toISODate } from '../lib/dates';
import { formatPrice, formatRange } from '../lib/format';

const now = new Date(2026, 10, 25, 20, 59); // 25-noyabr, 20:59
const today = toISODate(now);
const tomorrow = addDays(today, 1);
const loft = getStudio(DEMO_STUDIO_ID)!;
const demo = getDemoBookings(now);
const H = (h: number) => h * 60;

describe('kesishish qoidasi', () => {
  it('yarim ochiq oraliqlar', () => {
    expect(overlaps({ start: H(14), end: H(16) }, { start: H(15), end: H(16) })).toBe(true);
    expect(overlaps({ start: H(14), end: H(16) }, { start: H(16), end: H(17) })).toBe(false);
  });

  it('14:00–16:00 band bo‘lsa 15:00–16:00 rad, 16:00–17:00 qabul', () => {
    const existing: Booking[] = [
      { id: 'x', studioId: loft.id, date: tomorrow, start: H(14), end: H(16), total: 0, createdAt: '' },
    ];
    expect(decideBooking({ studioId: loft.id, date: tomorrow, start: H(15), durationHours: 1 }, loft, existing, now).status).toBe('conflict');
    expect(decideBooking({ studioId: loft.id, date: tomorrow, start: H(16), durationHours: 1 }, loft, existing, now).status).toBe('accepted');
  });

  it('boshqa studiyaning broni xalaqit bermaydi', () => {
    const existing: Booking[] = [
      { id: 'x', studioId: 'siklorama', date: tomorrow, start: H(14), end: H(16), total: 0, createdAt: '' },
    ];
    expect(decideBooking({ studioId: loft.id, date: tomorrow, start: H(14), durationHours: 2 }, loft, existing, now).status).toBe('accepted');
  });
});

describe('demo stsenariysi', () => {
  it('ertaga 14:00 bo‘sh, 15:00 band', () => {
    expect(slotState(loft, tomorrow, H(14), demo, now)).toBe('free');
    expect(slotState(loft, tomorrow, H(15), demo, now)).toBe('busy');
  });

  it('1-holat: 14:00 dan 1 soat tasdiqlanadi', () => {
    const d = decideBooking({ studioId: loft.id, date: tomorrow, start: H(14), durationHours: 1 }, loft, demo, now);
    expect(d.status).toBe('accepted');
    if (d.status === 'accepted') expect(formatPrice(d.total)).toBe('180 000 so‘m');
  });

  it('2-holat: 14:00 dan 2 soat rad etiladi va eng yaqin bo‘sh vaqt taklif qilinadi', () => {
    const d = decideBooking({ studioId: loft.id, date: tomorrow, start: H(14), durationHours: 2 }, loft, demo, now);
    expect(d.status).toBe('conflict');
    if (d.status !== 'conflict') return;
    expect(d.conflicts.map((c) => formatRange(c.start, c.end))).toEqual(['15:00–16:00']);
    expect(d.suggestions.map((c) => formatRange(c.start, c.end))).toEqual(['13:00–15:00', '16:00–18:00']);
    // taklif haqiqatan ham tasdiqlanadi
    const s = d.suggestions[0];
    expect(decideBooking({ studioId: loft.id, date: tomorrow, start: s.start, durationHours: 2 }, loft, demo, now).status).toBe('accepted');
  });
});

describe('vaqt cheklovlari', () => {
    it('studiya 08:00 da yopiq, 09:00 da ochiq', () => {
    expect(slotState(loft, tomorrow, H(8), [], now)).toBe('closed');
    expect(slotState(loft, tomorrow, H(9), [], now)).toBe('free');
  });
  it('o‘tgan vaqt rad etiladi', () => {
    const d = decideBooking({ studioId: loft.id, date: today, start: H(20), durationHours: 1 }, loft, demo, now);
    expect(d).toMatchObject({ status: 'invalid', code: 'past' });
  });

  it('yopilish vaqtidan oshsa rad etiladi', () => {
    const d = decideBooking({ studioId: loft.id, date: tomorrow, start: H(19 + 0), durationHours: 3 }, loft, [], now);
    expect(d).toMatchObject({ status: 'invalid', code: 'after-close' });
    expect(decideBooking({ studioId: loft.id, date: tomorrow, start: H(18), durationHours: 3 }, loft, [], now).status).toBe('accepted');
  });

  it('bo‘sh vaqt topilmasa bo‘sh ro‘yxat', () => {
    const full: Booking[] = [
      { id: 'f', studioId: loft.id, date: tomorrow, start: H(9), end: H(21), total: 0, createdAt: '' },
    ];
    expect(findFreeSlots(loft, tomorrow, 2, full, now, H(14))).toEqual([]);
  });
});
