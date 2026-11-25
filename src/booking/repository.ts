// Bronlarni saqlash qatlami. Hozir localStorage, keyin backend API bilan almashtiriladi:
// faqat BookingRepository interfeysini amalga oshiruvchi yangi klass yozish kifoya
// (masalan, HttpBookingRepository: GET /studios/:id/bookings?date=..., POST /bookings).
import { getDemoBookings } from '../data/demoBookings';
import { getStudio } from '../data/studios';
import { decideBooking, type Booking, type BookingDecision, type BookingRequest } from './rules';
import type { ISODate } from '../lib/dates';

export type CreateResult = BookingDecision & { booking?: Booking };

export interface BookingRepository {
  /** Studiyaning shu sanadagi barcha band oraliqlari (boshqa mijozlarniki ham). */
  getBusy(studioId: string, date: ISODate): Promise<Booking[]>;
  /** Shu brauzerda qilingan bronlar. */
  listMine(): Promise<Booking[]>;
  getMine(id: string): Promise<Booking | undefined>;
  create(req: BookingRequest): Promise<CreateResult>;
  cancel(id: string): Promise<void>;
  /** Faqat demo uchun: o‘z bronlarini o‘chirib, boshlang‘ich holatga qaytarish. */
  resetDemo(): Promise<void>;
}

const STORAGE_KEY = 'kadr.bookings.v1';
export const BOOKINGS_CHANGED = 'kadr:bookings-changed';

/** localStorage ishlamasa (maxfiy rejim, cheklov), xotirada saqlab turamiz. */
class SafeStore {
  private memory: string | null = null;
  read(): string | null {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return this.memory;
    }
  }
  write(value: string) {
    this.memory = value;
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* xotirada qoladi */
    }
  }
}

function isBooking(v: unknown): v is Booking {
  const b = v as Booking;
  return (
    !!b &&
    typeof b.id === 'string' &&
    typeof b.studioId === 'string' &&
    typeof b.date === 'string' &&
    typeof b.start === 'number' &&
    typeof b.end === 'number'
  );
}

export class LocalBookingRepository implements BookingRepository {
  private store = new SafeStore();
  private now: () => Date;

  constructor(now: () => Date = () => new Date()) {
    this.now = now;
  }

  private readMine(): Booking[] {
    const raw = this.store.read();
    if (!raw) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(isBooking) : [];
    } catch {
      return [];
    }
  }

  private writeMine(list: Booking[]) {
    this.store.write(JSON.stringify(list));
    window.dispatchEvent(new Event(BOOKINGS_CHANGED));
  }

  private all(): Booking[] {
    return [...getDemoBookings(this.now()), ...this.readMine()];
  }

  async getBusy(studioId: string, date: ISODate) {
    return this.all()
      .filter((b) => b.studioId === studioId && b.date === date)
      .sort((a, b) => a.start - b.start);
  }

  async listMine() {
    return this.readMine().sort((a, b) => a.date.localeCompare(b.date) || a.start - b.start);
  }

  async getMine(id: string) {
    return this.readMine().find((b) => b.id === id);
  }

  async create(req: BookingRequest): Promise<CreateResult> {
    const studio = getStudio(req.studioId);
    if (!studio) throw new Error('Studiya topilmadi');
    // Har safar saqlangan ma'lumotni yangidan o‘qiymiz — boshqa vkladkada qilingan bron ham hisobga olinadi.
    const decision = decideBooking(req, studio, this.all(), this.now());
    if (decision.status !== 'accepted') return decision;

    const booking: Booking = {
      id: `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      studioId: req.studioId,
      date: req.date,
      start: decision.range.start,
      end: decision.range.end,
      total: decision.total,
      createdAt: this.now().toISOString(),
    };
    this.writeMine([...this.readMine(), booking]);
    return { ...decision, booking };
  }

  async cancel(id: string) {
    this.writeMine(this.readMine().filter((b) => b.id !== id));
  }

  async resetDemo() {
    this.writeMine([]);
  }
}

export const bookingRepository: BookingRepository = new LocalBookingRepository();
