// Boshqa mijozlarning namunaviy bronlari. Sana har safar bugungi kunga nisbatan hisoblanadi,
// shuning uchun namoyish istalgan kuni bir xil ishlaydi.
//
// Asosiy demo: "Yorug‘ Loft" studiyasida ERTAGA 15:00–16:00 band.
//   • 14:00 dan 1 soat  → tasdiqlanadi (14:00–15:00).
//   • 14:00 dan 2 soat  → rad etiladi, 15:00–16:00 band ekani aytiladi va bo‘sh vaqt taklif qilinadi.
// "Oq Siklorama"da ham ertaga 14:00–16:00 band — boshqa studiyadagi bron Loftga xalaqit bermaydi.
import type { Booking } from '../booking/rules';
import { addDays, toISODate } from '../lib/dates';

export const DEMO_STUDIO_ID = 'yorug-loft';
export const DEMO_BUSY = { dayOffset: 1, startHour: 15, endHour: 16 } as const;

type Seed = [studioId: string, dayOffset: number, startHour: number, endHour: number];

const SEEDS: Seed[] = [
  ['yorug-loft', 1, DEMO_BUSY.startHour, DEMO_BUSY.endHour],
  ['yorug-loft', 1, 19, 21],
  ['yorug-loft', 2, 10, 12],
  ['yorug-loft', 0, 18, 20],
  ['siklorama', 1, 14, 16],
  ['siklorama', 2, 9, 11],
  ['kadr-sahna', 1, 12, 15],
  ['kadr-sahna', 0, 19, 22],
  ['neon-box', 1, 18, 20],
  ['neon-box', 3, 15, 17],
  ['sado-podkast', 1, 11, 13],
  ['sado-podkast', 1, 16, 17],
  ['suhbat-xonasi', 1, 14, 16],
  ['suhbat-xonasi', 2, 17, 19],
];

export function getDemoBookings(now = new Date()): Booking[] {
  const today = toISODate(now);
  return SEEDS.map(([studioId, offset, sh, eh], i) => ({
    id: `demo-${i}`,
    studioId,
    date: addDays(today, offset),
    start: sh * 60,
    end: eh * 60,
    total: 0,
    createdAt: today,
  }));
}
