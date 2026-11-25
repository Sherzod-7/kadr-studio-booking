import { STUDIO_TYPE_LABELS, type StudioType } from '../data/studios';

export function TypeTag({ type }: { type: StudioType }) {
  return (
    <span className={`type-tag type-tag--${type}`}>
      <span className="type-tag__dot" aria-hidden="true" />
      {STUDIO_TYPE_LABELS[type]}
    </span>
  );
}
