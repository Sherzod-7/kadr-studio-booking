import { useEffect, useMemo, useRef, useState } from 'react';
import { bookingRepository } from '../../booking/repository';
import {
  ALLOWED_DURATIONS,
  slotState,
  toRange,
  validateRequest,
  type BookingDecision,
  type TimeRange,
} from '../../booking/rules';
import { invalidMessage } from '../../booking/messages';
import type { Studio } from '../../data/studios';
import { useBusy, useNow } from '../../hooks/useBookings';
import { addDays, isValidISODate, toISODate, type ISODate } from '../../lib/dates';
import { formatDateFriendly, formatDuration, formatPrice, formatRange, formatTime } from '../../lib/format';
import { href, navigate, replace, useLocation } from '../../lib/router';
import { DatePicker } from './DatePicker';
import { TimeGrid } from './TimeGrid';

const DAYS_AHEAD = 14;

type Result =
  | { kind: 'conflict'; decision: Extract<BookingDecision, { status: 'conflict' }> }
  | { kind: 'invalid'; message: string }
  | { kind: 'error'; message: string };

function parseTime(v: string | null): number | null {
  const m = v?.match(/^(\d{1,2}):00$/);
  return m ? Number(m[1]) * 60 : null;
}

function defaultDate(studio: Studio, now: Date): ISODate {
  const today = toISODate(now);
  const lastStart = new Date(now);
  lastStart.setHours(studio.closeHour - 1, 0, 0, 0);
  return now < lastStart ? today : addDays(today, 1);
}

