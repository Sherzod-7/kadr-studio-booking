import { STUDIO_TYPE_LABELS, type StudioType } from '../data/studios';

export type TypeFilter = StudioType | 'all';

interface Props {
  type: TypeFilter;
  district: string;
  districts: string[];
  onType: (t: TypeFilter) => void;
  onDistrict: (d: string) => void;
}

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'Barchasi' },
  ...(Object.keys(STUDIO_TYPE_LABELS) as StudioType[]).map((t) => ({ value: t, label: STUDIO_TYPE_LABELS[t] })),
];

export function Filters({ type, district, districts, onType, onDistrict }: Props) {
  return (
    <div className="filters">
      <fieldset className="chips" aria-label="Studiya turi">
        <legend className="sr-only">Studiya turi</legend>
        {TYPE_OPTIONS.map((o) => (
          <label key={o.value} className="chip">
            <input
              type="radio"
              name="studio-type"
              value={o.value}
              checked={type === o.value}
              onChange={() => onType(o.value)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </fieldset>
      <label className="select-field">
        <span className="select-field__label">Hudud</span>
        <select value={district} onChange={(e) => onDistrict(e.target.value)}>
          <option value="">Barcha tumanlar</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
