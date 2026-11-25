// Qoida kodlarini foydalanuvchiga tushunarli o‘zbekcha matnga aylantirish.
import { formatRange, formatTime } from '../lib/format';
import type { InvalidCode, StudioHours, TimeRange } from './rules';

export function invalidMessage(code: InvalidCode, studio: StudioHours, range: TimeRange): string {
  switch (code) {
    case 'past':
      return `${formatTime(range.start)} allaqachon o‘tib ketgan. Keyingi bo‘sh vaqtni tanlang.`;
    case 'before-open':
      return `Studiya ${formatTime(studio.openHour * 60)} da ochiladi.`;
    case 'after-close': {
      const maxHours = Math.max(0, studio.closeHour - range.start / 60);
      const hint =
        maxHours >= 1
          ? ` ${formatTime(range.start)} dan ko‘pi bilan ${maxHours} soat bron qilish mumkin.`
          : '';
      return `${formatRange(range.start, range.end)} studiya yopilish vaqtidan (${formatTime(studio.closeHour * 60)}) oshib ketadi.${hint}`;
    }
    case 'invalid-duration':
      return 'Davomiylik 1, 2 yoki 3 soat bo‘lishi kerak.';
  }
}