export function BookingPanel({ studio }: { studio: Studio }) {
  const now = useNow();
  const today = toISODate(now);
  const { query } = useLocation();

  // Boshlang‘ich tanlov URL’dan olinadi — sahifa yangilansa ham saqlanadi.
  const [date, setDate] = useState<ISODate>(() => {
    const q = query.get('sana');
    return isValidISODate(q) && q >= today ? q : defaultDate(studio, now);
  });
  const [start, setStart] = useState<number | null>(() => parseTime(query.get('vaqt')));
  const [duration, setDuration] = useState<number>(() => {
    const d = Number(query.get('soat'));
    return (ALLOWED_DURATIONS as readonly number[]).includes(d) ? d : 1;
  });
  const [result, setResult] = useState<Result | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);

  const busy = useBusy(studio.id, date);
  const dates = useMemo(() => Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(today, i)), [today]);

  // Tanlovni URL’ga yozib boramiz (tarixga yangi yozuv qo‘shmasdan).
  useEffect(() => {
    // Bron tasdiqlanib natija sahifasiga o‘tilgan bo‘lsa, URL’ga tegmaymiz.
    if (!window.location.hash.startsWith(`#/studiya/${studio.id}`)) return;
    replace(
      href(`/studiya/${studio.id}`, {
        sana: date,
        vaqt: start !== null ? formatTime(start) : undefined,
        soat: duration,
      }),
    );
  }, [studio.id, date, start, duration]);

  // Sana o‘zgarganda tanlangan soat yangi kunda band yoki o‘tgan bo‘lsa — tozalanadi.
  useEffect(() => {
    if (start === null || !busy) return;
    const st = slotState(studio, date, start, busy, now);
    if (st !== 'free') setStart(null);
  }, [date, busy]);

  const clearFeedback = () => {
    setResult(null);
    setNotice(null);
  };

  const range: TimeRange | null = start !== null ? toRange(start, duration) : null;
  const total = studio.pricePerHour * duration;
  const invalid =
    start !== null ? validateRequest({ studioId: studio.id, date, start, durationHours: duration }, studio, now) : null;
  const canSubmit = start !== null && !invalid && !submitting;

  async function submit() {
    if (start === null) return;
    setSubmitting(true);
    setNotice(null);
    try {
      const res = await bookingRepository.create({ studioId: studio.id, date, start, durationHours: duration });
      if (res.status === 'accepted' && res.booking) {
        navigate(href(`/bron/${res.booking.id}`));
        return;
      }
      if (res.status === 'conflict') setResult({ kind: 'conflict', decision: res });
      else if (res.status === 'invalid') setResult({ kind: 'invalid', message: invalidMessage(res.code, studio, res.range) });
    } catch {
      setResult({ kind: 'error', message: 'Bronni saqlab bo‘lmadi. Qayta urinib ko‘ring.' });
    } finally {
      setSubmitting(false);
    }
  }

  function applySuggestion(s: TimeRange) {
    setStart(s.start);
    setResult(null);
    setNotice(`Vaqt ${formatRange(s.start, s.end)} ga o‘zgartirildi. Studiya, sana va davomiylik o‘sha-o‘sha. Endi “Bron qilish” tugmasini bosing.`);
    requestAnimationFrame(() => submitRef.current?.focus());
  }

  return (
    <section className="booking" id="bron" aria-labelledby="bron-title" tabIndex={-1}>
      <div className="booking__head">
        <h2 id="bron-title">Vaqt tanlash</h2>
        <p className="price">
          <strong>{formatPrice(studio.pricePerHour)}</strong> <span>/ soat</span>
        </p>
      </div>
      <p className="booking__hours">
        Ish vaqti: {formatTime(studio.openHour * 60)}–{formatTime(studio.closeHour * 60)}
      </p>

      <DatePicker
        dates={dates}
        today={today}
        value={date}
        onChange={(d) => {
          setDate(d);
          clearFeedback();
        }}
      />

      <TimeGrid
        studio={studio}
        date={date}
        busy={busy}
        now={now}
        value={start}
        onChange={(m) => {
          setStart(m);
          clearFeedback();
        }}
      />

      <fieldset className="field">
        <legend className="field__label">Davomiylik</legend>
        <div className="segmented">
          {ALLOWED_DURATIONS.map((d) => (
            <label key={d} className="segmented__item">
              <input
                type="radio"
                name="duration"
                value={d}
                checked={duration === d}
                onChange={() => {
                  setDuration(d);
                  clearFeedback();
                }}
              />
              <span>{formatDuration(d)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="summary" aria-live="polite">
        {range ? (
          <>
            <p className="summary__date">{formatDateFriendly(date, now)}</p>
            <p className="summary__main">
              {formatRange(range.start, range.end)} · {formatPrice(total)}
            </p>
            <p className="summary__calc">
              {formatDuration(duration)} × {formatPrice(studio.pricePerHour)}
            </p>
          </>
        ) : (
          <p className="summary__empty">Bo‘sh vaqtni tanlang — oraliq va jami narx shu yerda chiqadi.</p>
        )}
        {invalid && range && (
          <p className="inline-warning" role="status">
            {invalidMessage(invalid, studio, range)}
          </p>
        )}
        {notice && <p className="inline-note">{notice}</p>}
      </div>

      <button ref={submitRef} type="button" className="btn btn--primary btn--block" disabled={!canSubmit} onClick={submit}>
        {submitting ? 'Tekshirilmoqda…' : 'Bron qilish'}
      </button>

      {result && (
        <div className={`result result--${result.kind}`} role="alert">
          {result.kind === 'conflict' ? (
            <ConflictMessage
              decision={result.decision}
              duration={duration}
              pricePerHour={studio.pricePerHour}
              onPick={applySuggestion}
            />
          ) : (
            <p>{result.message}</p>
          )}
        </div>
      )}
    </section>
  );
}

function ConflictMessage({
  decision,
  duration,
  pricePerHour,
  onPick,
}: {
  decision: Extract<BookingDecision, { status: 'conflict' }>;
  duration: number;
  pricePerHour: number;
  onPick: (r: TimeRange) => void;
}) {
  const { range, conflicts, suggestions } = decision;
  const busyText = conflicts.map((c) => formatRange(c.start, c.end)).join(', ');
  return (
    <>
      <p className="result__title">
        <span aria-hidden="true">✕ </span>Bron rad etildi: bu vaqt band
      </p>
      <p>
        Siz tanlagan <strong>{formatRange(range.start, range.end)}</strong> vaqti band oraliq bilan kesishadi:{' '}
        <strong>{busyText}</strong> allaqachon bron qilingan.
      </p>
      {suggestions.length > 0 ? (
        <>
          <p className="result__sub">{formatDuration(duration)}lik eng yaqin bo‘sh vaqt:</p>
          <div className="suggestions">
            {suggestions.map((s, i) => (
              <button
                key={s.start}
                type="button"
                className={`btn ${i === 0 ? 'btn--secondary' : 'btn--ghost'} suggestion`}
                onClick={() => onPick(s)}
              >
                <span className="suggestion__time">{formatRange(s.start, s.end)}</span>
                <span className="suggestion__price">{formatPrice(pricePerHour * duration)}</span>
                {i === 0 && <span className="suggestion__tag">Eng yaqin</span>}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="result__sub">
          Bu kunda {formatDuration(duration)}lik bo‘sh vaqt qolmagan. Boshqa kunni yoki qisqaroq davomiylikni tanlang.
        </p>
      )}
    </>
  );
}
