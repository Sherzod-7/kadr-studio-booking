// Kichik hash-router: '#/studiya/yorug-loft?sana=2026-11-26'.
// Hash tanlangani uchun build istalgan statik hostingda server sozlamasisiz ishlaydi.
import { useSyncExternalStore } from 'react';

export interface Location {
  path: string;
  query: URLSearchParams;
}

function read(): Location {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  return { path: path || '/', query: new URLSearchParams(qs) };
}

let current = read();
const listeners = new Set<() => void>();

function emit() {
  current = read();
  listeners.forEach((l) => l());
}

window.addEventListener('hashchange', emit);

export function useLocation(): Location {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );
}

export function href(path: string, query?: Record<string, string | number | undefined | null>): string {
  const qs = new URLSearchParams();
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
    }
  }
  const s = qs.toString();
  return `#${path}${s ? `?${s}` : ''}`;
}

export function navigate(to: string) {
  window.location.hash = to.replace(/^#/, '');
}

/** Tarixga yangi yozuv qo‘shmasdan URL’ni yangilash (filtr va tanlovlarni saqlash uchun). */
export function replace(to: string) {
  const url = `${window.location.pathname}${window.location.search}${to}`;
  window.history.replaceState(window.history.state, '', url);
  emit();
}

export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean);
  const a = path.split('/').filter(Boolean);
  if (p.length !== a.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(a[i]);
    else if (p[i] !== a[i]) return null;
  }
  return params;
}
