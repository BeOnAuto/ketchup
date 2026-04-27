import { describe, expect, it } from 'vitest';

import { prepareWebviewHtml } from './prepare-webview-html';

describe('prepareWebviewHtml', () => {
  it('rewrites root-relative asset paths and injects the API base before the SPA bundle', () => {
    const source = [
      '<!doctype html>',
      '<html>',
      '  <head>',
      '    <link rel="stylesheet" href="/assets/index-abc.css" />',
      '  </head>',
      '  <body>',
      '    <div id="root"></div>',
      '    <script type="module" src="/assets/index-def.js"></script>',
      '  </body>',
      '</html>',
    ].join('\n');

    const result = prepareWebviewHtml(source, {
      assetBase: 'https://webview.host/abc',
      apiBase: 'http://127.0.0.1:4324',
    });

    expect(result).toContain('href="https://webview.host/abc/assets/index-abc.css"');
    expect(result).toContain('src="https://webview.host/abc/assets/index-def.js"');
    expect(result).toContain('window.__KETCHUP_API__ = "http://127.0.0.1:4324"');
    expect(result.indexOf('window.__KETCHUP_API__')).toBeLessThan(result.indexOf('/assets/index-def.js'));
  });
});
