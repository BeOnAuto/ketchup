import { afterEach, describe, expect, it } from 'vitest';

import { apiBase, wsBase } from './api-base';

declare global {
  interface Window {
    __KETCHUP_API__?: string;
  }
}

afterEach(() => {
  window.__KETCHUP_API__ = undefined;
});

describe('apiBase / wsBase', () => {
  it('uses the injected base when set, otherwise falls back to relative URLs and the page host', () => {
    const beforeInjected = { api: apiBase(), ws: wsBase() };
    window.__KETCHUP_API__ = 'http://127.0.0.1:4321';
    const afterInjected = { api: apiBase(), ws: wsBase() };

    expect({ beforeInjected, afterInjected }).toEqual({
      beforeInjected: { api: '', ws: `ws://${window.location.host}` },
      afterInjected: { api: 'http://127.0.0.1:4321', ws: 'ws://127.0.0.1:4321' },
    });
  });
});
