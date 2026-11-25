import { SLOT_STEP_MINUTES, slotState, type Booking, type SlotState } from '../../booking/rules';
import type { Studio } from '../../data/studios';
import type { ISODate } from '../../lib/dates';
import { formatTime } from '../../lib/format';

interface Props {
  studio: Studio;
  date: ISODate;
  busy: Booking[] | null;
  now: Date;
  value: number | null;
  onChange: (start: number) => void;
}

const STATE_TEXT: Record<SlotState | 'selected', string> = {
  free: 'Bo‘sh',
  busy: 'Band',
  past: 'O‘tgan',
  closed: 'Yopiq',
  selected: 'Tanlandi',
};

const STATE_ICON: Record<SlotState | 'selected', string> = {
  free: '',
  busy: '✕',
  past: '–',
  closed: '–',
  selected: '✓',
};

export function TimeGrid({ studio, date, busy, now, value, onChange }: Props) {
  const starts: number[] = [];
  for (let m = studio.openHour * 60; m < studio.closeHour * 60; m += SLOT_STEP_MINUTES) starts.push(m);
  const states = starts.map((m) => (busy ? slotState(studio, date, m, busy, now) : null));
  const freeCount = states.filter((s) => s === 'free').length;

  return (
    <fieldset className="field">
      <legend className="field__label">Boshlanish vaqti</legend>
      <ul className="legend" aria-hidden="true">
        <li><span className="legend__swatch legend__swatch--free" />Bo‘sh</li>
        <li><span className="legend__swatch legend__swatch--selected">✓</span>Tanlangan</li>
        <li><span className="legend__swatch legend__swatch--busy">✕</span>Band</li>
      </ul>
      {busy === null ? (
        <p className="muted" role="status">Bandlik yuklanmoqda…</p>
      ) : (
        <>
          {freeCount === 0 && (
            <p className="inline-warning" role="status">
              Bu kunda bo‘sh vaqt qolmagan. Boshqa sanani tanlang.
            </p>
          )}
          <div className="time-grid">
            {starts.map((m, i) => {
              const st = states[i] as SlotState;
              const selected = value === m && st === 'free';
              const key = selected ? 'selected' : st;
              return (
                <label key={m} className={`slot slot--${key}`}>
                  <input
                    type="radio"
                    name="start"
                    value={m}
                    checked={selected}
                    disabled={st !== 'free'}
                    onChange={() => onChange(m)}
                    aria-label={`${formatTime(m)}, ${STATE_TEXT[key].toLowerCase()}`}
                  />
                  <span className="slot__time">{formatTime(m)}</span>
                  <span className="slot__state">
                    {STATE_ICON[key] && <span aria-hidden="true">{STATE_ICON[key]} </span>}
                    {STATE_TEXT[key]}
                  </span>
                </label>
              );
            })}
          </div>
        </>
      )}
    </fieldset>
  );
}
