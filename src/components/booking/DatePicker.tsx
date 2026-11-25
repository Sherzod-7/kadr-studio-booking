import { useEffect, useRef } from 'react';
import type { ISODate } from '../../lib/dates';
import { parseISODate } from '../../lib/dates';
import { MONTHS, WEEKDAYS_SHORT, formatDateLong, relativeDayLabel } from '../../lib/format';

interface Props {
  dates: ISODate[];
  today: ISODate;
  value: ISODate;
  onChange: (d: ISODate) => void;
}

export function DatePicker({ dates, today, value, onChange }: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  // Tanlangan sana ko‘rinib turishi uchun (masalan, URL’dan kelganda).
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('input:checked')?.parentElement;
    if (el && listRef.current) {
      const box = listRef.current;
      const left = el.offsetLeft - box.offsetLeft - 8;
      if (left < box.scrollLeft || left + el.offsetWidth > box.scrollLeft + box.clientWidth) box.scrollLeft = left;
    }
  }, [value]);

  return (
    <fieldset className="field">
      <legend className="field__label">Sana</legend>
      <div className="date-strip" ref={listRef}>
        {dates.map((iso) => {
          const d = parseISODate(iso);
          const rel = relativeDayLabel(iso, today);
          return (
            <label key={iso} className="date-chip" title={formatDateLong(iso)}>
              <input
                type="radio"
                name="date"
                value={iso}
                checked={value === iso}
                onChange={() => onChange(iso)}
                aria-label={`${rel ? `${rel}, ` : ''}${formatDateLong(iso)}`}
              />
              <span className="date-chip__top">{rel ?? WEEKDAYS_SHORT[d.getDay()]}</span>
              <span className="date-chip__day">{d.getDate()}</span>
              <span className="date-chip__month">{MONTHS[d.getMonth()].slice(0, 3)}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
