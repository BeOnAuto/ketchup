declare global {
  interface Window {
    __KETCHUP_API__?: string;
  }
}

export function apiBase(): string {
  return window.__KETCHUP_API__ ?? '';
}

export function wsBase(): string {
  const base = window.__KETCHUP_API__;
  if (base) {
    return base.replace(/^http/, 'ws');
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}`;
}
