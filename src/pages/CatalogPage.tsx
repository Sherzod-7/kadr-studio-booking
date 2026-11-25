import { Filters, type TypeFilter } from '../components/Filters';
import { StudioCard } from '../components/StudioCard';
import { districts, studios, STUDIO_TYPE_LABELS, type StudioType } from '../data/studios';
import { href, replace, useLocation } from '../lib/router';

const isType = (v: string | null): v is StudioType => !!v && v in STUDIO_TYPE_LABELS;

export function CatalogPage() {
  const { query } = useLocation();
  const t = query.get('tur');
  const type: TypeFilter = isType(t) ? t : 'all';
  const d = query.get('hudud') ?? '';
  const district = districts.includes(d) ? d : '';

  const setFilters = (next: { type?: TypeFilter; district?: string }) => {
    const nt = next.type ?? type;
    const nd = next.district ?? district;
    replace(href('/', { tur: nt === 'all' ? undefined : nt, hudud: nd || undefined }));
  };

  const list = studios.filter((s) => (type === 'all' || s.type === type) && (!district || s.district === district));

  return (
    <div className="container catalog">
      <div className="catalog__head">
        <h1 tabIndex={-1} data-page-title>
          Studiya toping
        </h1>
        <p className="catalog__lead">Foto, video va podkast uchun Toshkentdagi studiyalar — soatbay bron.</p>
      </div>
      <Filters
        type={type}
        district={district}
        districts={districts}
        onType={(v) => setFilters({ type: v })}
        onDistrict={(v) => setFilters({ district: v })}
      />
      <p className="result-count" role="status">
        {list.length > 0 ? `${list.length} ta studiya` : 'Mos studiya topilmadi'}
      </p>
      {list.length > 0 ? (
        <ul className="grid">
          {list.map((s, i) => (
            <StudioCard key={s.id} studio={s} priority={i < 2} />
          ))}
        </ul>
      ) : (
        <div className="empty">
          <p className="empty__title">Bu filtrlar bo‘yicha studiya yo‘q</p>
          <p className="muted">Boshqa tur yoki tumanni tanlab ko‘ring.</p>
          <button type="button" className="btn btn--secondary" onClick={() => replace(href('/'))}>
            Filtrlarni tozalash
          </button>
        </div>
      )}
    </div>
  );
}
