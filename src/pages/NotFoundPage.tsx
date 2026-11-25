export function NotFoundPage({ text = 'Sahifa topilmadi.' }: { text?: string }) {
  return (
    <div className="container narrow empty">
      <h1 tabIndex={-1} data-page-title className="empty__title">
        {text}
      </h1>
      <a className="btn btn--secondary" href="#/">
        Katalogga qaytish
      </a>
    </div>
  );
}
