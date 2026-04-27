export interface PrepareWebviewHtmlOptions {
  assetBase: string;
  apiBase: string;
}

export function prepareWebviewHtml(source: string, options: PrepareWebviewHtmlOptions): string {
  const rewritten = source.replace(/(href|src)="\/(assets\/[^"]+)"/g, (_match, attr, path) => {
    return `${attr}="${options.assetBase}/${path}"`;
  });
  const inject = `<script>window.__KETCHUP_API__ = ${JSON.stringify(options.apiBase)}</script>`;
  return rewritten.replace('</head>', `${inject}\n</head>`);
}
