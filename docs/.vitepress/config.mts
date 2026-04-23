import { defineConfig } from 'vitepress';

const base = '/';
const siteUrl = 'https://ketchup.on.auto';

export default defineConfig({
  base,
  lang: 'en-US',
  title: 'Ketchup',
  description:
    'Turn every AI mistake into a rule AI can\'t repeat. Ketchup runs 15+ LLM-powered guardrails on every AI commit, so bad commits don\'t land.',
  appearance: 'dark',

  themeConfig: {
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg',
    },
    nav: [
      {
        text: 'Documentation',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Installation', link: '/installation' },
          { text: 'Configuration', link: '/configuration' },
          { text: 'Hooks Guide', link: '/hooks-guide' },
          { text: 'Reminders Guide', link: '/reminders-guide' },
          { text: 'Validators Guide', link: '/validators-guide' },
          { text: 'API Reference', link: '/api-reference' },
          { text: 'Architecture', link: '/architecture' },
        ],
      },
      { text: 'Guardrail Engineering', link: '/guardrail-engineering' },
      { text: 'The Ketchup Technique', link: '/ketchup-technique' },
      { text: 'Origin Story', link: '/origin-story' },
      {
        text: 'GitHub',
        link: 'https://github.com/BeOnAuto/auto-ketchup',
      },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Installation', link: '/installation' },
        ],
      },
      {
        text: 'Methodology',
        items: [
          { text: 'Guardrail Engineering', link: '/guardrail-engineering' },
          { text: 'The Ketchup Technique', link: '/ketchup-technique' },
          { text: 'Origin Story', link: '/origin-story' },
        ],
      },
      {
        text: 'Guides',
        items: [
          { text: 'Hooks', link: '/hooks-guide' },
          { text: 'Reminders', link: '/reminders-guide' },
          { text: 'Validators', link: '/validators-guide' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Configuration', link: '/configuration' },
          { text: 'API Reference', link: '/api-reference' },
          { text: 'Architecture', link: '/architecture' },
          { text: 'Operational Concerns', link: '/operational-concerns' },
        ],
      },
    ],

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/BeOnAuto/auto-ketchup/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/BeOnAuto/auto-ketchup' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2025 BeOnAuto, Inc.',
    },
  },

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        href: `${base}favicon-96x96.png`,
        sizes: '96x96',
      },
    ],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['link', { rel: 'shortcut icon', href: `${base}favicon.ico` }],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: `${base}apple-touch-icon.png`,
      },
    ],
    ['link', { rel: 'manifest', href: `${base}site.webmanifest` }],
    [
      'meta',
      {
        property: 'og:title',
        content: 'Ketchup - Turn every AI mistake into a rule AI can\'t repeat.',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Ketchup runs 15+ LLM-powered guardrails on every AI commit, so bad commits don\'t land.',
      },
    ],
    [
      'meta',
      {
        property: 'og:url',
        content: siteUrl,
      },
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: `${siteUrl}/og-image.png`,
      },
    ],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    [
      'meta',
      {
        property: 'og:image:alt',
        content: 'Ketchup - Turn every AI mistake into a rule AI can\'t repeat.',
      },
    ],
    ['meta', { property: 'og:site_name', content: 'Ketchup' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    [
      'meta',
      {
        name: 'twitter:title',
        content: 'Ketchup - Turn every AI mistake into a rule AI can\'t repeat.',
      },
    ],
    [
      'meta',
      {
        name: 'twitter:description',
        content:
          'Ketchup runs 15+ LLM-powered guardrails on every AI commit, so bad commits don\'t land.',
      },
    ],
    [
      'meta',
      {
        name: 'twitter:image',
        content: `${siteUrl}/og-image.png`,
      },
    ],
  ],
});
